import React from 'react';
import Button from '../Button/index';
import Text from '../Text/index';
import styles from './index.module.css';
import { DEFAULT_HEIGHT, DEFAULT_PADDING, DEFAULT_BG, DEFAULT_TEXT, DEFAULT_BORDER } from './constants.js';

// Barra inferior reutilizable: tres zonas (izquierda, centro y derecha) para texto, botones o cualquier nodo.
// `actions` es un atajo para la zona derecha: [{ key, label, onClick, variant?, icon?, disabled? }] se renderiza con el
// Button de la librería (`variant` por default 'outline'; 'primary' toma `accentColor` si se pasa). `children` va en el
// centro si no se usa `center`. Las zonas que reciben un string se muestran con el componente Text (emojis e íconos
// inline {icon:Nombre}, con el color `textColor` de la barra); cualquier otro nodo se renderiza tal cual. `textProps` y
// `actionProps` reenvían props extra a cada Text y a cada Button (los de cada acción ganan a `actionProps`).
const Footer = ({
  left,
  center,
  right,
  actions,
  children,
  sticky = false,
  height = DEFAULT_HEIGHT,
  padding = DEFAULT_PADDING,
  bgColor = DEFAULT_BG,
  textColor = DEFAULT_TEXT,
  borderColor = DEFAULT_BORDER,
  accentColor,
  textProps = {},
  actionProps = {},
  className = '',
  style,
  ...props
}) => {
  const vars = {
    '--footer-bg': bgColor,
    '--footer-text': textColor,
    '--footer-border': borderColor,
    '--footer-height': typeof height === 'number' ? `${height}px` : height,
    '--footer-padding': typeof padding === 'number' ? `${padding}px` : padding,
  };

  const zone = (node) =>
    typeof node === 'string' ? (
      <Text color={textColor} {...textProps} style={{ fontSize: 'inherit', ...textProps.style }}>{node}</Text>
    ) : (
      node
    );

  // Defaults para todas las acciones; `variant` y `style` se resuelven aparte para poder combinarlos.
  const { variant: defaultVariant, style: defaultActionStyle, ...restActionProps } = actionProps;

  const actionNodes = actions
    ? actions.map(({ key, label, icon, variant: ownVariant, ...action }) => {
        const variant = ownVariant ?? defaultVariant ?? 'outline';
        const isPrimary = variant === 'primary';
        const isOutline = variant === 'outline';
        return (
          <Button
            key={key || label}
            size="small"
            variant={variant}
            icon={icon}
            // El borde de los botones outline sigue al de la barra; los primary toman el acento; el resto, el color de texto.
            {...(isOutline ? { borderColor } : {})}
            {...restActionProps}
            {...action}
            // Los colores de la barra se combinan con el style de actionProps y el de la propia acción (gana este último).
            style={{
              ...(isPrimary ? (accentColor ? { backgroundColor: accentColor } : {}) : { color: textColor }),
              ...defaultActionStyle,
              ...action.style,
            }}
          >
            {label}
          </Button>
        );
      })
    : null;

  return (
    <footer
      className={`${styles.footer} ${sticky ? styles.sticky : ''} ${className}`.trim()}
      style={{ ...vars, ...style }}
      {...props}
    >
      <div className={styles.zone}>{zone(left)}</div>
      <div className={`${styles.zone} ${styles.center}`}>{zone(center ?? children)}</div>
      <div className={`${styles.zone} ${styles.right}`}>
        {zone(right)}
        {actionNodes}
      </div>
    </footer>
  );
};

export default Footer;
