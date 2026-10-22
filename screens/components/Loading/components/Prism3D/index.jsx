import React from 'react';
import styles from './index.module.css';

export default function Prism3D({ color }) {
  return (
    <div className={styles.wrapper} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.prism}>
        <div className={`${styles.face} ${styles.top1}`} />
        <div className={`${styles.face} ${styles.top2}`} />
        <div className={`${styles.face} ${styles.top3}`} />
        <div className={`${styles.face} ${styles.top4}`} />
        <div className={`${styles.face} ${styles.bottom1}`} />
        <div className={`${styles.face} ${styles.bottom2}`} />
        <div className={`${styles.face} ${styles.bottom3}`} />
        <div className={`${styles.face} ${styles.bottom4}`} />
      </div>
    </div>
  );
}
