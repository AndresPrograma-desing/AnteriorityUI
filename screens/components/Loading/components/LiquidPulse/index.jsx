import React from 'react';
import styles from './index.module.css';

export default function LiquidPulse({ color }) {
  return (
    <div className={styles.wrapper} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.ball} />
      <div className={styles.ball} />
      <div className={styles.ball} />
    </div>
  );
}
