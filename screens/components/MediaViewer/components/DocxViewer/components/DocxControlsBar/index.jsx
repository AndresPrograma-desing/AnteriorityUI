import React from 'react';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import Button from '../../../../../Button/index';
import styles from './index.module.css';

// Barra de controles del visor de DOCX: zoom y descarga. Sin paginación — docx-preview
// renderiza el documento completo en un solo scroll continuo, no página por página como pdf.js.
const DocxControlsBar = ({
  zoom,
  onZoomIn,
  onZoomOut,
  minZoom,
  maxZoom,
  downloadUrl,
  downloadLabel,
  fileName,
  accentColor,
  textColor,
  bgColor,
}) => (
  <div className={styles.controlsBar} style={{ backgroundColor: bgColor, color: textColor }}>
    <div className={styles.zoomGroup}>
      <Button
        circle
        size="small"
        variant="ghost"
        color="transparent"
        icon={ZoomOut}
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        aria-label="Alejar"
        style={{ color: textColor }}
      />
      <span className={styles.zoomLabel} style={{ color: textColor }}>{Math.round(zoom * 100)}%</span>
      <Button
        circle
        size="small"
        variant="ghost"
        color="transparent"
        icon={ZoomIn}
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="Acercar"
        style={{ color: textColor }}
      />
    </div>

    <a
      href={downloadUrl}
      download={fileName || undefined}
      target="_blank"
      rel="noreferrer"
      className={styles.downloadButton}
      style={{ color: accentColor }}
      aria-label={downloadLabel}
      title={downloadLabel}
    >
      <Download size={16} />
    </a>
  </div>
);

export default DocxControlsBar;
