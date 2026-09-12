import React, { forwardRef } from 'react';
import MuiTextField from '@mui/material/TextField';
import { formatHighlightedText } from '../../../GreenHighlight/utils.jsx';

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
  bgColor = '#fff',
  textColor = '#0f172a',
  ...props
}, ref) => {
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
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      placeholder={placeholder}
      sx={{
        m: 0,
        '& .MuiInputBase-root': { backgroundColor: bgColor },
        '& input:-webkit-autofill': {
          WebkitBoxShadow: `0 0 0 1000px ${bgColor} inset`,
          WebkitTextFillColor: textColor,
          caretColor: textColor,
        },
      }}
      inputRef={ref}
      {...props}
    />
  );
});

TextField.displayName = 'TextField';

export default TextField;