import { RECORDER_MIME_CANDIDATES } from '../../constants.js';

// Hay soporte para grabar: API de micrófono + MediaRecorder disponibles en este navegador.
export function isRecordingSupported() {
  return (
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  );
}

// Primer formato de RECORDER_MIME_CANDIDATES que el navegador sabe grabar (undefined si ninguno,
// en cuyo caso MediaRecorder elige el suyo).
export function pickRecorderMimeType() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  return RECORDER_MIME_CANDIDATES.find((candidate) => MediaRecorder.isTypeSupported(candidate));
}

// Opciones para `new MediaRecorder(stream, options)`. Devuelve undefined si no hay nada que
// pisar, para que MediaRecorder use sus defaults.
export function buildRecorderOptions(mimeType, audioBitsPerSecond) {
  const options = {
    ...(mimeType ? { mimeType } : {}),
    ...(audioBitsPerSecond ? { audioBitsPerSecond } : {}),
  };
  return Object.keys(options).length ? options : undefined;
}

export function extensionForMime(mime = '') {
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('mp4')) return 'm4a';
  return 'webm';
}

export function buildRecordingFileName(mime) {
  return `grabacion-${Date.now()}.${extensionForMime(mime)}`;
}

// Corta todas las pistas del stream para soltar el micrófono.
export function stopStreamTracks(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

// Arma la grabación a partir de los chunks de MediaRecorder. Devuelve null si está vacía.
// La url es un object URL: quien lo reciba debe revocarlo con URL.revokeObjectURL.
export function createClip(chunks, mimeType, startedAtMs) {
  const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
  if (!blob.size) return null;
  return {
    blob,
    url: URL.createObjectURL(blob),
    durationSeconds: (Date.now() - startedAtMs) / 1000,
    mimeType: blob.type,
  };
}

// Constructor de SpeechRecognition del navegador (null si no existe, ej. Firefox).
export function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// Dictado continuo en vivo (Web Speech API). Chrome corta la sesión tras unos segundos de
// silencio aunque `continuous` sea true, así que se reinicia solo mientras la sesión esté activa.
// `onUpdate(texto)` recibe el texto acumulado (finales + provisorio). Devuelve null si el
// navegador no soporta SpeechRecognition. `stop()` devuelve el texto acumulado hasta ese momento
// (puede llegar algún resultado final más después, vía onUpdate); `abort()` descarta todo.
export function createSpeechSession({ lang, onUpdate }) {
  const Recognition = getSpeechRecognition();
  if (!Recognition) return null;

  const recognition = new Recognition();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;

  let finalText = '';
  let interimText = '';
  let active = false;
  let aborted = false;

  const current = () => `${finalText}${interimText}`.trim();

  recognition.onresult = (event) => {
    if (aborted) return;
    interimText = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const text = result[0].transcript;
      if (result.isFinal) finalText += `${text} `;
      else interimText += text;
    }
    onUpdate?.(current());
  };

  recognition.onerror = (event) => {
    // Sin permiso/servicio no tiene sentido reintentar en loop.
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') active = false;
  };

  recognition.onend = () => {
    if (!active) return;
    try {
      recognition.start();
    } catch {
      // ya estaba iniciada
    }
  };

  return {
    start() {
      active = true;
      try {
        recognition.start();
      } catch {
        // ya estaba iniciada
      }
    },
    stop() {
      active = false;
      try {
        recognition.stop();
      } catch {
        // ya estaba detenida
      }
      return current();
    },
    abort() {
      active = false;
      aborted = true;
      try {
        recognition.abort();
      } catch {
        // ya estaba detenida
      }
    },
  };
}
