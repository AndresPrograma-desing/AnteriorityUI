import React from 'react';
import styles from './index.module.css';
import { useCountdown, getColorForProgress } from './utils';
import ModalTooltip from '../ModalTooltip/ModalTooltip';

export default function CountdownBar({ 
  active, 
  duration = 10000, 
  onComplete,
  height = '6px',
  width = '100%',
  colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'], // Del rojo (acabándose) al azul (inicio)
  expiresAt,
  totalDuration = 900000,
  value,
  increment = false,
  isOverlay = false,
  overlayMessage,
  showTooltip = true, // false = sin ModalTooltip (útil dentro de otros componentes)
  color, // color sólido; si se pasa, reemplaza el gradiente de `colors`
  trackColor, // fondo de la pista (default #f1f5f9)
  borderColor, // borde de la pista (default #e2e8f0)
  className = '',
  style
}) {
  const timerState = useCountdown(active && value === undefined, duration, onComplete, expiresAt, totalDuration);
  
  let progress = value !== undefined ? value : timerState.progress;
  if (increment && value === undefined) {
    progress = 100 - progress;
  }
  const remainingSeconds = timerState.remainingSeconds;
  const remainingTime = remainingSeconds ? remainingSeconds.toFixed(1) : '0.0';

  if (!active) return null;

  const currentColor = getColorForProgress(progress, colors);

  const tooltipText = value !== undefined 
    ? `${Math.round(progress)}% completado` 
    : `${remainingTime}s restantes`;

  const colorVars = {
    ...(trackColor ? { '--countdown-track': trackColor } : {}),
    ...(borderColor ? { '--countdown-border': borderColor } : {}),
  };

  const withTooltip = (node) =>
    showTooltip ? (
      <ModalTooltip text={tooltipText} style={{ width: '100%', display: 'block' }}>
        {node}
      </ModalTooltip>
    ) : (
      node
    );

  const barContent = (
    <div className={`${styles.wrapper} ${className}`.trim()} style={{ width, ...colorVars, ...style }}>
      <div 
        className={styles.container} 
        style={{ height }}
        aria-valuemin="0" 
        aria-valuemax="100" 
        aria-valuenow={progress} 
        role="progressbar"
      >
        <div 
          className={styles.bar} 
          style={{ 
            width: `${progress}%`,
            ...(color
              ? { backgroundColor: color }
              // Crea un sutil gradiente interno que se mezcla de forma suave
              : { backgroundImage: `linear-gradient(90deg, ${currentColor}, ${currentColor}dd)` }),
          }} 
        />
      </div>
    </div>
  );

  if (isOverlay) {
    return (
      <div className={styles.overlayContainer}>
        {overlayMessage && (
          <p className={styles.overlayMessage}>
            {overlayMessage}
          </p>
        )}
        <div style={{ width: '80%' }}>
          {withTooltip(barContent)}
        </div>
      </div>
    );
  }

  return withTooltip(barContent);
}