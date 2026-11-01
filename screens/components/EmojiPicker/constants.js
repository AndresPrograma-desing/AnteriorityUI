// Estilos (sx) para el Button de la librería: colores vía las variables --ep-* para que
// las props de color los pisen sin CSS externo.
export const TRIGGER_STYLE = {
  gap: '10px',
  padding: '8px 14px',
  borderRadius: '10px',
  textTransform: 'none',
  color: 'var(--ep-text, #1e293b)',
  backgroundColor: 'var(--ep-bg, #ffffff)',
  borderColor: 'var(--ep-border, #e2e8f0)',
  '&:hover': {
    backgroundColor: 'var(--ep-surface, #f8fafc)',
    borderColor: 'var(--ep-accent, #2563eb)',
  },
};

export const CLEAR_STYLE = {
  color: 'var(--ep-muted, #64748b)',
  backgroundColor: 'var(--ep-surface, #f1f5f9)',
  '&:hover': {
    backgroundColor: 'var(--ep-danger-bg, #fee2e2)',
    color: 'var(--ep-danger, #ef4444)',
  },
};
