import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import {
  BounceBar,
  ContinuousBar,
  NeonScanner,
  LiquidPulse,
  Orbit3D,
  Waveform,
  DnaHelix,
  Rocket,
  Cube3D,
  Prism3D,
  Text3D,
  Text3DStatic,
} from './components/index.js';

const STANDALONE_VARIANTS = {
  'bounce-bar': BounceBar,
  'continuous-bar': ContinuousBar,
  'liquid-pulse': LiquidPulse,
  'orbit-3d': Orbit3D,
  waveform: Waveform,
  'dna-helix': DnaHelix,
  rocket: Rocket,
  'cube-3d': Cube3D,
  'prism-3d': Prism3D,
};

const Loading = ({
  text = "",
  phrases = [],
  size = 'medium',
  variant = 'default',
  className = '',
  color,
  active = true,
  onExited }) => {
  const [currentText, setCurrentText] = useState(text);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [render, setRender] = useState(active);

  useEffect(() => {
    if (active) setRender(true);
  }, [active]);

  const handleExitAnimationEnd = () => {
    if (!active) {
      setRender(false);
      onExited && onExited();
    }
  };

  useEffect(() => {
    if (!phrases || phrases.length === 0) {
      setCurrentText(text);
      return;
    }

    setCurrentText(phrases[0]);

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % phrases.length;
          setCurrentText(phrases[nextIndex]);
          return nextIndex;
        });
        setFade(true);
      }, 250);

    }, 3500);

    return () => clearInterval(interval);
  }, [phrases, text]);

  if (!render) return null;

  const isExiting = !active;

  const renderLoader = () => {
    const Standalone = STANDALONE_VARIANTS[variant];
    if (Standalone) return <Standalone color={color} />;

    switch (variant) {
      case 'bars':
        return <div className={styles.loaderBars}></div>;
      case 'bounce':
        return <div className={styles.loaderBounce}></div>;
      case 'box':
        return <div className={styles.loaderBox}></div>;
      case 'default':
      default:
        return (
          <div className={styles.spinnerWrapper}>
            <svg className={styles.spinner} viewBox="0 0 50 50">
              <circle
                className={styles.spinnerCircle}
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
              />
            </svg>
          </div>
        );
    }
  };

  if (variant === 'neon-scanner') {
    return (
      <div className={`${styles.loadingContainer} ${styles[size]} ${className}`}>
        <NeonScanner text={currentText} color={color} />
      </div>
    );
  }

  if (variant === 'text-3d') {
    return (
      <div
        className={`${styles.loadingContainer} ${styles[size]} ${isExiting ? styles.exiting : ''} ${className}`}
        onAnimationEnd={handleExitAnimationEnd}
      >
        <Text3D text={text} color={color} />
      </div>
    );
  }

  if (variant === 'text-3d-static') {
    return (
      <div
        className={`${styles.loadingContainer} ${styles[size]} ${isExiting ? styles.exiting : ''} ${className}`}
        onAnimationEnd={handleExitAnimationEnd}
      >
        <Text3DStatic text={text} color={color} />
      </div>
    );
  }

  if (variant === 'skeleton') {
    const widths = ['95%', '88%', '60%'];
    return (
      <div
        className={`${styles.skeletonContainer} ${className}`}
        style={color ? { '--loading-color': color } : undefined}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={styles.skeletonLine}
            style={{ width: widths[i % widths.length] }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.loadingContainer} ${styles[size]} ${className}`}
      style={color ? { '--loading-color': color } : undefined}
    >
      {renderLoader()}
      {currentText && (
        <span className={`${styles.text} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {currentText}
        </span>
      )}
    </div>
  );
};

export default Loading;