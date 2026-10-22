import React from 'react';
import styles from './index.module.css';

const DEPTH_LAYERS = 10;

export default function Text3D({ text, color }) {
  const displayText = (text || '?').trim() || '?';

  return (
    <div className={styles.wrapper} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.scene}>
        {Array.from({ length: DEPTH_LAYERS }).map((_, i) => (
          <span
            key={i}
            className={styles.layer}
            style={{
              transform: `translate(-50%, -50%) translateZ(${-i}px)`,
              opacity: 1 - (i / DEPTH_LAYERS) * 0.6,
            }}
          >
            {displayText}
          </span>
        ))}
        <span className={`${styles.layer} ${styles.front}`} style={{ transform: 'translate(-50%, -50%)' }}>
          {displayText}
        </span>
      </div>
    </div>
  );
}
