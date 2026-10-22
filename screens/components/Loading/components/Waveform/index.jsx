import React from 'react';
import styles from './index.module.css';

export default function Waveform({ color }) {
  return (
    <div className={styles.waveform} style={color ? { '--loading-color': color } : undefined}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.bar} />
      ))}
    </div>
  );
}
