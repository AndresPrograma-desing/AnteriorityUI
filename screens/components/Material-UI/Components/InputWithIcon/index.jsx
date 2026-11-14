import React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import MuiTextField from '@mui/material/TextField';
import { UNDERLINE_VARIANT, underlineSx } from '../../../../../common/utils/underlineSx';

export default function InputWithIcon({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder,
  type = 'text',
  variant = 'outlined', // 'standard' | 'outlined' | 'row' | 'filled' | 'underline'
  fullWidth = true,
  iconColor = 'black',
  lineColor,
  lineFocusColor,
  ...props
}) {
  const adornmentId = React.useId();

  // `underline`: igual que outlined (ícono dentro del campo) pero sin caja, solo la línea inferior.
  if (variant === UNDERLINE_VARIANT) {
    return (
      <MuiTextField
        type={type}
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="standard"
        size="small"
        fullWidth={fullWidth}
        sx={{ m: 0, ...underlineSx(lineColor, lineFocusColor) }}
        slotProps={{
          input: {
            startAdornment: Icon && (
              <InputAdornment position="start">
                <Icon size={18} style={{ color: iconColor }} />
              </InputAdornment>
            ),
          },
        }}
        {...props}
      />
    );
  }

  if (variant === 'standard') {
    return (
      <FormControl variant="standard" fullWidth={fullWidth} sx={{ m: 0, ...underlineSx(lineColor, lineFocusColor) }}>
        {label && <InputLabel htmlFor={adornmentId}>{label}</InputLabel>}
        <Input
          id={adornmentId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          startAdornment={
            Icon && (
              <InputAdornment position="start">
                <Icon size={20} style={{ color: iconColor }} />
              </InputAdornment>
            )
          }
          {...props}
        />
      </FormControl>
    );
  }

  if (variant === 'row') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-end', width: fullWidth ? '100%' : 'auto', gap: 1 }}>
        {Icon && <Icon size={20} style={{ color: iconColor, marginBottom: '4px' }} />}
        <MuiTextField
          type={type}
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          variant="standard"
          fullWidth={fullWidth}
          sx={underlineSx(lineColor, lineFocusColor)}
          {...props}
        />
      </Box>
    );
  }

  // Default: outlined or filled
  return (
    <MuiTextField
      type={type}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant={variant === 'filled' ? 'filled' : 'outlined'}
      size="small"
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: Icon && (
            <InputAdornment position="start">
              <Icon size={18} style={{ color: 'currentColor' }} />
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}
