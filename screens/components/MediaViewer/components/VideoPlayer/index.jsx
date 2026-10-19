import React, { useState, useRef, useEffect, useCallback } from 'react';
import Loading from '../../../Loading/index';
import KeyboardShortcut from '../../../KeyboardShortcut/index';
import {
  VideoSeekBar,
  VideoControlsBar,
  VideoErrorOverlay,
  VideoCenterPlayButton,
  VideoTimeSearch,
} from './components/index.js';
import styles from './index.module.css';
import {
  DEFAULT_VIDEO_ACCENT,
  DEFAULT_VIDEO_ERROR_LABEL,
  DEFAULT_RETRY_LABEL,
  DEFAULT_LOADING_VARIANT,
  DEFAULT_LOADING_SIZE,
  DEFAULT_PLAYBACK_RATE,
  CONTROLS_HIDE_DELAY_MS,
  SEEK_STEP_SECONDS,
} from '../../constants.js';

// Reproductor de video con controles custom (play/pause, seek, volumen, fullscreen, PiP),
// pensado para reemplazar el <video controls> nativo del browser por una UI consistente con
// la paleta de la librería. Es un <video> normal (no HLS/streaming) — src/poster/loop/muted
// se comportan igual que en el <video> HTML estándar.
const VideoPlayer = ({
  src,
  poster,
  alt,
  loop = false,
  muted: initialMuted = false,
  autoPlay = false,
  accentColor = DEFAULT_VIDEO_ACCENT,
  controlsColor,
  onError,
  pipEnabled = true,
  errorLabel = DEFAULT_VIDEO_ERROR_LABEL,
  retryLabel = DEFAULT_RETRY_LABEL,
  loadingVariant = DEFAULT_LOADING_VARIANT,
  loadingSize = DEFAULT_LOADING_SIZE,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);
  const isPlayingRef = useRef(false);
  const lastVolumeRef = useRef(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pipSupported, setPipSupported] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialMuted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isHovering, setIsHovering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(DEFAULT_PLAYBACK_RATE);
  const [previousTime, setPreviousTime] = useState(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.pictureInPictureEnabled) {
      setPipSupported(true);
    }
  }, []);

  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, CONTROLS_HIDE_DELAY_MS);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    scheduleHideControls();
  }, [scheduleHideControls]);

  useEffect(() => () => {
    if (hideControlsTimeoutRef.current) clearTimeout(hideControlsTimeoutRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, []);

  const retry = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setHasError(false);
    setIsBuffering(true);
    video.load();
    video.play().catch(() => setIsPlaying(false));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setHasError(false);
    };
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const onRateChange = () => setPlaybackRate(video.playbackRate);
    const onErrorEvent = (event) => {
      setIsBuffering(false);
      setHasError(true);
      onError?.(event);
    };

    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ratechange', onRateChange);
    video.addEventListener('error', onErrorEvent);

    return () => {
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ratechange', onRateChange);
      video.removeEventListener('error', onErrorEvent);
    };
  }, [onError]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen puede ser rechazado por el browser (ej. sin gesto de usuario directo); no hay
      // nada más que hacer salvo dejar el botón disponible para reintentar.
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP puede no estar disponible (video sin metadata cargada) o ser denegado por el browser.
    }
  }, []);

  const handleMuteClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted || volume === 0) {
      video.muted = false;
      video.volume = lastVolumeRef.current || 1;
    } else {
      lastVolumeRef.current = volume;
      video.muted = true;
    }
  };

  const handleVolumeChange = (next) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = next;
    video.muted = next === 0;
  };

  // Seek manual (arrastrar la seek bar o el buscador de tiempo): guarda dónde estaba el video
  // ANTES de este salto, para que "volver" (undoSeek) pueda deshacerlo si fue un salto accidental.
  const handleSeek = (next) => {
    const video = videoRef.current;
    if (!video) return;
    setPreviousTime(video.currentTime);
    video.currentTime = next;
    setCurrentTime(next);
  };

  // Vuelve a la posición previa al último seek manual, sin registrar un nuevo punto de historial
  // (si no, "volver" otra vez te devolvería al lugar del que acabás de escapar).
  const undoSeek = () => {
    const video = videoRef.current;
    if (!video || previousTime == null) return;
    video.currentTime = previousTime;
    setCurrentTime(previousTime);
    setPreviousTime(null);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    handleSeek(Math.min(video.currentTime + SEEK_STEP_SECONDS, duration || video.duration || 0));
  };

  const handlePlaybackRateChange = (nextRate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = nextRate;
  };

  return (
    <KeyboardShortcut shortcut="space" enabled={isHovering || isFullscreen} onTrigger={togglePlay}>
      <div
        ref={containerRef}
        className={`${styles.videoPlayer} ${isFullscreen ? styles.videoPlayerFullscreen : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (isPlaying) setShowControls(false);
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop={loop}
          muted={initialMuted}
          autoPlay={autoPlay}
          playsInline
          className={styles.videoPlayerEl}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        >
          {alt}
        </video>

        {isBuffering && !hasError && (
          <div className={styles.bufferingOverlay}>
            <Loading variant={loadingVariant} size={loadingSize} color={controlsColor || accentColor} />
          </div>
        )}

        {hasError && (
          <VideoErrorOverlay errorLabel={errorLabel} retryLabel={retryLabel} onRetry={retry} />
        )}

        {!isPlaying && !isBuffering && !hasError && (
          <VideoCenterPlayButton onClick={togglePlay} controlsColor={controlsColor} />
        )}

        <div className={`${styles.controlsBar} ${showControls || !isPlaying ? styles.controlsBarVisible : ''}`}>
          <div className={styles.seekSearchRow}>
            <VideoSeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              accentColor={accentColor}
            />
            <VideoTimeSearch duration={duration} onSeek={handleSeek} controlsColor={controlsColor} />
          </div>
          <VideoControlsBar
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onSkipBack={undoSeek}
            canUndoSeek={previousTime != null}
            onSkipForward={skipForward}
            skipSeconds={SEEK_STEP_SECONDS}
            volume={volume}
            isMuted={isMuted}
            onMuteClick={handleMuteClick}
            onVolumeChange={handleVolumeChange}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRateChange}
            pipEnabled={pipEnabled}
            pipSupported={pipSupported}
            onTogglePip={togglePiP}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            accentColor={accentColor}
            controlsColor={controlsColor}
          />
        </div>
      </div>
    </KeyboardShortcut>
  );
};

export default VideoPlayer;
