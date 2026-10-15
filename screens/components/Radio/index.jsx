import React, { useId, cloneElement, isValidElement } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiRadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiRadio from '@mui/material/Radio';
import styles from './index.module.css';
import { DEFAULT_SIZE, DEFAULT_COLOR, DEFAULT_DIRECTION, DIRECTIONS, SIZES } from './constants.js';

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
  className = '',
  style,
  ...props
}) {
  return (
    <FormControlLabel
      value={value}
      disabled={disabled}
      control={
        <MuiRadio
          size={size}
          color={color}
          className={`${styles.muiRadioCustom} ${className}`.trim()}
        />
      }
      label={label}
      checked={checked}
      onChange={onChange}
      style={style}
      className={styles.radioWrapper}
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