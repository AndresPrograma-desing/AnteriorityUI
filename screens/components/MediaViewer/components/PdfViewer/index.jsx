import React, { useState, useRef, useEffect, useCallback } from 'react';
import Loading from '../../../Loading/index';
import ScrollBar from '../../../ScrollBar/index';
import ErrorState from '../../../ErrorState/index';
import { PdfControlsBar } from './components/index.js';
import styles from './index.module.css';
import {
  DEFAULT_PDF_ERROR_LABEL,
  DEFAULT_PDF_ACCENT,
  DEFAULT_PDF_TEXT_COLOR,
  DEFAULT_PDF_BG_COLOR,
  PDF_MIN_ZOOM,
  PDF_MAX_ZOOM,
  PDF_ZOOM_STEP,
  DEFAULT_PDF_ZOOM,
  PDF_VIEWPORT_HEIGHT,
  DEFAULT_LOADING_VARIANT,
  DEFAULT_LOADING_SIZE,
} from '../../constants.js';

// Visor de PDF renderizado con pdf.js directo a <canvas>, página por página — a diferencia de
// un <iframe src="archivo.pdf">, esto funciona igual en mobile (iOS Safari/Chrome Android no
// tienen un visor de PDF confiable embebible en iframe) porque pdf.js decodifica y dibuja el
// PDF él mismo, sin depender del visor nativo del browser/SO.
const PdfViewer = ({
  url,
  fileName,
  openLabel,
  downloadLabel,
  errorLabel = DEFAULT_PDF_ERROR_LABEL,
  accentColor = DEFAULT_PDF_ACCENT,
  textColor = DEFAULT_PDF_TEXT_COLOR,
  bgColor = DEFAULT_PDF_BG_COLOR,
  loadingVariant = DEFAULT_LOADING_VARIANT,
  loadingSize = DEFAULT_LOADING_SIZE,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_PDF_ZOOM);

  // Carga el documento cuando cambia la url. pdfjs-dist se importa dinámicamente (no al tope
  // del archivo) para no pagar su costo en componentes de la librería que nunca muestran un PDF.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setPage(1);
    setPageCount(null);

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString();

        const loadingTask = pdfjs.getDocument({ url });
        const doc = await loadingTask.promise;
        if (cancelled) {
          doc.destroy();
          return;
        }
        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setIsLoading(false);
      } catch {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [url]);

  // Token incremental: cada llamada a renderPage se identifica con un número propio, así un
  // render viejo que termina tarde (p.ej. cancelado pero ya había pintado algo) nunca pisa el
  // canvas después de que uno más nuevo ya lo hizo — sin esto, dos renders solapados (el efecto
  // de cambio de página y el ResizeObserver disparando casi al mismo tiempo) dejan el canvas con
  // contenido mezclado de dos páginas/escalas distintas.
  const renderTokenRef = useRef(0);

  // Renderiza la página actual al canvas, escalando según el zoom y el ancho disponible del
  // contenedor (para que en mobile el PDF arranque legible sin scroll horizontal).
  const renderPage = useCallback(async () => {
    const doc = pdfDocRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!doc || !canvas || !container || !container.clientWidth) return;

    const token = ++renderTokenRef.current;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const pdfPage = await doc.getPage(page);
    if (token !== renderTokenRef.current) return;

    const baseViewport = pdfPage.getViewport({ scale: 1 });
    const fitScale = (container.clientWidth - 16) / baseViewport.width;
    const viewport = pdfPage.getViewport({ scale: fitScale * zoom });

    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const renderTask = pdfPage.render({ canvasContext: context, viewport });
    renderTaskRef.current = renderTask;
    try {
      await renderTask.promise;
    } catch {
      // Cancelado por un render más nuevo (cambio de página/zoom mientras este corría); ignorar.
    }
    if (renderTaskRef.current === renderTask) renderTaskRef.current = null;
  }, [page, zoom]);

  useEffect(() => {
    if (!isLoading && !hasError) renderPage();
  }, [isLoading, hasError, renderPage]);

  // Re-renderiza al cambiar el ancho del contenedor (ej. rotación de pantalla en mobile). Se
  // ignora el primer disparo (montaje del observer), que coincide con el useEffect de arriba y
  // dispararía un segundo render redundante en simultáneo.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return undefined;
    let isFirstCallback = true;
    const observer = new ResizeObserver(() => {
      if (isFirstCallback) {
        isFirstCallback = false;
        return;
      }
      if (!isLoading && !hasError) renderPage();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [isLoading, hasError, renderPage]);

  const goToPrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPage((prev) => (pageCount ? Math.min(prev + 1, pageCount) : prev));
  const jumpToPage = (target) => {
    setPage(Math.min(Math.max(target, 1), pageCount || target));
  };
  const zoomIn = () => setZoom((prev) => Math.min(prev + PDF_ZOOM_STEP, PDF_MAX_ZOOM));
  const zoomOut = () => setZoom((prev) => Math.max(prev - PDF_ZOOM_STEP, PDF_MIN_ZOOM));

  return (
    <div className={styles.pdfViewer}>
      <div className={styles.canvasAreaOuter} style={{ backgroundColor: bgColor }}>
        <ScrollBar
          scrollAreaRef={containerRef}
          contentClassName={styles.canvasArea}
          reserveTrackSpace
          maxHeight={PDF_VIEWPORT_HEIGHT}
        >
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <Loading variant={loadingVariant} size={loadingSize} color={accentColor} />
            </div>
          )}
          {hasError ? (
            <ErrorState
              errorLabel={errorLabel}
              actionLabel={openLabel}
              onAction={() => window.open(url, '_blank', 'noopener,noreferrer')}
              textColor={textColor}
            />
          ) : (
            <canvas ref={canvasRef} className={styles.canvas} />
          )}
        </ScrollBar>
      </div>

      {!hasError && (
        <PdfControlsBar
          page={page}
          pageCount={pageCount}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          onJumpToPage={jumpToPage}
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          minZoom={PDF_MIN_ZOOM}
          maxZoom={PDF_MAX_ZOOM}
          downloadUrl={url}
          downloadLabel={downloadLabel}
          fileName={fileName}
          accentColor={accentColor}
          textColor={textColor}
        />
      )}
    </div>
  );
};

export default PdfViewer;
