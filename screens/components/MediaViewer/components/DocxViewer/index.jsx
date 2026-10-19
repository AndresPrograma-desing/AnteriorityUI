import React, { useState, useRef, useEffect } from 'react';
import Loading from '../../../Loading/index';
import ScrollBar from '../../../ScrollBar/index';
import ErrorState from '../../../ErrorState/index';
import { DocxControlsBar } from './components/index.js';
import styles from './index.module.css';
import {
  DEFAULT_DOCX_ERROR_LABEL,
  DEFAULT_DOCX_ACCENT,
  DEFAULT_DOCX_TEXT_COLOR,
  DEFAULT_DOCX_BG_COLOR,
  DOCX_MIN_ZOOM,
  DOCX_MAX_ZOOM,
  DOCX_ZOOM_STEP,
  DEFAULT_DOCX_ZOOM,
  DOCX_VIEWPORT_HEIGHT,
  DEFAULT_LOADING_VARIANT,
  DEFAULT_LOADING_SIZE,
} from '../../constants.js';

// Visor de DOCX renderizado con docx-preview, que convierte el .docx a DOM/CSS real (fuentes,
// tablas, imágenes, formato de página) en vez de solo mostrar texto plano — a diferencia de un
// <iframe>/Google Docs Viewer, no depende de un servicio externo ni de que el browser tenga
// soporte nativo para .docx (ninguno lo tiene). Sin paginación: docx-preview renderiza el
// documento completo en un solo scroll continuo.
const DocxViewer = ({
  url,
  fileName,
  openLabel,
  downloadLabel,
  errorLabel = DEFAULT_DOCX_ERROR_LABEL,
  accentColor = DEFAULT_DOCX_ACCENT,
  textColor = DEFAULT_DOCX_TEXT_COLOR,
  bgColor = DEFAULT_DOCX_BG_COLOR,
  loadingVariant = DEFAULT_LOADING_VARIANT,
  loadingSize = DEFAULT_LOADING_SIZE,
}) => {
  const documentRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_DOCX_ZOOM);

  // Descarga y renderiza el documento cuando cambia la url. docx-preview se importa
  // dinámicamente (no al tope del archivo) para no pagar su costo en componentes de la
  // librería que nunca muestran un DOCX.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setZoom(DEFAULT_DOCX_ZOOM);

    (async () => {
      try {
        const [{ renderAsync }, response] = await Promise.all([
          import('docx-preview'),
          fetch(url),
        ]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        if (cancelled || !documentRef.current) return;

        documentRef.current.innerHTML = '';
        await renderAsync(blob, documentRef.current, documentRef.current, {
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
        });
        if (cancelled) return;
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
    };
  }, [url]);

  const zoomIn = () => setZoom((prev) => Math.min(prev + DOCX_ZOOM_STEP, DOCX_MAX_ZOOM));
  const zoomOut = () => setZoom((prev) => Math.max(prev - DOCX_ZOOM_STEP, DOCX_MIN_ZOOM));

  return (
    <div className={styles.docxViewer}>
      <div className={styles.docAreaOuter} style={{ backgroundColor: bgColor }}>
        <ScrollBar contentClassName={styles.docArea} reserveTrackSpace maxHeight={DOCX_VIEWPORT_HEIGHT}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <Loading variant={loadingVariant} size={loadingSize} color={accentColor} />
            </div>
          )}
          {hasError && (
            <ErrorState
              errorLabel={errorLabel}
              actionLabel={openLabel}
              onAction={() => window.open(url, '_blank', 'noopener,noreferrer')}
              textColor={textColor}
            />
          )}
          <div
            ref={documentRef}
            className={styles.docxContent}
            style={{ display: hasError ? 'none' : 'block', transform: `scale(${zoom})` }}
          />
        </ScrollBar>
      </div>

      {!hasError && (
        <DocxControlsBar
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          minZoom={DOCX_MIN_ZOOM}
          maxZoom={DOCX_MAX_ZOOM}
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

export default DocxViewer;
