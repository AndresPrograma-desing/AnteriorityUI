import React from 'react';
import styles from './index.module.css';

export default function DnaHelix({ color }) {
  return (
    <div className={styles.dna} style={color ? { '--loading-color': color } : undefined}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.dot} />
      ))}
    </div>
  );
}
