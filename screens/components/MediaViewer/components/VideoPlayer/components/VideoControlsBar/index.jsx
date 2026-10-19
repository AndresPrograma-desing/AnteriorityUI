import React from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Undo2,
  FastForward,
  PictureInPicture2,
} from 'lucide-react';
import Button from '../../../../../Button/index';
import Slider from '../../../../../Slider/index';
import VideoSpeedControl from '../VideoSpeedControl/index';
import styles from './index.module.css';

// Fila de controles inferior: play/pause, volver al punto anterior/avance, volumen, velocidad,
// PiP y fullscreen.
const VideoControlsBar = ({
  isPlaying,
  onTogglePlay,
  onSkipBack,
  canUndoSeek,
  onSkipForward,
  skipSeconds,
  volume,
  isMuted,
  onMuteClick,
  onVolumeChange,
  playbackRate,
  onPlaybackRateChange,
  pipEnabled,
  pipSupported,
  onTogglePip,
  isFullscreen,
  onToggleFullscreen,
  accentColor,
  controlsColor,
}) => {
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const iconStyle = { color: controlsColor || '#f1f3f6' };

  return (
    <div className={styles.controlsRow}>
      <div className={styles.controlsLeft}>
        <Button
          circle
          size="small"
          variant="ghost"
          color="transparent"
          icon={isPlaying ? Pause : Play}
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          style={iconStyle}
        />
        <Button
          circle
          size="small"
          variant="ghost"
          color="transparent"
          icon={Undo2}
          onClick={onSkipBack}
          disabled={!canUndoSeek}
          aria-label="Volver al punto anterior"
          title="Volver al punto anterior al último salto"
          style={iconStyle}
        />
        <Button
          circle
          size="small"
          variant="ghost"
          color="transparent"
          icon={FastForward}
          onClick={onSkipForward}
          aria-label={`Avanzar ${skipSeconds} segundos`}
          title={`Avanzar ${skipSeconds}s`}
          style={iconStyle}
        />

        <div className={styles.volumeGroup}>
          <Button
            circle
            size="small"
            variant="ghost"
            color="transparent"
            icon={VolumeIcon}
            onClick={onMuteClick}
            aria-label="Silenciar"
            style={iconStyle}
          />
          <div className={styles.volumeSliderWrap}>
            <Slider
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              accentColor={accentColor}
              thickness={4}
              aria-label="Volumen"
            />
          </div>
        </div>
      </div>

      <div className={styles.controlsRight}>
        <VideoSpeedControl
          rate={playbackRate}
          onChange={onPlaybackRateChange}
          controlsColor={controlsColor}
          accentColor={accentColor}
        />
        {pipEnabled && pipSupported && (
          <Button
            circle
            size="small"
            variant="ghost"
            color="transparent"
            icon={PictureInPicture2}
            onClick={onTogglePip}
            aria-label="Picture in Picture"
            style={iconStyle}
          />
        )}
        <Button
          circle
          size="small"
          variant="ghost"
          color="transparent"
          icon={isFullscreen ? Minimize : Maximize}
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          style={iconStyle}
        />
      </div>
    </div>
  );
};

export default VideoControlsBar;
