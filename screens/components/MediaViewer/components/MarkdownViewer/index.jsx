import React, { useState, useEffect } from 'react';
import Loading from '../../../Loading/index';
import ScrollBar from '../../../ScrollBar/index';
import ErrorState from '../../../ErrorState/index';
import MarkdownContent from '../../../MarkdownContent/index';
import styles from './index.module.css';
import {
  DEFAULT_MARKDOWN_ERROR_LABEL,
  DEFAULT_MARKDOWN_ACCENT,
  DEFAULT_MARKDOWN_TEXT_COLOR,
  DEFAULT_MARKDOWN_BG_COLOR,
  MARKDOWN_VIEWPORT_HEIGHT,
  DEFAULT_LOADING_VARIANT,
  DEFAULT_LOADING_SIZE,
} from '../../constants.js';

// Visor de archivos Markdown (.md): descarga el texto de la url y lo renderiza con el componente
// MarkdownContent de la librería (GFM, bloques de código con copiar, mermaid, íconos, etc.), así
// que se ve igual que cualquier otro contenido markdown del resto de la UI. Igual que el visor de
// DOCX, hace un fetch real de la url, por lo que necesita que el servidor permita CORS.
const MarkdownViewer = ({
  url,
  openLabel,
  errorLabel = DEFAULT_MARKDOWN_ERROR_LABEL,
  accentColor = DEFAULT_MARKDOWN_ACCENT,
  textColor = DEFAULT_MARKDOWN_TEXT_COLOR,
  bgColor = DEFAULT_MARKDOWN_BG_COLOR,
  loadingVariant = DEFAULT_LOADING_VARIANT,
  loadingSize = DEFAULT_LOADING_SIZE,
}) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);
    setContent('');

    (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        if (controller.signal.aborted) return;
        setContent(text);
        setIsLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        // Sin este log el motivo real (CORS, 403 por URL firmada vencida, etc.) queda oculto
        // detrás del mensaje genérico. No se loguea la url: puede ser una URL firmada.
        console.error('[MarkdownViewer] No se pudo cargar el documento:', err);
        setHasError(true);
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url]);

  return (
    <div className={styles.markdownViewer}>
      <div className={styles.areaOuter} style={{ backgroundColor: bgColor, color: textColor }}>
        <ScrollBar
          contentClassName={styles.area}
          reserveTrackSpace
          maxHeight={MARKDOWN_VIEWPORT_HEIGHT}
        >
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
          {!isLoading && !hasError && (
            <MarkdownContent linkColor={accentColor}>{content}</MarkdownContent>
          )}
        </ScrollBar>
      </div>
    </div>
  );
};

export default MarkdownViewer;
