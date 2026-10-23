import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { VARIANT_TAGS, DEFAULT_VARIANT, DEFAULT_ALIGN } from './constants.js';

export default function Text({
  children,
  variant = DEFAULT_VARIANT,
  color,
  align = DEFAULT_ALIGN,
  className = '',
  style,
  // Props de animación y control de tiempos
  animate, // 'fade-in' | 'fade-out' | 'letter-fade-in' | 'letter-fade-out' | 'typing' | 'rise-and-fade'
  duration = 800, // Duración total para fade / letter-fade en ms
  typingSpeed = 50, // Milisegundos entre letras para 'typing'
  riseDuration = 1000, // Duración de la subida y desvanecimiento en ms
  riseDelay = 400, // Tiempo de espera antes de empezar a subir y desaparecer en ms
}) {
  const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS[DEFAULT_VARIANT];
  const textContent = typeof children === 'string' ? children : '';
  const [displayedText, setDisplayedText] = useState(animate === 'typing' ? '' : textContent);

  // Animación tipo máquina de escribir
  useEffect(() => {
    if (animate !== 'typing' || !textContent) {
      setDisplayedText(textContent);
      return;
    }

    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < textContent.length) {
        setDisplayedText((prev) => prev + textContent.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [animate, textContent, typingSpeed]);

  // Clases CSS según la animación seleccionada
  const getAnimationClass = () => {
    switch (animate) {
      case 'fade-in':
        return styles.animateFadeIn;
      case 'fade-out':
        return styles.animateFadeOut;
      case 'typing':
        return styles.animateTyping;
      case 'rise-and-fade':
        return styles.animateRiseAndFade;
      case 'letter-fade-in':
      case 'letter-fade-out':
        return styles.letterFadeContainer;
      default:
        return '';
    }
  };

  const isLetterFade = animate === 'letter-fade-in' || animate === 'letter-fade-out';

  const renderContent = () => {
    if (animate === 'typing') {
      return displayedText;
    }

    if (isLetterFade && textContent) {
      const isOut = animate === 'letter-fade-out';
      const letters = textContent.split('');
      const stepDelay = duration / Math.max(letters.length, 1);

      return letters.map((char, index) => {
        // Si es salida, invertimos el orden para que desaparezca de atrás hacia adelante
        const targetIndex = isOut ? letters.length - 1 - index : index;

        return (
          <span
            key={index}
            className={isOut ? styles.letterFadeOut : styles.letterFadeIn}
            style={{
              animationDuration: `${Math.min(stepDelay * 4, 600)}ms`,
              animationDelay: `${targetIndex * stepDelay}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      });
    }

    return children;
  };

  return (
    <Tag
      className={`${styles.text} ${styles[variant] || ''} ${getAnimationClass()} ${className}`.trim()}
      style={{
        textAlign: align,
        ...(color ? { '--text-color': color } : {}),
        '--anim-duration': `${duration}ms`,
        '--rise-duration': `${riseDuration}ms`,
        '--rise-delay': `${riseDelay}ms`,
        ...style,
      }}
    >
      {renderContent()}
    </Tag>
  );
}