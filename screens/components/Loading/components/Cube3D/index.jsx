import React from 'react';
import styles from './index.module.css';

export default function Cube3D({ color }) {
  return (
    <div className={styles.wrapper} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.cube}>
        <div className={`${styles.face} ${styles.front}`} />
        <div className={`${styles.face} ${styles.back}`} />
        <div className={`${styles.face} ${styles.right}`} />
        <div className={`${styles.face} ${styles.left}`} />
        <div className={`${styles.face} ${styles.top}`} />
        <div className={`${styles.face} ${styles.bottom}`} />
      </div>
      <div className={styles.shadow} />
    </div>
  );
}
