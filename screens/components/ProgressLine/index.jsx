import React from 'react';
import styles from './index.module.css';

import {
  DEFAULT_ORIENTATION,
  DEFAULT_LINE_STYLE,
  LINE_THICKNESS,
  DEFAULT_DASH,
  DEFAULT_GAP,
} from './constants.js';

// Línea de progreso: una pista (track) con un relleno (fill) que avanza de 0 a 100 con animación.
// Continua (`lineStyle="solid"`) o punteada (`"dashed"`: - - - - -), horizontal o vertical.
// Sirve de conector entre pasos (Stepper), barra de progreso o separador con avance.
//
// El largo lo define el contenedor (ancho completo en horizontal; en vertical se estira con
// `flex`/`height` del padre vía `className`/`style`); aquí solo se fija el grosor.
// Por defecto es decorativa (`aria-hidden`); con `aria-label` se expone como `progressbar`.
export default function ProgressLine({
  orientation = DEFAULT_ORIENTATION,
  lineStyle = DEFAULT_LINE_STYLE,
  progress = 0,
  thickness,
  dash = DEFAULT_DASH,
  gap = DEFAULT_GAP,
  trackColor,
  fillColor,
  as: Tag = 'span',
  className = '',
  style,
  'aria-label': ariaLabel,
}) {
  const vertical = orientation === 'vertical';
  const dashed = lineStyle === 'dashed';
  const pct = Math.min(Math.max(Number(progress) || 0, 0), 100);
  const size = thickness ?? LINE_THICKNESS[dashed ? 'dashed' : 'solid'];

  const tokens = {
    '--progress-line-t': `${size}px`,
    '--progress-line-dash': `${dash}px`,
    '--progress-line-gap': `${gap}px`,
    ...(trackColor && { '--progress-line-track': trackColor }),
    ...(fillColor && { '--progress-line-fill': fillColor }),
    ...style,
  };

  const aria = ariaLabel
    ? { role: 'progressbar', 'aria-label': ariaLabel, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(pct) }
    : { 'aria-hidden': 'true' };

  // El relleno se revela con clip-path (no con scale) para no deformar las rayas.
  const reveal = vertical ? `inset(0 0 ${100 - pct}% 0)` : `inset(0 ${100 - pct}% 0 0)`;

  return (
    <Tag
      className={`${styles.line} ${className}`.trim()}
      data-orientation={vertical ? 'vertical' : 'horizontal'}
      data-dashed={dashed || undefined}
      style={tokens}
      {...aria}
    >
      <span className={styles.fill} style={{ clipPath: reveal }} />
    </Tag>
  );
}

export { ProgressLine };
