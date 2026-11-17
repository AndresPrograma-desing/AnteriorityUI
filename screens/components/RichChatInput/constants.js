export const DEFAULT_PLACEHOLDER = 'Escribí un mensaje…';
export const DEFAULT_MIN_ROWS = 2;
export const DEFAULT_MAX_ROWS = 10;
export const DEFAULT_SEND_LABEL = 'Enviar (Enter)';
export const DEFAULT_IMAGE_LABEL = 'Imagen';
export const DEFAULT_IMAGE_REMOVE_LABEL = 'Quitar imagen';
export const DEFAULT_TOOLS = ['bold', 'italic', 'strike', 'code', 'link', 'emoji'];

export const DEFAULT_LABELS = {
  boldTooltip: 'Negrita (Ctrl+B)',
  italicTooltip: 'Cursiva (Ctrl+I)',
  strikeTooltip: 'Tachado (Ctrl+Shift+X)',
  codeTooltip: 'Código (Ctrl+E)',
  linkTooltip: 'Enlace (Ctrl+K)',
  emojiTooltip: 'Emoji',
  linkPlaceholder: 'https://…',
  linkApplyLabel: 'Aplicar',
  linkCancelLabel: 'Cancelar',
};

// Zero-width space: se usa para dejar un punto donde poner el cursor fuera de un <code>/<b>
// recién creado. Se ignora al serializar a markdown.
export const ZWSP = '​';
