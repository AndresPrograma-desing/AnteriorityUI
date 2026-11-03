export const MEDIA_KIND = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  PDF: 'pdf',
  DOCX: 'docx',
  MARKDOWN: 'markdown',
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

// Grabador de audio (AudioRecorder): labels, límite de duración y colores de acento/grabación
// por default, pisables vía props accentColor/recordingColor. El resto de los colores vive en el
// CSS module (con fallback = valor original) y se pisa vía bgColor/borderColor/textColor.
export const DEFAULT_RECORDER_RECORD_LABEL = 'Grabar audio';
export const DEFAULT_RECORDER_STOP_LABEL = 'Detener';
export const DEFAULT_RECORDER_DISCARD_LABEL = 'Descartar';
export const DEFAULT_RECORDER_SEND_LABEL = 'Enviar';
export const DEFAULT_RECORDER_SENDING_LABEL = 'Enviando...';
export const DEFAULT_RECORDER_PERMISSION_ERROR_LABEL = 'No se pudo acceder al micrófono';
export const DEFAULT_RECORDER_UNSUPPORTED_LABEL = 'Este navegador no permite grabar audio';
export const DEFAULT_RECORDER_EMPTY_ERROR_LABEL = 'La grabación está vacía';
export const DEFAULT_RECORDER_SEND_ERROR_LABEL = 'No se pudo enviar el audio. Intentar de nuevo';
export const DEFAULT_RECORDER_ACCENT = '#2563eb';
export const DEFAULT_RECORDER_RECORDING_COLOR = '#ef4444';

// Duración máxima por default de una grabación (segundos). Pasar 0 o null para no limitar.
export const DEFAULT_RECORDER_MAX_SECONDS = 300;
export const RECORDER_TICK_MS = 250;

// Bitrate por default de la grabación (bits/seg). 32 kbps en Opus mono suena bien para voz y
// pesa ~240 KB/min (vs ~1 MB/min con el default del navegador). Pasar 0 o null para dejar el
// default del navegador, o un valor más alto (ej. 128000) para música/mayor fidelidad.
export const DEFAULT_RECORDER_BITRATE = 32000;

// Constraints del micrófono: mono (la voz no necesita estéreo, ahorra ~la mitad del peso) y
// procesamiento de voz del navegador para una grabación más limpia.
export const RECORDER_AUDIO_CONSTRAINTS = {
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
};

// Formatos preferidos, en orden. Se usa el primero que el navegador soporte.
export const RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
];

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

// Resolución de render del canvas del visor de PDF respecto del tamaño CSS en que se muestra: se
// dibuja a max(devicePixelRatio, PDF_MIN_OUTPUT_SCALE) para que el texto salga nítido (en pantallas
// con escala 125%/150%/retina, o con 1x se supersamplea y el browser reduce suavizado), con tope en
// PDF_MAX_OUTPUT_SCALE y en PDF_MAX_CANVAS_PIXELS (iOS Safari falla con canvas de más de ~16M px).
export const PDF_MIN_OUTPUT_SCALE = 2;
export const PDF_MAX_OUTPUT_SCALE = 3;
export const PDF_MAX_CANVAS_PIXELS = 16_000_000;

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

// Paleta por default del visor de Markdown custom (renderiza con MarkdownContent), pisable vía
// props markdownAccentColor/markdownTextColor/markdownBgColor. El acento se usa para el loading y
// para el color de los links del markdown.
export const DEFAULT_MARKDOWN_ACCENT = '#2563eb';
export const DEFAULT_MARKDOWN_TEXT_COLOR = '#334155';
export const DEFAULT_MARKDOWN_BG_COLOR = '#ffffff';
export const DEFAULT_MARKDOWN_ERROR_LABEL = 'No se pudo cargar el documento Markdown';

// Alto fijo del área scrolleable del visor de Markdown (pasado como maxHeight a ScrollBar) — el
// documento completo (más alto que esto) scrollea adentro.
export const MARKDOWN_VIEWPORT_HEIGHT = 480;

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
  md: MEDIA_KIND.MARKDOWN,
  markdown: MEDIA_KIND.MARKDOWN,
};

// Transcripción del AudioRecorder: idioma del dictado en vivo (Web Speech API, pisable vía
// transcribeLang) y labels del bloque de texto.
export const DEFAULT_RECORDER_TRANSCRIBE_LANG = 'es-ES';
export const DEFAULT_RECORDER_LISTENING_LABEL = 'Escuchando...';
export const DEFAULT_RECORDER_TRANSCRIBING_LABEL = 'Transcribiendo...';
export const DEFAULT_RECORDER_TRANSCRIBE_ERROR_LABEL = 'No se pudo transcribir el audio';
