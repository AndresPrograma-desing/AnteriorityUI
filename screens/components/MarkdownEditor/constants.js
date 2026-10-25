export const DEFAULT_LABELS = {
  editorTab: 'Editor',
  splitTab: 'Dividido',
  previewTab: 'Vista previa',
  splitEmptyPreview: 'Vista previa del formato markdown...',
  previewEmptyPreview: 'Sin contenido para previsualizar',
  boldTooltip: 'Negrita (Ctrl+B)',
  italicTooltip: 'Cursiva (Ctrl+I)',
  titleTooltip: 'Título',
  heading2Tooltip: 'Encabezado principal',
  heading3Tooltip: 'Subtítulo',
  bulletListTooltip: 'Lista con viñetas',
  orderedListTooltip: 'Lista numerada',
  quoteTooltip: 'Cita',
  codeBlockTooltip: 'Bloque de código',
  linkTooltip: 'Insertar enlace (Ctrl+K)',
  imageTooltip: 'Insertar imagen',
  colorTooltip: 'Color de texto',
  tableTooltip: 'Insertar tabla',
  copyableTooltip: 'Texto copiable',
  resizeHandleTitle: 'Arrastra para cambiar la altura (doble click para expandir/reducir)',
  boldDefaultText: 'negrita',
  italicDefaultText: 'cursiva',
  linkDefaultText: 'enlace',
  codeDefaultText: 'código',
  imageAltDefaultText: 'descripción',
  imageUrlPlaceholder: 'url-de-la-imagen',
  colorDefaultText: 'texto en color',
  applyColorLabel: 'Aplicar',
  copyableDefaultText: 'texto copiable',
  tableColumnLabels: ['Columna 1', 'Columna 2', 'Columna 3'],
  tableRowLabels: ['Dato 1', 'Dato 2', 'Dato 3'],
};

export const DEFAULT_PENDING_COLOR = '#2563eb';

// Límites de arrastre del resize handle (en px) y los dos "escalones" que alterna el
// doble click (ver utils.js -> getDoubleClickHeight).
export const MIN_EDITOR_HEIGHT = 180;
export const MAX_EDITOR_HEIGHT = 1200;
export const DOUBLE_CLICK_COLLAPSED_HEIGHT = 320;
export const DOUBLE_CLICK_EXPANDED_HEIGHT = 580;
export const DOUBLE_CLICK_EXPAND_THRESHOLD = 450;

export const IMAGE_TOKEN_PREFIX = 'imagen';
