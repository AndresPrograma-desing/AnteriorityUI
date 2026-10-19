import React from 'react';
import Skeleton from '../../../../../Skeleton/index';
import styles from './index.module.css';

// Placeholder mostrado mientras el <audio> todavía no tiene metadata (duración desconocida),
// en vez de renderizar los controles reales a medio inicializar (seek bar en 0:00/0:00, etc.).
const AudioPlayerSkeleton = () => (
  <div className={styles.skeletonRow}>
    <Skeleton circle width={40} height={40} />
    <div className={styles.skeletonBody}>
      <Skeleton width="45%" height="12px" />
      <Skeleton width="100%" height="8px" radius="4px" />
      <div className={styles.skeletonControlsRow}>
        <Skeleton circle width={28} height={28} />
        <Skeleton width={72} height="8px" radius="4px" />
      </div>
    </div>
  </div>
);

export default AudioPlayerSkeleton;
