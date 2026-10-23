import React from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { VARIANTS, SIZES, COLORS } from './utils';
import styles from './index.module.css';
import ModalTooltip from '../ModalTooltip/ModalTooltip';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  active = false,
  fullWidth = false,
  icon: Icon,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  color,
  border,
  borderColor,
  hoverColor,
  activeColor,
  style = {},
  loading = false,
  success = undefined,
  circle = false,
  ToolTip = false,
  title,
  ...props
}, ref) => {

  // Map custom variant to MUI variant
  let muiVariant = 'contained';
  if (variant === 'outline') muiVariant = 'outlined';
  if (variant === 'ghost' || variant === 'tab' || variant === 'list-item' || color === 'transparent') muiVariant = 'text';

  // Map custom size to MUI size
  const muiSize = size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium';

  // Map standard colors to MUI color prop if possible
  let muiColor = 'primary';
  if (variant === 'danger' || color === 'var(--color-danger)' || color === 'var(--cancel-button)' || color === 'red') muiColor = 'error';
  if (variant === 'secondary' || color === 'var(--color-secondary)') muiColor = 'secondary';
  if (color === 'var(--button-green)' || color === 'green') muiColor = 'success';
  if (color === 'transparent' || variant === 'list-item') muiColor = 'inherit';
  if (border || borderColor) { muiVariant = 'outlined'; }

  // "list-item": fila seleccionable de ancho completo, alineada a la izquierda (pickers,
  // listas dentro de un DrawPanel/popover). Los colores quedan pensados para paneles oscuros
  // por default, pero se pueden pisar con el prop "style" como cualquier otro variant.
  const listItemStyle = variant === 'list-item' ? {
    width: '100%',
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: '#e6e8ec',
    fontWeight: 500,
    fontSize: '0.85rem',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  } : {};
  
  // Check if we need to apply custom color overrides via sx
  const standardMuiColors = ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];
  const isCustomColor = color && color !== 'transparent' && !standardMuiColors.includes(muiColor) && !standardMuiColors.includes(color);

  // Active state styling
  // Por defecto, el fondo de active/hover se deriva de currentColor (el color de texto
  // resultante del botón) en vez de un negro/blanco fijo, para que se adapte automáticamente
  // sea cual sea el color de fondo heredado (ej. un Button color="transparent" dentro de un
  // Sidebar/Popover con bg azul oscuro) — ver convención de props de color en CLAUDE.md.
  const resolvedHoverColor = hoverColor || 'color-mix(in srgb, currentColor 10%, transparent)';
  const resolvedActiveColor = activeColor || 'color-mix(in srgb, currentColor 16%, transparent)';
  const activeStyle = active ? { backgroundColor: resolvedActiveColor } : {};

  // Circle styling
  const circleStyle = circle ? { 
    borderRadius: '50%', 
    minWidth: 0, 
    padding: size === 'small' ? '6px' : (size === 'large' ? '12px' : '8px') 
  } : {};

  // Custom colors processing
  const customColors = {};
  if (isCustomColor) {
      if (muiVariant === 'contained') {
          customColors.backgroundColor = color;
          customColors.color = '#fff';
          customColors['&:hover'] = { backgroundColor: color, filter: 'brightness(0.9)' };
      } else if (muiVariant === 'outlined') {
          customColors.borderColor = color;
          customColors.color = color;
          customColors['&:hover'] = { borderColor: color, backgroundColor: 'rgba(0, 0, 0, 0.04)' };
      } else {
          customColors.color = color;
          customColors['&:hover'] = { backgroundColor: 'rgba(0, 0, 0, 0.04)' };
      }
  } else if (color === 'transparent' || muiColor === 'inherit') {
      // Caso no cubierto por isCustomColor: botones "transparent"/ghost cuyo fondo real es el
      // del contenedor (ej. filas de Sidebar, items de un Popover oscuro). MUI por defecto les
      // aplica un hover/selected blanco translúcido fijo (pensado para fondos oscuros estándar
      // de MUI), que se ve mal sobre un bg de color custom. Se reemplaza por el hover/active
      // derivado de currentColor (o por hoverColor/activeColor si el consumidor los pasa).
      customColors['&:hover'] = { backgroundColor: resolvedHoverColor };
      customColors['&.Mui-focusVisible'] = { backgroundColor: resolvedHoverColor };
  }

  // Handle explicit border and borderColor
  if (border || borderColor) {
      const bColor = borderColor || border || 'black';
      customColors.border = `1px solid ${bColor} !important`;
      if (!isCustomColor) {
        customColors.borderColor = `${bColor} !important`;
        customColors.color = `${bColor} !important`;
      }
  }

  // Handle icon size
  const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;

  const isButtonDisabled = disabled || loading || (success === false);

  const handleClick = (e) => {
    if (isButtonDisabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  const buttonElement = (
    <MuiButton
      ref={ref}
      type={type}
      variant={muiVariant}
      size={muiSize}
      color={isCustomColor ? undefined : (standardMuiColors.includes(color) ? color : muiColor)}
      fullWidth={fullWidth}
      disabled={isButtonDisabled}
      onClick={handleClick}
      className={className}
      startIcon={!circle && !loading && Icon ? <span style={{ display: 'inline-flex' }}><Icon size={iconSize} /></span> : undefined}
      sx={{
        textTransform: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        boxShadow: (variant === 'primary' && color !== 'transparent' && !isButtonDisabled) ? '0 4px 6px -1px rgba(14, 165, 233, 0.2)' : 'none',
        ...listItemStyle,
        ...circleStyle,
        ...activeStyle,
        ...customColors,
        ...style
      }}
      {...props}
    >
      {/* If it's a circle button with an icon, we render the icon inside as children, without startIcon spacing */}
      {loading ? (
        <CircularProgress size={iconSize} color="inherit" />
      ) : circle && Icon ? (
        <span style={{ display: 'inline-flex' }}><Icon size={iconSize} /></span>
      ) : (
        children
      )}
    </MuiButton>
  );

  const tooltipText = typeof ToolTip === 'string' ? ToolTip : title;
  if (ToolTip && tooltipText) {
    return <ModalTooltip text={tooltipText}>{buttonElement}</ModalTooltip>;
  }

  return buttonElement;
});

Button.VARIANTS = VARIANTS;
Button.SIZES = SIZES;
Button.COLORS = COLORS;

export { VARIANTS, SIZES, COLORS };
export default Button;
