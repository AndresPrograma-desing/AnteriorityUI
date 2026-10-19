import React, { useState, useRef } from 'react';
import Slider from '../../../../../Slider/index';
import styles from './index.module.css';
import { formatTime } from '../../../../utils.js';

// Fila de progreso del video/audio: tiempo actual, slider de seek (con preview de tiempo al
// hover, tipo YouTube) y duración total.
const VideoSeekBar = ({ currentTime, duration, onSeek, accentColor, textColor }) => {
  const trackRef = useRef(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  const handleMouseMove = (event) => {
    const track = trackRef.current;
    if (!track || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    setHoverX(event.clientX - rect.left);
    setHoverTime(ratio * duration);
  };

  const timeLabelStyle = textColor ? { color: textColor } : undefined;

  return (
    <div className={styles.seekRow}>
      <span className={styles.timeLabel} style={timeLabelStyle}>{formatTime(currentTime)}</span>
      <div
        ref={trackRef}
        className={styles.seekSlider}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        {hoverTime != null && (
          <span className={styles.hoverPreview} style={{ left: hoverX }}>
            {formatTime(hoverTime)}
          </span>
        )}
        <Slider
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={onSeek}
          accentColor={accentColor}
          thickness={4}
          aria-label="Progreso"
        />
      </div>
      <span className={styles.timeLabel} style={timeLabelStyle}>{formatTime(duration)}</span>
    </div>
  );
};

export default VideoSeekBar;
