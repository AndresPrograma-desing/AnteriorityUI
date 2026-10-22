import React from 'react';
import styles from './index.module.css';

export default function Rocket({ color }) {
  return (
    <div className={styles.container} style={color ? { '--loading-color': color } : undefined}>
      <div className={styles.ship}>
        <svg className={styles.svg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.5C12 2.5 17 6 17 13C17 16.5 15.5 19 15.5 19L12 17.5L8.5 19C8.5 19 7 16.5 7 13C7 6 12 2.5 12 2.5Z"
            className={styles.hull}
          />
          <path d="M12 2.5C12 2.5 14.5 5 15 9.5H9C9.5 5 12 2.5 12 2.5Z" className={styles.hull} />
          <path d="M5 13C5 13 3 14.5 3 17.5C3 19 4.5 19.5 4.5 19.5L7.5 15.5C6.2 14.8 5 13 5 13Z" className={styles.hull} />
          <path d="M19 13C19 13 21 14.5 21 17.5C21 19 19.5 19.5 19.5 19.5L16.5 15.5C17.8 14.8 19 13 19 13Z" className={styles.hull} />
          <circle cx="12" cy="11" r="2.2" className={styles.window} strokeWidth="1.2" />
        </svg>
        <div className={styles.fire} />
      </div>
      <div className={styles.smoke} />
    </div>
  );
}
