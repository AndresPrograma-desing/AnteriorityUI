import React from 'react';
import styles from './index.module.css';

// Slider horizontal controlado, basado en <input type="range"> nativo.
export default function Slider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  accentColor,
  className = '',
  style,
  'aria-label': ariaLabel,
}) {
  return (
    <input
      type="range"
      className={`${styles.slider} ${className}`}
      style={{ '--slider-accent': accentColor, ...style }}
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => onChange?.(Number(event.target.value))}
    />
  );
}

export { Slider };
