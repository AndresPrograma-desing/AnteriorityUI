export const TYPES = ['success', 'error', 'info', 'warning'];

export const DEFAULT_TYPE = 'success';
export const DEFAULT_DURATION = 4000; // ms; 0 o false = no se cierra solo
export const LEAVE_MS = 300; // duración de la animación de salida (debe coincidir con slideOut en index.module.css) // duración de la animación de salida
export const DEFAULT_MESSAGE_ANIMATE = 'letter-fade-in';
export const DEFAULT_CLOSE_LABEL = 'Cerrar notificación';
export const ICON_SIZE = 18;

export const CLOSE_STYLE = {
  color: 'var(--toast-muted, #94a3b8)',
  '&:hover': {
    backgroundColor: 'var(--toast-hover, #f1f5f9)',
    color: 'var(--toast-text, #334155)',
  },
};

export const ACTION_STYLE = {
  padding: '2px 8px',
  fontWeight: 600,
  textDecoration: 'underline',
  color: 'var(--toast-accent, #2563eb)',
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'underline',
    opacity: 0.8,
  },
};

// Estilos del título y mensaje (Text aporta el tag y las animaciones; el tamaño va inline para
// no depender del orden de las clases de Text).
export const TITLE_STYLE = {
  fontSize: '0.9375rem',
  fontWeight: 600,
  lineHeight: 1.3,
};

export const MESSAGE_STYLE = {
  fontSize: '0.8125rem',
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
};
