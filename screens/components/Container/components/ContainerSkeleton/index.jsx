import React from 'react';
import Skeleton from '../../../Skeleton/index';
import styles from './index.module.css';
import {
  DEFAULT_STEP_COUNT,
  DEFAULT_FIELD_COUNT,
  DEFAULT_STEP_SIZE,
  STEP_LABEL_WIDTH,
} from './constants.js';

// Esqueleto con la forma real del contenido del Container mientras `loading`: un Stepper
// (círculos unidos por una línea, con su etiqueta debajo) y un formulario (etiqueta + campo por
// cada input, repartidos en las mismas columnas que el uiSchema). Cada parte se pinta solo si
// el Container va a mostrarla.
export default function ContainerSkeleton({
  showStepper = false,
  stepCount = DEFAULT_STEP_COUNT,
  stepSize = DEFAULT_STEP_SIZE,
  showForm = true,
  fieldCount = DEFAULT_FIELD_COUNT,
  columns = 1,
  color,
  className = '',
}) {
  // Con `color` (loadingColor) el esqueleto se tiñe de ese color en vez del gris por defecto.
  const tint = color ? { background: `color-mix(in srgb, ${color} 18%, transparent)` } : undefined;
  const steps = Math.max(1, stepCount);
  const cols = Math.max(1, Math.floor(columns) || 1);

  return (
    <div className={`${styles.root} ${className}`} role="status" aria-busy="true" aria-live="polite">
      {showStepper && (
        <div className={styles.stepper}>
          {Array.from({ length: steps }, (_, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Skeleton className={styles.connector} height={4} radius="999px" style={tint} />}
              <div className={styles.step} style={{ width: stepSize }}>
                <Skeleton circle width={stepSize} height={stepSize} style={tint} />
                <Skeleton className={styles.stepLabel} width={STEP_LABEL_WIDTH} height={10} style={tint} />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      {showForm && (
        <div className={styles.form}>
          <div className={styles.fields} style={{ '--container-skeleton-cols': cols }}>
            {Array.from({ length: fieldCount }, (_, index) => (
              <div key={index} className={styles.field}>
                <Skeleton width="32%" height={10} style={tint} />
                <Skeleton width="100%" height={30} radius="8px" style={tint} />
              </div>
            ))}
          </div>
          <Skeleton width="100%" height={38} radius="8px" style={tint} />
        </div>
      )}
    </div>
  );
}
