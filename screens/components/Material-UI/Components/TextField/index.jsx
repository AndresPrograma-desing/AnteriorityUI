import React, { forwardRef } from 'react';
import MuiTextField from '@mui/material/TextField';
import { formatHighlightedText } from '../../../GreenHighlight/utils';
import { UNDERLINE_VARIANT, underlineSx } from '../../../../../common/utils/underlineSx';

const TextField = forwardRef(({ 
  label, 
  value, 
  onChange, 
  error, 
  helperText,
  type = "text",
  variant = "outlined",
  size = "small",
  fullWidth = true,
  placeholder,
  required,
  requiredColor = 'red',
  bgColor,
  textColor = '#0f172a',
  lineColor,
  lineFocusColor,
  ...props
}, ref) => {
  // `variant="underline"`: sin caja, solo la línea inferior donde se escribe (MUI "standard" con
  // fondo transparente). `lineColor` / `lineFocusColor` recolorean la línea (reposo / foco); sin
  // ellas se usan los colores por defecto de MUI.
  const isUnderline = variant === UNDERLINE_VARIANT;
  const muiVariant = isUnderline ? 'standard' : variant;
  const resolvedBg = bgColor ?? (isUnderline ? 'transparent' : '#fff');
  const autofillBg = resolvedBg === 'transparent' ? '#fff' : resolvedBg;

  const formattedLabel = typeof label === 'string' ? formatHighlightedText(label) : label;
  const displayLabel = formattedLabel ? (
    <span>
      {formattedLabel}
      {required && <span style={{ color: requiredColor, marginLeft: '4px' }}>**</span>}
    </span>
  ) : undefined;

  const displayHelperText = typeof helperText === 'string' ? formatHighlightedText(helperText) : helperText;

  return (
    <MuiTextField
      label={displayLabel}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || displayHelperText}
      type={type}
      variant={muiVariant}
      size={size}
      fullWidth={fullWidth}
      placeholder={placeholder}
      sx={{
        m: 0,
        '& .MuiInputBase-root': { backgroundColor: resolvedBg },
        '& input:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 1000px ${autofillBg} inset`,
          WebkitTextFillColor: textColor,
          caretColor: textColor,
        },
        ...(isUnderline ? underlineSx(lineColor, lineFocusColor) : {}),
      }}
      inputRef={ref}
      {...props}
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;