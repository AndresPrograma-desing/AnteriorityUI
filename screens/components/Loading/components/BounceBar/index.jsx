import React from 'react';
import styles from './index.module.css';

export default function BounceBar({ color }) {
  return (
    <div className={styles.track} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.fill} />
    </div>
  );
}
