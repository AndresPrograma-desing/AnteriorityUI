// Estilos `sx` de MUI para la línea inferior de la variante "underline" (campos sin caja).
// Compartido por TextField, InputWithIcon y MultilinePlaceholder. Sin `lineColor` /
// `lineFocusColor` no devuelve nada y quedan los colores por defecto de MUI.
export const UNDERLINE_VARIANT = 'underline';

export const underlineSx = (lineColor, lineFocusColor) => ({
  ...(lineColor && {
    '& .MuiInput-underline:before': { borderBottomColor: lineColor },
  }),
  ...(lineFocusColor && {
    '& .MuiInput-underline:after': { borderBottomColor: lineFocusColor },
    '& .MuiInputLabel-root.Mui-focused:not(.Mui-error)': { color: lineFocusColor },
  }),
});
