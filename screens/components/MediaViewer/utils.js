import { MEDIA_KIND, EXTENSION_KIND_MAP } from './constants.js';
import { getExtension } from '../../../common/icons/fileType.js';

// Interpreta un mimeType real (`'image/png'`, `'application/pdf'`, etc.) o un valor ya
// resuelto de MEDIA_KIND. Devuelve null si no matchea nada reconocido.
export function mimeToKind(mime) {
  if (!mime) return null;
  if (mime.startsWith('image/')) return MEDIA_KIND.IMAGE;
  if (mime.startsWith('video/')) return MEDIA_KIND.VIDEO;
  if (mime.startsWith('audio/')) return MEDIA_KIND.AUDIO;
  if (mime === 'application/pdf') return MEDIA_KIND.PDF;
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return MEDIA_KIND.DOCX;
  if (Object.values(MEDIA_KIND).includes(mime)) return mime;
  return null;
}

export function resolveMediaKind({ type, mimeType, url, name }) {
  const fromMime = mimeToKind(mimeType || type);
  if (fromMime) return fromMime;

  const extension = getExtension(name || url);
  return EXTENSION_KIND_MAP[extension] || MEDIA_KIND.FILE;
}

export function getFileName(url, name) {
  if (name) return name;
  if (!url) return '';
  const clean = url.split('?')[0].split('#')[0];
  const segments = clean.split('/');
  return segments[segments.length - 1] || '';
}

export function formatTime(seconds) {
  if (seconds == null || !Number.isFinite(seconds)) return '0:00';
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const paddedSecs = String(secs).padStart(2, '0');
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${paddedSecs}`;
  return `${mins}:${paddedSecs}`;
}

export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
