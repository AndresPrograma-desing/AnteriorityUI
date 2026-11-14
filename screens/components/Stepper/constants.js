export const DEFAULT_SIZE = 44;
export const COMPACT_SIZE = 36;
export const DEFAULT_ORIENTATION = 'horizontal';
export const DEFAULT_SURFACE = 'card';
export const DEFAULT_IMAGE_FIT = 'cover';
export const DEFAULT_LINE_STYLE = 'solid';
export const LINE_STYLES = ['solid', 'dashed'];
// Espacio (px) entre un paso y el siguiente en `orientation="vertical"` (largo visible del conector).
export const DEFAULT_STEP_GAP = 28;
// Grosor (px) de la barra de progreso del resumen compacto (modo angosto).
export const COMPACT_BAR_THICKNESS = 6;
export const SURFACES = ['card', 'plain'];
export const ORIENTATIONS = ['horizontal', 'vertical'];

export const DEFAULT_COMPLETED_LABEL = 'Completado';
export const DEFAULT_ERROR_LABEL = 'Con error';
export const DEFAULT_ARIA_LABEL = 'Progreso';

// Ancho del propio componente (container query) por debajo del cual el modo horizontal
// oculta las etiquetas por paso y muestra una sola línea "Paso X de N · Etiqueta".
// Debe coincidir con el @container de index.module.css.
export const COMPACT_BREAKPOINT = 560;

export const defaultCompactLabel = (current, total, label) =>
  `Paso ${current} de ${total}${label ? ` · ${label}` : ''}`;
