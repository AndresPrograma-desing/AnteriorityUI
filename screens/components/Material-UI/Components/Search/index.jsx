import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import { DEFAULT_ICON_COLOR } from './constants.js';

export default function Search({
  open,
  onOpen,
  onClose,
  options = [],
  loading = false,
  value,
  onChange,
  inputValue,
  onInputChange,
  getOptionLabel = (option) => option?.label || "",
  isOptionEqualToValue = (option, val) => option?.value === val?.value,
  label = "Buscar",
  placeholder = "Buscar...",
  freeSolo = false,
  size = 'small',
  error = false,
  helperText,
  bgColor,
  textColor,
  iconColor = DEFAULT_ICON_COLOR,
  borderColor,
  ...props
}) {
  const colorVars = {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor
      ? {
          '& .MuiOutlinedInput-notchedOutline': { borderColor },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor },
        }
      : {}),
  };

  // Fallback to plain TextField if we are just doing local free text search without options
  if (freeSolo && options.length === 0) {
    return (
      <TextField
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
        label={label}
        placeholder={placeholder}
        size={size}
        error={error}
        helperText={helperText}
        fullWidth
        autoComplete="off"
        sx={colorVars}
        slotProps={{
          input: {
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Limpiar búsqueda"
                  size="small"
                  onClick={() => onChange && onChange('')}
                  edge="end"
                >
                  <X size={16} color={iconColor} />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        {...props}
      />
    );
  }

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      value={value}
      onChange={(event, newValue) => {
        if (onChange) onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        if (onInputChange) onInputChange(newInputValue);
      }}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      clearIcon={<X size={16} color={iconColor} />}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size={size}
          error={error}
          helperText={helperText}
          sx={colorVars}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps?.input,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.slotProps?.input?.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
      {...props}
    />
  );
}
