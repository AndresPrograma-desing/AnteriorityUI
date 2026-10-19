import React from 'react';
import { Play } from 'lucide-react';
import Button from '../../../../../Button/index';
import styles from './index.module.css';

// Botón grande centrado que aparece sobre el video cuando está pausado (sin buffering/error).
const VideoCenterPlayButton = ({ onClick, controlsColor }) => (
  <Button
    circle
    variant="ghost"
    color="transparent"
    onClick={onClick}
    aria-label="Reproducir"
    className={styles.centerPlayButton}
    style={{
      color: controlsColor || '#ffffff',
      width: 56,
      height: 56,
      backgroundColor: 'rgba(13, 15, 20, 0.55)',
    }}
  >
    <Play size={28} fill="currentColor" />
  </Button>
);

export default VideoCenterPlayButton;
