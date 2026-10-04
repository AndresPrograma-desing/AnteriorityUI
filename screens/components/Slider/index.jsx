import React from 'react';
import MuiSlider from '@mui/material/Slider';
import styles from './index.module.css';

import { DEFAULT_ACCENT, DEFAULT_THICKNESS } from './constants.js';

// Slider horizontal controlado (MUI). Con showPercentage, el tooltip del thumb muestra el porcentaje
// del recorrido (value respecto de min..max) mientras se arrastra o se pasa el mouse por encima.
export default function Slider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showPercentage = false,
  accentColor,
  thickness = DEFAULT_THICKNESS,
  className = '',
  style,
  'aria-label': ariaLabel,
}) {
  const formatPercentage = (current) => {
    const range = max - min;
    return `${range > 0 ? Math.round(((current - min) / range) * 100) : 0}%`;
  };

  return (
    <MuiSlider
      className={`${styles.slider} ${className}`}
      style={style}
      size="small"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      valueLabelDisplay={showPercentage ? 'auto' : 'off'}
      valueLabelFormat={formatPercentage}
      onChange={(_event, next) => onChange?.(next)}
      sx={{
        color: accentColor ?? DEFAULT_ACCENT,
        height: thickness,
        '& .MuiSlider-rail, & .MuiSlider-track': { height: thickness, borderRadius: thickness / 2 },
        '& .MuiSlider-thumb': { width: thickness + 8, height: thickness + 8 },
      }}
    />
  );
}

export { Slider };
