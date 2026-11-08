import React, { useId, cloneElement, isValidElement } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiRadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiRadio from '@mui/material/Radio';
import styles from './index.module.css';
import { DEFAULT_SIZE, DEFAULT_COLOR, DEFAULT_DIRECTION, DEFAULT_VARIANT, DIRECTIONS, VARIANTS, SIZES } from './constants.js';

/**
 * Componente de Radio individual
 */
export function Radio({
  label,
  value,
  checked,
  onChange,
  disabled = false,
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  accentColor,
  textColor,
  variant = DEFAULT_VARIANT,
  radius,
  bgColor,
  borderColor,
  className = '',
  style,
  ...props
}) {
  // accentColor / textColor: colores libres (hex, rgb…) para el radio marcado y la etiqueta; sin ellos rige `color` (paleta MUI).
  const colorVars = {
    ...(accentColor ? { '--radio-accent': accentColor } : {}),
    ...(textColor ? { '--radio-text': textColor } : {}),
    ...(radius !== undefined ? { '--radio-radius': typeof radius === 'number' ? `${radius}px` : radius } : {}),
    ...(bgColor ? { '--radio-bg': bgColor } : {}),
    ...(borderColor ? { '--radio-border': borderColor } : {}),
  };
  return (
    <FormControlLabel
      value={value}
      disabled={disabled}
      control={
        <MuiRadio
          size={size}
          color={color}
          className={`${styles.muiRadioCustom} ${accentColor ? styles.hasAccent : ''} ${className}`.trim()}
        />
      }
      label={label}
      checked={checked}
      onChange={onChange}
      style={{ ...colorVars, ...style }}
      className={`${styles.radioWrapper} ${variant === VARIANTS.card ? styles.card : ''} ${textColor ? styles.hasText : ''}`.trim()}
      {...props}
    />
  );
}

/**
 * Componente aglutinador RadioGroup
 */
export function RadioGroup({
  label,
  name,
  value,
  defaultValue,
  onChange,
  direction = DEFAULT_DIRECTION,
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  accentColor,
  textColor,
  variant = DEFAULT_VARIANT,
  radius,
  bgColor,
  borderColor,
  disabled = false,
  children,
  className = '',
  style,
  ...props
}) {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const groupName = name || generatedId;
  const isRow = direction === DIRECTIONS.row;

  // Inyectar props comunes a los componentes Radio hijos de forma automática
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    return cloneElement(child, {
      size: child.props.size || size,
      color: child.props.color || color,
      accentColor: child.props.accentColor || accentColor,
      textColor: child.props.textColor || textColor,
      variant: child.props.variant || variant,
      radius: child.props.radius !== undefined ? child.props.radius : radius,
      bgColor: child.props.bgColor || bgColor,
      borderColor: child.props.borderColor || borderColor,
      disabled: disabled || child.props.disabled,
    });
  });

  return (
    <FormControl 
      component="fieldset" 
      className={`${styles.formControl} ${className}`.trim()} 
      style={style}
    >
      {label && (
        <FormLabel id={labelId} className={styles.formLabel}>
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup
        row={isRow}
        aria-labelledby={label ? labelId : undefined}
        name={groupName}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={styles.radioGroupContainer}
        {...props}
      >
        {enhancedChildren}
      </MuiRadioGroup>
    </FormControl>
  );
}

// Exportación por defecto opcional apuntando al Group principal
export default RadioGroup;