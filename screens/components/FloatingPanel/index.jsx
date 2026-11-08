import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Pin, PinOff } from 'lucide-react';
import Button from '../Button/index';
import styles from './index.module.css';
import {
  DEFAULT_PANEL_WIDTH,
  DEFAULT_PANEL_HEIGHT,
  DEFAULT_PANEL_MARGIN,
  DEFAULT_PANEL_GAP,
  DEFAULT_PANEL_Z_INDEX,
  DEFAULT_PANEL_LABELS,
} from './constants.js';

// Elige dónde poner el panel junto a un rectángulo `anchor` ({ left, top, right, bottom }): a la derecha si entra,
// si no a la izquierda, debajo o arriba. Siempre queda dentro de la ventana (con margen).
export function placeBeside(anchor, size, { gap = DEFAULT_PANEL_GAP, margin = DEFAULT_PANEL_MARGIN } = {}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const candidates = [
    { left: anchor.right + gap, top: anchor.top },
    { left: anchor.left - size.w - gap, top: anchor.top },
    { left: anchor.left, top: anchor.bottom + gap },
    { left: anchor.left, top: anchor.top - size.h - gap },
  ];
  const fits = (c) => c.left >= margin && c.top >= margin && c.left + size.w <= vw - margin && c.top + size.h <= vh - margin;
  const pick = candidates.find(fits) || candidates[0];
  return clamp(pick, size, margin);
}

function clamp(pos, size, margin) {
  return {
    left: Math.min(Math.max(pos.left, margin), Math.max(margin, window.innerWidth - size.w - margin)),
    top: Math.min(Math.max(pos.top, margin), Math.max(margin, window.innerHeight - size.h - margin)),
  };
}

// Panel flotante genérico: muestra cualquier contenido (`children`) en una ventana que se puede mover y redimensionar,
// sin recortes por el overflow de quien lo usa (se renderiza en un portal a body).
//
// Modos de posición:
//   - Con `getAnchorRect` (función que devuelve { left, top, right, bottom } en px de viewport o null): el panel se
//     ubica junto a ese rectángulo y lo sigue al scrollear o cambiar el tamaño de la ventana.
//   - Sin `getAnchorRect`: se ubica en `defaultPosition` ({ left, top }) o, si no se pasa, en la esquina superior derecha.
// Al arrastrar el encabezado el panel deja de seguir al ancla y queda donde lo soltaste; la chincheta lo vuelve a anclar.
// La esquina inferior derecha lo redimensiona (resize nativo). `onClose` muestra el botón de cerrar.
const FloatingPanel = ({
  children,
  title,
  subtitle,
  getAnchorRect,
  defaultPosition,
  width = DEFAULT_PANEL_WIDTH,
  height = DEFAULT_PANEL_HEIGHT,
  minWidth = 230,
  minHeight = 150,
  gap = DEFAULT_PANEL_GAP,
  margin = DEFAULT_PANEL_MARGIN,
  zIndex = DEFAULT_PANEL_Z_INDEX,
  resizable = true,
  draggable = true,
  onClose,
  labels,
  className = '',
  style,
  bgColor,
  textColor,
  borderColor,
  headerBgColor,
  accentColor,
  ...rest
}) => {
  const text = { ...DEFAULT_PANEL_LABELS, ...labels };
  const panelRef = useRef(null);
  const sizeRef = useRef({ w: width, h: height });
  const dragRef = useRef(null);
  const [pinned, setPinned] = useState(false); // true = el usuario la movió: deja de seguir al ancla
  const [position, setPosition] = useState({ left: -9999, top: -9999 });

  const followsAnchor = Boolean(getAnchorRect) && !pinned;

  const reposition = useCallback(() => {
    if (!followsAnchor) return;
    const anchor = getAnchorRect();
    if (!anchor) return;
    setPosition(placeBeside(anchor, sizeRef.current, { gap, margin }));
  }, [followsAnchor, getAnchorRect, gap, margin]);

  // Sin ancla: se ubica una vez en defaultPosition (o arriba a la derecha).
  useLayoutEffect(() => {
    if (getAnchorRect) return;
    const size = sizeRef.current;
    const base = defaultPosition || { left: window.innerWidth - size.w - margin * 3, top: margin * 3 };
    setPosition(clamp(base, size, margin));
  }, [getAnchorRect, defaultPosition, margin]); // eslint-disable-line react-hooks/exhaustive-deps

  // Con ancla: sigue la posición al montar, al cambiar el ancla y ante scroll o resize.
  useLayoutEffect(() => {
    reposition();
  }, [reposition]);

  useEffect(() => {
    if (!followsAnchor) return undefined;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reposition);
    };
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [followsAnchor, reposition]);

  // Recuerda el tamaño real (cambia con el resize nativo) para ubicarlo bien la próxima vez.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(() => {
      sizeRef.current = { w: el.offsetWidth, h: el.offsetHeight };
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ---------- arrastre por el encabezado
  const handleDragStart = (event) => {
    if (!draggable || event.button !== 0 || event.target.closest('button')) return;
    panelRef.current.setPointerCapture(event.pointerId);
    dragRef.current = { dx: event.clientX - position.left, dy: event.clientY - position.top };
    setPinned(true);
  };
  const handleDragMove = (event) => {
    if (!dragRef.current) return;
    setPosition(
      clamp(
        { left: event.clientX - dragRef.current.dx, top: event.clientY - dragRef.current.dy },
        sizeRef.current,
        margin,
      ),
    );
  };
  const handleDragEnd = () => {
    dragRef.current = null;
  };

  const cssVars = {
    ...(bgColor !== undefined && { '--fp-bg': bgColor }),
    ...(textColor !== undefined && { '--fp-text': textColor }),
    ...(borderColor !== undefined && { '--fp-border': borderColor }),
    ...(headerBgColor !== undefined && { '--fp-header-bg': headerBgColor }),
    ...(accentColor !== undefined && { '--fp-accent': accentColor }),
    ...style,
  };

  const hasHeader = Boolean(title || onClose || getAnchorRect);

  return createPortal(
    <div
      ref={panelRef}
      className={`${styles.panel} ${resizable ? styles.resizable : ''} ${className}`}
      style={{
        ...cssVars,
        left: position.left,
        top: position.top,
        width,
        height: resizable ? undefined : height,
        minWidth,
        minHeight,
        zIndex,
      }}
      role="dialog"
      aria-label={typeof title === 'string' ? title : text.title}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
      {...rest}
    >
      {hasHeader && (
        <div
          className={`${styles.header} ${draggable ? styles.draggable : ''}`}
          onPointerDown={handleDragStart}
        >
          <span className={styles.title}>{title}</span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          {getAnchorRect && (
            <Button
              circle
              size="small"
              variant="ghost"
              color="transparent"
              icon={pinned ? PinOff : Pin}
              onClick={() => setPinned(false)}
              disabled={!pinned}
              aria-label={text.pin}
              title={text.pin}
              style={{ color: 'var(--fp-accent)' }}
            />
          )}
          {onClose && (
            <Button
              circle
              size="small"
              variant="ghost"
              color="transparent"
              icon={X}
              onClick={onClose}
              aria-label={text.close}
              title={text.close}
              style={{ color: 'var(--fp-text)' }}
            />
          )}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>,
    document.body,
  );
};

export default FloatingPanel;
