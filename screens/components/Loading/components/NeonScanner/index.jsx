import React from 'react';
import styles from './index.module.css';

export default function NeonScanner({ text, color }) {
  return (
    <div className={styles.scanner} style={color ? { '--loading-color': color } : undefined}>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
