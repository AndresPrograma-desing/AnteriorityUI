import React, { useEffect, useRef, useState } from 'react';
import CarouselSlide from './components/CarouselSlide/index';
import CarouselDots from './components/CarouselDots/index';
import CarouselArrow from './components/CarouselArrow/index';
import styles from './index.module.css';
import {
  DEFAULT_HEIGHT,
  DEFAULT_INTERVAL_MS,
  DEFAULT_TRANSITION,
  DEFAULT_TRANSITION_MS,
  SWIPE_THRESHOLD_PX,
} from './constants.js';
import { getNextIndex, getSlideStyle } from './utils.js';

// Carrusel de slides: imágenes, videos, texto, markdown o render propio (`render`).
// Las transiciones (slide / fade / zoom) son CSS puro; el autoplay se pausa con el mouse encima
// (opcional), y se navega con flechas, puntos, teclado y swipe.
export default function Carousel({
  slides = [],
  initialIndex = 0,
  onChange,
  autoPlay = false,
  interval = DEFAULT_INTERVAL_MS,
  loop = true,
  pauseOnHover = true,
  transition = DEFAULT_TRANSITION,
  transitionDuration = DEFAULT_TRANSITION_MS,
  height = DEFAULT_HEIGHT,
  showArrows = true,
  showDots = true,
  keyboard = true,
  swipe = true,
  arrowLabels,
  dotLabel,
  ariaLabel = 'Carrusel',
  // Colores (todos opcionales; sin prop se usa el default del CSS)
  bgColor,
  textColor,
  captionBgColor,
  captionTextColor,
  arrowSize,
  arrowIconSize,
  arrowColor,
  arrowBgColor,
  arrowBorderColor,
  arrowHoverBgColor,
  dotColor,
  dotActiveColor,
  focusColor,
  // Passthroughs a los hijos de la librería / elementos nativos
  imageProps,
  videoProps,
  markdownProps,
  prevArrowProps,
  nextArrowProps,
  className = '',
  style,
}) {
  const count = slides.length;
  const [index, setIndex] = useState(() => (count ? Math.min(Math.max(initialIndex, 0), count - 1) : 0));
  const [hovered, setHovered] = useState(false);
  const pointerStartX = useRef(null);

  // Si cambia la cantidad de slides, el índice no puede quedar fuera de rango.
  const current = count ? Math.min(index, count - 1) : 0;
  const paused = pauseOnHover && hovered;

  const goTo = (target) => {
    if (count === 0 || target === current) return;
    setIndex(target);
    onChange?.(target, slides[target]);
  };

  const step = (direction) => goTo(getNextIndex(current, direction, count, loop));

  // Ref al último `step` para que el timer de autoplay no se reinicie en cada render del padre.
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!autoPlay || paused || count < 2) return undefined;
    const timer = setTimeout(() => stepRef.current(1), interval);
    return () => clearTimeout(timer);
  }, [autoPlay, paused, current, interval, count]);

  const handleKeyDown = (event) => {
    if (!keyboard) return;
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  };

  const handlePointerDown = (event) => {
    if (swipe) pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    if (!swipe || pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) step(delta < 0 ? 1 : -1);
  };

  const themeVars = {
    '--carousel-duration': `${transitionDuration}ms`,
    ...(bgColor ? { '--carousel-slide-bg': bgColor } : {}),
    ...(textColor ? { '--carousel-text': textColor } : {}),
    ...(captionBgColor ? { '--carousel-caption-bg': captionBgColor } : {}),
    ...(captionTextColor ? { '--carousel-caption-text': captionTextColor } : {}),
    ...(dotColor ? { '--carousel-dot': dotColor } : {}),
    ...(dotActiveColor ? { '--carousel-dot-active': dotActiveColor } : {}),
    ...(focusColor ? { '--carousel-focus': focusColor } : {}),
  };

  const viewportHeight = typeof height === 'number' ? `${height}px` : height;
  const labels = { prev: 'Anterior', next: 'Siguiente', ...arrowLabels };

  return (
    <section
      className={`${styles.root} ${className}`.trim()}
      style={{ ...themeVars, ...style }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={keyboard ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStartX.current = null; }}
    >
      <div className={styles.viewport} style={{ height: viewportHeight }}>
        {slides.map((slide, i) => (
          <div
            key={slide.id ?? i}
            className={styles.slideWrap}
            style={getSlideStyle(i, current, transition, { length: count, loop })}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
          >
            <CarouselSlide
              slide={slide}
              index={i}
              active={i === current}
              imageProps={imageProps}
              videoProps={videoProps}
              markdownProps={markdownProps}
            />
          </div>
        ))}

        {showArrows && count > 1 && (
          <>
            <CarouselArrow
              direction="prev"
              label={labels.prev}
              onClick={() => step(-1)}
              size={arrowSize}
              iconSize={arrowIconSize}
              color={arrowColor}
              bgColor={arrowBgColor}
              borderColor={arrowBorderColor}
              hoverBgColor={arrowHoverBgColor}
              buttonProps={{ ...prevArrowProps, disabled: !loop && current === 0 || prevArrowProps?.disabled }}
            />
            <CarouselArrow
              direction="next"
              label={labels.next}
              onClick={() => step(1)}
              size={arrowSize}
              iconSize={arrowIconSize}
              color={arrowColor}
              bgColor={arrowBgColor}
              borderColor={arrowBorderColor}
              hoverBgColor={arrowHoverBgColor}
              buttonProps={{ ...nextArrowProps, disabled: !loop && current === count - 1 || nextArrowProps?.disabled }}
            />
          </>
        )}

        {showDots && count > 1 && (
          <CarouselDots count={count} current={current} onSelect={goTo} label={dotLabel} />
        )}
      </div>
    </section>
  );
}
