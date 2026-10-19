import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';
import Button from '../../../../../Button/index';
import styles from './index.module.css';

// Overlay mostrado cuando el <video> dispara un evento error, con botón de reintento.
const VideoErrorOverlay = ({ errorLabel, retryLabel, onRetry }) => (
  <div className={styles.overlay}>
    <div className={styles.errorCard}>
      <AlertCircle size={32} className={styles.errorIcon} />
      <p className={styles.errorMsg}>{errorLabel}</p>
      <Button
        variant="outline"
        icon={RotateCw}
        onClick={onRetry}
        size="small"
        color="#f1f3f6"
        borderColor="rgba(255, 255, 255, 0.2)"
      >
        {retryLabel}
      </Button>
    </div>
  </div>
);

export default VideoErrorOverlay;
