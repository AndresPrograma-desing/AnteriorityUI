import React from 'react';
import styles from './index.module.css';

// Indicadores de posición. Cada punto es un botón accesible que salta al slide correspondiente.
function CarouselDots({ count, current, onSelect, label = 'Ir al slide' }) {
  return (
    <div className={styles.dots}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-current={i === current ? 'true' : undefined}
          aria-label={`${label} ${i + 1}`}
          className={`${styles.dot} ${i === current ? styles.dotActive : ''}`.trim()}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}

export default CarouselDots;
