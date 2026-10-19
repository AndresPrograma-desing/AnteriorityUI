import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../../../Button/index';
import styles from './index.module.css';
import { PLAYBACK_RATES } from '../../../../constants.js';

// Menú desplegable para elegir la velocidad de reproducción (0.5x, 1x, 1.5x, etc.). Usado tanto
// por VideoPlayer (menú oscuro, se abre hacia arriba por default: el control vive en la barra
// inferior) como por AudioPlayer (menú claro vía menuBgColor/menuTextColor, se abre hacia abajo
// vía menuPosition="bottom" porque el control vive en una barra compacta sin espacio arriba).
const VideoSpeedControl = ({
  rate,
  onChange,
  controlsColor,
  accentColor = '#7c9cff',
  menuBgColor = 'rgba(20, 22, 28, 0.96)',
  menuTextColor = '#e6e8ec',
  menuBorderColor = 'rgba(255, 255, 255, 0.1)',
  menuPosition = 'top',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={styles.speedControl}>
      <Button
        size="small"
        variant="ghost"
        color="transparent"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Velocidad de reproducción"
        style={{ color: controlsColor || '#f1f3f6' }}
      >
        {rate}x
      </Button>
      {open && (
        <div
          className={`${styles.speedMenu} ${menuPosition === 'bottom' ? styles.speedMenuBottom : ''}`}
          style={{ backgroundColor: menuBgColor, borderColor: menuBorderColor }}
        >
          {PLAYBACK_RATES.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.speedOption}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              style={{ color: option === rate ? accentColor : menuTextColor }}
            >
              {option}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoSpeedControl;
