import { SLIDE_TYPES, TRANSITIONS, VIDEO_EXTENSION_PATTERN } from './constants.js';

// Tipo efectivo de un slide: explícito en `type`, o inferido de `render` / `src` / `content`.
export const resolveSlideType = (slide) => {
  if (slide.type) return slide.type;
  if (slide.render) return SLIDE_TYPES.CUSTOM;
  if (slide.src) return VIDEO_EXTENSION_PATTERN.test(slide.src) ? SLIDE_TYPES.VIDEO : SLIDE_TYPES.IMAGE;
  if (slide.content) return SLIDE_TYPES.MARKDOWN;
  return SLIDE_TYPES.TEXT;
};

// Índice siguiente según dirección (+1 / -1). Con loop=false se queda en los extremos.
export const getNextIndex = (current, direction, length, loop) => {
  if (length === 0) return 0;
  const next = current + direction;
  if (next < 0) return loop ? length - 1 : 0;
  if (next >= length) return loop ? 0 : length - 1;
  return next;
};

// Distancia más corta dentro de un ciclo de `length` slides. Con loop, ir del último al primero
// es avanzar +1 (el primero entra desde la derecha) y no retroceder por todos los demás.
export const wrapOffset = (delta, length) => {
  if (length <= 1) return delta;
  let d = ((delta % length) + length) % length;
  if (d > length / 2) d -= length;
  return d;
};

// Estilo inline de cada slide según la transición. La duración y la curva viven en CSS
// (variable --carousel-duration), así un mismo estilo sirve para slide, fade y zoom.
export const getSlideStyle = (index, current, transition, { length = 0, loop = false } = {}) => {
  const offset = loop ? wrapOffset(index - current, length) : index - current;
  const isActive = offset === 0;

  if (transition === TRANSITIONS.FADE) {
    return { transform: 'none', opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 };
  }
  if (transition === TRANSITIONS.ZOOM) {
    return {
      transform: isActive ? 'scale(1)' : 'scale(1.08)',
      opacity: isActive ? 1 : 0,
      zIndex: isActive ? 1 : 0,
    };
  }
  // slide (default): cada slide queda a la izquierda o derecha del activo.
  return { transform: `translateX(${offset * 100}%)`, opacity: 1, zIndex: isActive ? 1 : 0 };
};
