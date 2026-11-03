import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './index.module.css';

const HANDLE_POSITION_CLASS = {
  left: styles.handleLeft,
  center: styles.handleCenter,
  right: styles.handleRight,
};

// Envoltorio del TopBar cuando `autoHide` está activo. Ocupa 0 de alto en el layout (la barra se
// dibuja como overlay absoluto encima del contenido, así que al ocultarse/mostrarse el contenido
// de abajo no salta) y, mientras la barra está oculta, renderiza en el borde superior — el lugar
// donde estaba la barra — una franja invisible de ancho completo que la vuelve a mostrar cuando el
// puntero se acerca, con una pestaña visible (flecha hacia abajo) colgando de ese borde para que se
// note que hay una barra oculta. La pestaña es un botón: el foco o el click también la muestran.
// `style` recibe las variables de tema del TopBar (--topbar-bg, --topbar-border, ...), porque este
// envoltorio está afuera del <header> que las define y la pestaña las necesita para verse igual.
// Con `active` en false (autoHide desactivado, o dispositivo táctil sin hover) devuelve los
// children tal cual, sin markup extra.
const AutoHideShell = ({
  active,
  isHidden,
  onReveal,
  triggerHeight,
  showHandle,
  handlePosition,
  handleLabel,
  style,
  children,
}) => {
  if (!active) return children;

  return (
    <div className={styles.shell} style={style}>
      {isHidden && (
        <div
          className={styles.trigger}
          style={{ height: triggerHeight }}
          onMouseEnter={onReveal}
        >
          {showHandle && (
            <button
              type="button"
              className={`${styles.handle} ${HANDLE_POSITION_CLASS[handlePosition] || styles.handleCenter}`}
              onClick={onReveal}
              onFocus={onReveal}
              aria-label={handleLabel}
              title={handleLabel}
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default AutoHideShell;
