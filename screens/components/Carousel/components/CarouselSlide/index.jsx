import React, { useEffect, useRef } from 'react';
import MarkdownContent from '../../../MarkdownContent/index';
import styles from './index.module.css';
import { resolveSlideType } from '../../utils.js';
import { SLIDE_TYPES } from '../../constants.js';

// Renderiza un slide según su tipo. El video se pausa cuando el slide deja de estar activo.
function CarouselSlide({ slide, index, active, imageProps, videoProps, markdownProps }) {
  const videoRef = useRef(null);
  const type = resolveSlideType(slide);

  useEffect(() => {
    if (!active && videoRef.current) videoRef.current.pause();
  }, [active]);

  let content = null;

  if (type === SLIDE_TYPES.IMAGE) {
    content = (
      <img
        src={slide.src}
        alt={slide.alt ?? ''}
        loading="lazy"
        draggable={false}
        className={styles.media}
        {...imageProps}
      />
    );
  } else if (type === SLIDE_TYPES.VIDEO) {
    content = (
      <video
        ref={videoRef}
        src={slide.src}
        poster={slide.poster}
        controls
        playsInline
        muted={slide.muted ?? true}
        className={styles.media}
        {...videoProps}
      />
    );
  } else if (type === SLIDE_TYPES.MARKDOWN) {
    content = (
      <div className={styles.text}>
        {slide.title && <h3 className={styles.title}>{slide.title}</h3>}
        <MarkdownContent {...markdownProps}>{slide.content}</MarkdownContent>
      </div>
    );
  } else if (type === SLIDE_TYPES.CUSTOM) {
    content = slide.render({ active, index });
  } else {
    content = (
      <div className={styles.text}>
        {slide.title && <h3 className={styles.title}>{slide.title}</h3>}
        <p className={styles.plain}>{slide.content}</p>
      </div>
    );
  }

  return (
    <div className={styles.slide} aria-hidden={!active} data-slide-type={type}>
      {content}
      {slide.caption && (type === SLIDE_TYPES.IMAGE || type === SLIDE_TYPES.VIDEO) && (
        <div className={styles.caption}>{slide.caption}</div>
      )}
    </div>
  );
}

export default CarouselSlide;
