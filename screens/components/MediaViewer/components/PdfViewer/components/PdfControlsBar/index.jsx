import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import Button from '../../../../../Button/index';
import PdfPageJumper from '../PdfPageJumper/index';
import styles from './index.module.css';

// Barra de controles del visor de PDF: navegación entre páginas (con un Input numérico para
// saltar a una página específica), zoom y descarga. Los botones prev/next/zoom se deshabilitan
// en sus límites (página 1, última página, zoom min/max).
const PdfControlsBar = ({
  page,
  pageCount,
  onPrevPage,
  onNextPage,
  onJumpToPage,
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
    <div className={styles.navGroup}>
      <Button
        circle
        size="small"
        variant="ghost"
        color="transparent"
        icon={ChevronLeft}
        onClick={onPrevPage}
        disabled={page <= 1}
        aria-label="Página anterior"
        style={{ color: textColor }}
      />
      <PdfPageJumper
        page={page}
        pageCount={pageCount}
        onJump={onJumpToPage}
        textColor={textColor}
        bgColor={bgColor}
      />
      <Button
        circle
        size="small"
        variant="ghost"
        color="transparent"
        icon={ChevronRight}
        onClick={onNextPage}
        disabled={pageCount != null && page >= pageCount}
        aria-label="Página siguiente"
        style={{ color: textColor }}
      />
    </div>

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

export default PdfControlsBar;
