import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, Music, AlertCircle, RotateCw } from 'lucide-react';
import Button from '../../../Button/index';
import Slider from '../../../Slider/index';
import { VideoSeekBar, VideoSpeedControl } from '../VideoPlayer/components/index.js';
import { AudioPlayerSkeleton } from './components/index.js';
import styles from './index.module.css';
import {
  DEFAULT_AUDIO_ACCENT,
  DEFAULT_AUDIO_CONTROLS_COLOR,
  DEFAULT_AUDIO_ICON_BG,
  DEFAULT_AUDIO_ERROR_LABEL,
  DEFAULT_PLAYBACK_RATE,
} from '../../constants.js';

// Reproductor de audio con controles custom (play/pause, seek, volumen, velocidad), pensado
// para reemplazar el <audio controls> nativo del browser por una UI consistente con la paleta
// de la librería. Reusa VideoSeekBar/VideoSpeedControl (agnósticos de video: solo necesitan
// currentTime/duration/rate) para no duplicar esa lógica.
const AudioPlayer = ({
  src,
  fileName,
  loop = false,
  muted: initialMuted = false,
  autoPlay = false,
  accentColor = DEFAULT_AUDIO_ACCENT,
  controlsColor = DEFAULT_AUDIO_CONTROLS_COLOR,
  iconBgColor = DEFAULT_AUDIO_ICON_BG,
  onError,
  errorLabel = DEFAULT_AUDIO_ERROR_LABEL,
}) => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialMuted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [playbackRate, setPlaybackRate] = useState(DEFAULT_PLAYBACK_RATE);

  const lastVolumeRef = useRef(1);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  const retry = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasError(false);
    setIsLoading(true);
    audio.load();
    audio.play().catch(() => setIsPlaying(false));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onPlaying = () => {
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    };
    const onRateChange = () => setPlaybackRate(audio.playbackRate);
    const onErrorEvent = (event) => {
      setHasError(true);
      setIsLoading(false);
      onError?.(event);
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('volumechange', onVolumeChange);
    audio.addEventListener('ratechange', onRateChange);
    audio.addEventListener('error', onErrorEvent);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('volumechange', onVolumeChange);
      audio.removeEventListener('ratechange', onRateChange);
      audio.removeEventListener('error', onErrorEvent);
    };
  }, [onError]);

  const handleMuteClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted || volume === 0) {
      audio.muted = false;
      audio.volume = lastVolumeRef.current || 1;
    } else {
      lastVolumeRef.current = volume;
      audio.muted = true;
    }
  };

  const handleVolumeChange = (next) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = next;
    audio.muted = next === 0;
  };

  const handleSeek = (next) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const handlePlaybackRateChange = (nextRate) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = nextRate;
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const iconStyle = { color: controlsColor };

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioRef}
        src={src}
        loop={loop}
        muted={initialMuted}
        autoPlay={autoPlay}
        className={styles.audioEl}
      />

      {isLoading && !hasError ? (
        <AudioPlayerSkeleton />
      ) : (
        <>
          <div className={styles.iconBadge} style={{ backgroundColor: iconBgColor, color: accentColor }}>
            <Music size={18} />
          </div>

          <div className={styles.body}>
            {fileName && <div className={styles.fileName} style={{ color: controlsColor }}>{fileName}</div>}

            {hasError ? (
              <div className={styles.errorRow}>
                <AlertCircle size={16} className={styles.errorIcon} />
                <span className={styles.errorMsg} style={{ color: controlsColor }}>{errorLabel}</span>
                <Button variant="ghost" size="small" icon={RotateCw} onClick={retry} color={accentColor}>
                  Reintentar
                </Button>
              </div>
            ) : (
              <>
                <VideoSeekBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
                  accentColor={accentColor}
                  textColor={controlsColor}
                />

                <div className={styles.controlsRow}>
                  <Button
                    circle
                    size="small"
                    variant="ghost"
                    color="transparent"
                    icon={isPlaying ? Pause : Play}
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    style={iconStyle}
                  />

                  <div className={styles.volumeGroup}>
                    <Button
                      circle
                      size="small"
                      variant="ghost"
                      color="transparent"
                      icon={VolumeIcon}
                      onClick={handleMuteClick}
                      aria-label="Silenciar"
                      style={iconStyle}
                    />
                    <div className={styles.volumeSliderWrap}>
                      <Slider
                        min={0}
                        max={1}
                        step={0.02}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        accentColor={accentColor}
                        thickness={4}
                        aria-label="Volumen"
                      />
                    </div>
                  </div>

                  <div className={styles.speedWrap}>
                    <VideoSpeedControl
                      rate={playbackRate}
                      onChange={handlePlaybackRateChange}
                      controlsColor={controlsColor}
                      accentColor={accentColor}
                      menuBgColor="#ffffff"
                      menuTextColor="#334155"
                      menuBorderColor="#e2e8f0"
                      menuPosition="bottom"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
