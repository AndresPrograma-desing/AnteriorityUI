import React, { useRef, useState } from 'react';
import { ChevronsLeftRight, ChevronsUpDown } from 'lucide-react';
import styles from './index.module.css';
import {
  DEFAULT_SIZE,
  DEFAULT_MIN_SIZE,
  DEFAULT_HANDLE_SIZE,
  DEFAULT_KEYBOARD_STEP,
  SHIFT_MULTIPLIER,
  DEFAULT_HANDLE_LABEL,
  DEFAULT_LINE_THICKNESS,
  DEFAULT_GRIP_SIZE,
  DEFAULT_GRIP_ICON_SIZE,
  DEFAULT_GRIP_RADIUS,
  DEFAULT_GRIP_STROKE_WIDTH,
} from './constants.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Contenedor redimensionable con un handle arrastrable (estilo panel de VS Code).
// `size` es el tamaño del área de contenido (alto si direction="vertical", ancho si "horizontal");
// el handle se suma por fuera. Controlado si se pasa `size`, si no usa `defaultSize`.
const Resizable = ({
  children,
  direction = 'vertical',
  handlePosition = 'end',
  size: controlledSize,
  defaultSize = DEFAULT_SIZE,
  minSize = DEFAULT_MIN_SIZE,
  maxSize = Infinity,
  step = DEFAULT_KEYBOARD_STEP,
  onSizeChange,
  onResizeEnd,
  resetOnDoubleClick = true,
  disabled = false,
  showHandle = true,
  handleSize = DEFAULT_HANDLE_SIZE,
  handleLabel = DEFAULT_HANDLE_LABEL,
  handleBgColor,
  lineThickness = DEFAULT_LINE_THICKNESS,
  lineColor,
  lineActiveColor,
  showGrip = true,
  gripIcon,
  gripSize = DEFAULT_GRIP_SIZE,
  gripIconSize = DEFAULT_GRIP_ICON_SIZE,
  gripStrokeWidth = DEFAULT_GRIP_STROKE_WIDTH,
  gripRadius = DEFAULT_GRIP_RADIUS,
  gripBgColor,
  gripBorderColor,
  gripIconColor,
  className = '',
  style,
}) => {
  const isControlled = controlledSize !== undefined;
  const [innerSize, setInnerSize] = useState(defaultSize);
  const size = clamp(isControlled ? controlledSize : innerSize, minSize, maxSize);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const handleRef = useRef(null);
  // Las teclas van al elemento enfocado, no al que tiene el puntero encima: por eso el handle toma el foco
  // al pasar el puntero (solo si nada más tiene foco) y lo suelta al salir, si fue el puntero quien lo tomó.
  const focusedByPointer = useRef(false);

  const isVertical = direction === 'vertical';
  // Con handle al inicio, arrastrar hacia el inicio agranda el panel: el signo se invierte.
  const sign = handlePosition === 'start' ? -1 : 1;
  const dimension = isVertical ? 'height' : 'width';

  const applySize = (next) => {
    if (!isControlled) setInnerSize(next);
    onSizeChange?.(next);
  };

  const focusHandle = () => {
    const el = handleRef.current;
    if (el && document.activeElement !== el) el.focus({ preventScroll: true });
  };

  const nothingElseFocused = () => {
    const active = document.activeElement;
    return !active || active === document.body || active === handleRef.current;
  };

  const handlePointerEnter = () => {
    if (disabled || !nothingElseFocused()) return;
    focusedByPointer.current = true;
    focusHandle();
  };

  const handlePointerLeave = () => {
    if (!focusedByPointer.current || dragRef.current) return;
    focusedByPointer.current = false;
    handleRef.current?.blur();
  };

  const handleMouseDown = (e) => {
    // Evita seleccionar texto al arrastrar; el foco ya lo toma handlePointerDown.
    if (!disabled) e.preventDefault();
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    focusHandle();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { start: isVertical ? e.clientY : e.clientX, startSize: size, last: size };
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const pos = isVertical ? e.clientY : e.clientX;
    const next = clamp(drag.startSize + sign * (pos - drag.start), minSize, maxSize);
    if (next !== drag.last) {
      drag.last = next;
      applySize(next);
    }
  };

  const endDrag = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    onResizeEnd?.(drag.last);
  };

  const handleDoubleClick = () => {
    if (disabled || !resetOnDoubleClick) return;
    const next = clamp(defaultSize, minSize, maxSize);
    applySize(next);
    onResizeEnd?.(next);
  };

  // Teclado: flechas según la dirección (Shift = paso x SHIFT_MULTIPLIER), Home = mínimo, End = máximo.
  const adjustByKey = (key, shiftKey) => {
    const amount = step * (shiftKey ? SHIFT_MULTIPLIER : 1);
    const grow = isVertical ? 'ArrowDown' : 'ArrowRight';
    const shrink = isVertical ? 'ArrowUp' : 'ArrowLeft';
    let next;
    if (key === grow) next = size + sign * amount;
    else if (key === shrink) next = size - sign * amount;
    else if (key === 'Home') next = minSize;
    else if (key === 'End' && Number.isFinite(maxSize)) next = maxSize;
    else return false;
    const clamped = clamp(next, minSize, maxSize);
    applySize(clamped);
    onResizeEnd?.(clamped);
    return true;
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (adjustByKey(e.key, e.shiftKey)) e.preventDefault();
  };

  // Solo se emiten las variables de color que el consumidor define; el resto usa el default del CSS.
  const colorVars = {
    ...(handleBgColor ? { '--resizable-handle-bg': handleBgColor } : {}),
    ...(lineColor ? { '--resizable-line': lineColor } : {}),
    ...(lineActiveColor ? { '--resizable-line-active': lineActiveColor } : {}),
    ...(gripBgColor ? { '--resizable-grip-bg': gripBgColor } : {}),
    ...(gripBorderColor ? { '--resizable-grip-border': gripBorderColor } : {}),
    ...(gripIconColor ? { '--resizable-grip-icon': gripIconColor } : {}),
  };

  // Icono por defecto según la dirección: flechas arriba/abajo para alto, izquierda/derecha para ancho.
  const GripIcon = gripIcon === undefined ? (isVertical ? ChevronsUpDown : ChevronsLeftRight) : gripIcon;

  const handleEl = showHandle && (
    <div
      ref={handleRef}
      role="separator"
      tabIndex={disabled ? -1 : 0}
      aria-label={handleLabel}
      aria-orientation={isVertical ? 'horizontal' : 'vertical'}
      aria-valuenow={size}
      aria-valuemin={minSize}
      aria-valuemax={Number.isFinite(maxSize) ? maxSize : undefined}
      aria-disabled={disabled || undefined}
      className={[
        styles.handle,
        isVertical ? styles.handleVertical : styles.handleHorizontal,
        dragging ? styles.dragging : '',
        disabled ? styles.disabled : '',
      ].filter(Boolean).join(' ')}
      style={{ [isVertical ? 'height' : 'width']: handleSize }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onMouseDown={handleMouseDown}
    >
      <span
        className={styles.line}
        style={{ [isVertical ? 'height' : 'width']: lineThickness }}
      />
      {showGrip && GripIcon && (
        <span
          className={styles.grip}
          style={{ width: gripSize, height: gripSize, borderRadius: gripRadius }}
        >
          <GripIcon size={gripIconSize} strokeWidth={gripStrokeWidth} aria-hidden="true" />
        </span>
      )}
    </div>
  );

  const content = <div className={styles.content}>{children}</div>;

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      style={{
        flexDirection: isVertical ? 'column' : 'row',
        [dimension]: size + (showHandle ? handleSize : 0),
        ...colorVars,
        ...style,
      }}
    >
      {handlePosition === 'start' && handleEl}
      {content}
      {handlePosition !== 'start' && handleEl}
    </div>
  );
};

export default Resizable;
