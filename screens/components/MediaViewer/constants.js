export const MEDIA_KIND = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  PDF: 'pdf',
  DOCX: 'docx',
  FILE: 'file',
};

export const DEFAULT_DOWNLOAD_LABEL = 'Descargar';
export const DEFAULT_OPEN_LABEL = 'Abrir';

// Paleta por default del reproductor de video custom (fondo oscuro tipo "theater"),
// pisable vía props videoBgColor/videoAccentColor/videoControlsColor.
export const DEFAULT_VIDEO_BG = '#0d0f14';
export const DEFAULT_VIDEO_ACCENT = '#7c9cff';
export const DEFAULT_VIDEO_CONTROLS_COLOR = '#f1f3f6';

export const CONTROLS_HIDE_DELAY_MS = 3000;
export const SEEK_STEP_SECONDS = 5;
export const VOLUME_STEP = 0.05;

export const DEFAULT_VIDEO_ERROR_LABEL = 'No se pudo cargar el video';
export const DEFAULT_RETRY_LABEL = 'Reintentar';

// Variant/size del componente Loading usado en el overlay de buffering del video,
// pisables vía props loadingVariant/loadingSize de MediaViewer.
export const DEFAULT_LOADING_VARIANT = 'bars';
export const DEFAULT_LOADING_SIZE = 'medium';

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
export const DEFAULT_PLAYBACK_RATE = 1;

// Paleta por default del reproductor de audio custom (barra clara, acorde al --media-viewer-bg
// claro por default), pisable vía props audioAccentColor/audioControlsColor/audioIconBgColor.
export const DEFAULT_AUDIO_ACCENT = '#2563eb';
export const DEFAULT_AUDIO_CONTROLS_COLOR = '#334155';
export const DEFAULT_AUDIO_ICON_BG = '#eff6ff';

export const DEFAULT_AUDIO_ERROR_LABEL = 'No se pudo cargar el audio';

// Paleta y zoom por default del visor de PDF custom (render a canvas vía pdf.js), pisable vía
// props pdfAccentColor/pdfTextColor/pdfBgColor.
export const DEFAULT_PDF_ACCENT = '#2563eb';
export const DEFAULT_PDF_TEXT_COLOR = '#334155';
export const DEFAULT_PDF_BG_COLOR = '#f1f5f9';
export const DEFAULT_PDF_ERROR_LABEL = 'No se pudo cargar el PDF';

export const DEFAULT_PDF_ZOOM = 1;
export const PDF_MIN_ZOOM = 0.5;
export const PDF_MAX_ZOOM = 2.5;
export const PDF_ZOOM_STEP = 0.25;

// Alto fijo del área scrolleable del visor de PDF (pasado como maxHeight a ScrollBar) — el
// contenido (canvas, que puede ser más alto que esto con zoom) scrollea adentro.
export const PDF_VIEWPORT_HEIGHT = 480;

// Paleta y zoom por default del visor de DOCX custom (render a DOM/CSS vía docx-preview),
// pisable vía props docxAccentColor/docxTextColor/docxBgColor.
export const DEFAULT_DOCX_ACCENT = '#2563eb';
export const DEFAULT_DOCX_TEXT_COLOR = '#334155';
export const DEFAULT_DOCX_BG_COLOR = '#f1f5f9';
export const DEFAULT_DOCX_ERROR_LABEL = 'No se pudo cargar el documento';

export const DEFAULT_DOCX_ZOOM = 1;
export const DOCX_MIN_ZOOM = 0.5;
export const DOCX_MAX_ZOOM = 2;
export const DOCX_ZOOM_STEP = 0.25;

// Alto fijo del área scrolleable del visor de DOCX (pasado como maxHeight a ScrollBar) — el
// documento completo (más alto que esto) scrollea adentro.
export const DOCX_VIEWPORT_HEIGHT = 480;

export const EXTENSION_KIND_MAP = {
  png: MEDIA_KIND.IMAGE,
  jpg: MEDIA_KIND.IMAGE,
  jpeg: MEDIA_KIND.IMAGE,
  gif: MEDIA_KIND.IMAGE,
  webp: MEDIA_KIND.IMAGE,
  svg: MEDIA_KIND.IMAGE,
  avif: MEDIA_KIND.IMAGE,
  bmp: MEDIA_KIND.IMAGE,
  mp4: MEDIA_KIND.VIDEO,
  webm: MEDIA_KIND.VIDEO,
  ogv: MEDIA_KIND.VIDEO,
  mov: MEDIA_KIND.VIDEO,
  mkv: MEDIA_KIND.VIDEO,
  mp3: MEDIA_KIND.AUDIO,
  wav: MEDIA_KIND.AUDIO,
  oga: MEDIA_KIND.AUDIO,
  ogg: MEDIA_KIND.AUDIO,
  m4a: MEDIA_KIND.AUDIO,
  flac: MEDIA_KIND.AUDIO,
  pdf: MEDIA_KIND.PDF,
  docx: MEDIA_KIND.DOCX,
};
