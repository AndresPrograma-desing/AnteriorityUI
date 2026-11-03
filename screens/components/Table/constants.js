export const VARIANTS = { A: 'A', B: 'B' };
export const DEFAULT_VARIANT = 'A';

export const DEFAULT_FILTER_ACTIVE_COLOR = '#10b981';
export const DEFAULT_MAX_HEIGHT = '70vh';
export const DEFAULT_SKELETON_ROWS = 6;
export const DEFAULT_SCROLL_LEFT_LABEL = 'Desplazar tabla a la izquierda';
export const DEFAULT_SCROLL_RIGHT_LABEL = 'Desplazar tabla a la derecha';
export const DEFAULT_SCROLL_SLIDER_LABEL = 'Posición horizontal de la tabla';

// Cada variante conserva su look original: apunta a su propio CSS module y a su prefijo de
// variables CSS (--tableA-* / --tableB-*). `emptyMessage` default también difiere (con/sin punto).
export const VARIANT_CONFIG = {
  A: { prefix: 'tableA', wrapper: 'tableWrapper', table: 'table', row: 'row', emptyMessage: 'No hay datos disponibles' },
  B: { prefix: 'tableB', wrapper: 'tableContainer', table: 'modernTable', row: 'tableRow', emptyMessage: 'No hay datos disponibles.' },
};
