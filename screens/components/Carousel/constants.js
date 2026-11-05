export const TRANSITIONS = {
  SLIDE: 'slide',
  FADE: 'fade',
  ZOOM: 'zoom',
};

export const DEFAULT_TRANSITION = TRANSITIONS.SLIDE;
export const DEFAULT_TRANSITION_MS = 450;
export const DEFAULT_INTERVAL_MS = 5000;
export const DEFAULT_HEIGHT = 320;
export const SWIPE_THRESHOLD_PX = 50;

// Extensiones que se detectan como video cuando un slide solo trae `src`.
export const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov)(\?|#|$)/i;

export const SLIDE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  TEXT: 'text',
  MARKDOWN: 'markdown',
  CUSTOM: 'custom',
};
