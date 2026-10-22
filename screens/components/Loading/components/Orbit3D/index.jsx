import React from 'react';
import styles from './index.module.css';

export default function Orbit3D({ color }) {
  return (
    <div className={styles.orbit} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.ring} />
      <div className={styles.ring} />
    </div>
  );
}
