import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, AlertCircle } from 'lucide-react';
import Button from '../../../Button/index';
import AudioPlayer from '../AudioPlayer/index';
import styles from './index.module.css';
import {
  DEFAULT_RECORDER_RECORD_LABEL,
  DEFAULT_RECORDER_STOP_LABEL,
  DEFAULT_RECORDER_DISCARD_LABEL,
  DEFAULT_RECORDER_SEND_LABEL,
  DEFAULT_RECORDER_SENDING_LABEL,
  DEFAULT_RECORDER_PERMISSION_ERROR_LABEL,
  DEFAULT_RECORDER_UNSUPPORTED_LABEL,
  DEFAULT_RECORDER_EMPTY_ERROR_LABEL,
  DEFAULT_RECORDER_SEND_ERROR_LABEL,
  DEFAULT_RECORDER_TRANSCRIBE_LANG,
  DEFAULT_RECORDER_LISTENING_LABEL,
  DEFAULT_RECORDER_TRANSCRIBING_LABEL,
  DEFAULT_RECORDER_TRANSCRIBE_ERROR_LABEL,
  DEFAULT_RECORDER_ACCENT,
  DEFAULT_RECORDER_RECORDING_COLOR,
  DEFAULT_RECORDER_MAX_SECONDS,
  DEFAULT_RECORDER_BITRATE,
  RECORDER_AUDIO_CONSTRAINTS,
  RECORDER_TICK_MS,
} from '../../constants.js';
import { formatTime } from '../../utils.js';
import {
  isRecordingSupported,
  pickRecorderMimeType,
  buildRecorderOptions,
  buildRecordingFileName,
  stopStreamTracks,
  createClip,
  getSpeechRecognition,
  createSpeechSession,
} from './utils.js';

const PHASE = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PREVIEW: 'preview',
  SENDING: 'sending',
};

// Graba audio desde el micrófono (MediaRecorder), muestra el tiempo transcurrido y, al detener,
// deja escuchar la grabación antes de enviarla. Al enviar llama `onSend` con
// `{ file, blob, durationSeconds, mimeType, transcript }`; si `onSend` devuelve una promesa, el
// componente queda en "enviando" hasta que se resuelva, y vuelve a estado inicial al completarse
// (o muestra error y deja la previsualización si falla).
//
// Transcripción (opcional), dos modos:
// - `transcribe`: dictado en vivo con la Web Speech API del navegador (gratis, pero no existe en
//   todos los navegadores y en Chrome el audio pasa por servidores de Google).
// - `transcriber(blob, { lang, mimeType })`: función async propia que devuelve el texto (ej. una
//   llamada a Whisper). Si se pasa, reemplaza al dictado en vivo y corre al detener la grabación.
const AudioRecorder = ({
  onSend,
  onError,
  maxDurationSeconds = DEFAULT_RECORDER_MAX_SECONDS,
  audioBitsPerSecond = DEFAULT_RECORDER_BITRATE,
  transcribe = false,
  transcriber,
  transcribeLang = DEFAULT_RECORDER_TRANSCRIBE_LANG,
  recordLabel = DEFAULT_RECORDER_RECORD_LABEL,
  stopLabel = DEFAULT_RECORDER_STOP_LABEL,
  discardLabel = DEFAULT_RECORDER_DISCARD_LABEL,
  sendLabel = DEFAULT_RECORDER_SEND_LABEL,
  sendingLabel = DEFAULT_RECORDER_SENDING_LABEL,
  listeningLabel = DEFAULT_RECORDER_LISTENING_LABEL,
  transcribingLabel = DEFAULT_RECORDER_TRANSCRIBING_LABEL,
  permissionErrorLabel = DEFAULT_RECORDER_PERMISSION_ERROR_LABEL,
  unsupportedLabel = DEFAULT_RECORDER_UNSUPPORTED_LABEL,
  emptyErrorLabel = DEFAULT_RECORDER_EMPTY_ERROR_LABEL,
  sendErrorLabel = DEFAULT_RECORDER_SEND_ERROR_LABEL,
  transcribeErrorLabel = DEFAULT_RECORDER_TRANSCRIBE_ERROR_LABEL,
  bgColor,
  borderColor,
  textColor,
  errorColor,
  iconBgColor,
  senderName,
  senderAvatar,
  avatarBgColor,
  avatarTextColor,
  transcriptBgColor,
  accentColor = DEFAULT_RECORDER_ACCENT,
  recordingColor = DEFAULT_RECORDER_RECORDING_COLOR,
  className = '',
  style,
}) => {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clip, setClip] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);
  const discardRef = useRef(false);
  const clipRef = useRef(null);
  const speechRef = useRef(null);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const releaseStream = () => {
    stopStreamTracks(streamRef.current);
    streamRef.current = null;
  };

  const releaseClip = () => {
    if (clipRef.current) URL.revokeObjectURL(clipRef.current.url);
    clipRef.current = null;
    setClip(null);
  };

  const abortSpeech = () => {
    speechRef.current?.abort();
    speechRef.current = null;
  };

  const resetTranscript = () => {
    abortSpeech();
    setTranscript('');
    setIsTranscribing(false);
  };

  // Transcripción con función propia: corre sobre el audio ya grabado. Si mientras tanto se
  // descartó o reemplazó la grabación, se ignora el resultado.
  const runTranscriber = (nextClip) => {
    setIsTranscribing(true);
    Promise.resolve(transcriber(nextClip.blob, { lang: transcribeLang, mimeType: nextClip.mimeType }))
      .then((text) => {
        if (clipRef.current === nextClip) setTranscript(String(text || '').trim());
      })
      .catch((err) => {
        if (clipRef.current !== nextClip) return;
        setErrorMsg(transcribeErrorLabel);
        onError?.(err);
      })
      .finally(() => {
        if (clipRef.current === nextClip) setIsTranscribing(false);
      });
  };

  // Se llama cuando MediaRecorder termina (por stop() o por el límite de duración).
  const handleRecorderStop = (mimeType) => {
    const chunks = chunksRef.current;
    chunksRef.current = [];
    stopTimer();
    releaseStream();

    if (discardRef.current) {
      discardRef.current = false;
      resetTranscript();
      setPhase(PHASE.IDLE);
      return;
    }

    const liveText = speechRef.current?.stop();
    if (liveText !== undefined) setTranscript(liveText);

    const nextClip = createClip(chunks, mimeType, startedAtRef.current);
    if (!nextClip) {
      resetTranscript();
      setErrorMsg(emptyErrorLabel);
      setPhase(PHASE.IDLE);
      return;
    }

    clipRef.current = nextClip;
    setClip(nextClip);
    setPhase(PHASE.PREVIEW);
    if (transcriber) runTranscriber(nextClip);
  };

  const stop = () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;
    stopTimer();
    recorder.stop();
  };

  const start = async () => {
    if (phase !== PHASE.IDLE) return;
    setErrorMsg(null);

    if (!isRecordingSupported()) {
      setErrorMsg(unsupportedLabel);
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: RECORDER_AUDIO_CONSTRAINTS });
    } catch (err) {
      setErrorMsg(permissionErrorLabel);
      onError?.(err);
      return;
    }

    streamRef.current = stream;
    try {
      const mimeType = pickRecorderMimeType();
      const recorder = new MediaRecorder(stream, buildRecorderOptions(mimeType, audioBitsPerSecond));
      recorderRef.current = recorder;
      chunksRef.current = [];
      discardRef.current = false;
      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => handleRecorderStop(recorder.mimeType);
      recorder.start();
    } catch (err) {
      releaseStream();
      setErrorMsg(unsupportedLabel);
      onError?.(err);
      return;
    }

    resetTranscript();
    if (transcribe && !transcriber) {
      speechRef.current = createSpeechSession({ lang: transcribeLang, onUpdate: setTranscript });
      speechRef.current?.start();
    }

    startedAtRef.current = Date.now();
    setElapsed(0);
    setPhase(PHASE.RECORDING);
    timerRef.current = setInterval(() => {
      const seconds = (Date.now() - startedAtRef.current) / 1000;
      setElapsed(seconds);
      if (maxDurationSeconds && seconds >= maxDurationSeconds) stop();
    }, RECORDER_TICK_MS);
  };

  const discard = () => {
    if (phase === PHASE.RECORDING) {
      discardRef.current = true;
      stop();
      return;
    }
    releaseClip();
    resetTranscript();
    setErrorMsg(null);
    setPhase(PHASE.IDLE);
  };

  const send = async () => {
    const current = clipRef.current;
    if (!current) return;
    setPhase(PHASE.SENDING);
    setErrorMsg(null);
    try {
      const file = new File([current.blob], buildRecordingFileName(current.mimeType), {
        type: current.mimeType,
      });
      await onSend?.({
        file,
        blob: current.blob,
        durationSeconds: current.durationSeconds,
        mimeType: current.mimeType,
        transcript,
      });
      releaseClip();
      resetTranscript();
      setPhase(PHASE.IDLE);
    } catch (err) {
      setErrorMsg(sendErrorLabel);
      setPhase(PHASE.PREVIEW);
      onError?.(err);
    }
  };

  // Al desmontar: detener la grabación sin procesarla, cortar el micrófono y liberar la URL.
  useEffect(
    () => () => {
      clearInterval(timerRef.current);
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        recorder.stop();
      }
      stopStreamTracks(streamRef.current);
      streamRef.current = null;
      speechRef.current?.abort();
      speechRef.current = null;
      if (clipRef.current) URL.revokeObjectURL(clipRef.current.url);
      clipRef.current = null;
    },
    [],
  );

  const isRecording = phase === PHASE.RECORDING;
  const isSending = phase === PHASE.SENDING;
  const showPreview = (phase === PHASE.PREVIEW || isSending) && clip;

  // Texto del bloque de transcripción: el resultado, o el estado en curso ("Transcribiendo...",
  // "Escuchando..." solo si el navegador realmente soporta dictado en vivo).
  const transcriptionEnabled = Boolean(transcribe || transcriber);
  let transcriptText = transcript;
  if (isTranscribing) transcriptText = transcribingLabel;
  else if (!transcript && isRecording && !transcriber && getSpeechRecognition()) {
    transcriptText = listeningLabel;
  }
  const showTranscript =
    transcriptionEnabled && Boolean(transcriptText) && (isRecording || showPreview);

  const rootStyle = {
    ...(bgColor ? { '--audio-recorder-bg': bgColor } : {}),
    ...(borderColor ? { '--audio-recorder-border': borderColor } : {}),
    ...(textColor ? { '--audio-recorder-text': textColor } : {}),
    ...(errorColor ? { '--audio-recorder-error': errorColor } : {}),
    ...(transcriptBgColor ? { '--audio-recorder-transcript-bg': transcriptBgColor } : {}),
    ...style,
  };

  return (
    <div className={`${styles.recorder} ${className}`} style={rootStyle}>
      {phase === PHASE.IDLE && (
        <div className={styles.row}>
          <Button
            circle
            variant="primary"
            color={accentColor}
            icon={Mic}
            onClick={start}
            aria-label={recordLabel}
          />
          <span className={styles.hint}>{recordLabel}</span>
        </div>
      )}

      {isRecording && (
        <div className={styles.row}>
          <span className={styles.recDot} style={{ backgroundColor: recordingColor }} />
          <span className={styles.timer}>
            {formatTime(elapsed)}
            {maxDurationSeconds ? ` / ${formatTime(maxDurationSeconds)}` : ''}
          </span>
          <div className={styles.actions}>
            <Button variant="ghost" size="small" icon={Trash2} onClick={discard}>
              {discardLabel}
            </Button>
            <Button
              variant="primary"
              size="small"
              icon={Square}
              color={recordingColor}
              onClick={stop}
            >
              {stopLabel}
            </Button>
          </div>
        </div>
      )}

      {showPreview && (
        <AudioPlayer
          src={clip.url}
          accentColor={accentColor}
          controlsColor={textColor}
          iconBgColor={iconBgColor}
          senderName={senderName}
          senderAvatar={senderAvatar}
          avatarBgColor={avatarBgColor}
          avatarTextColor={avatarTextColor}
        />
      )}

      {showTranscript && (
        <div className={styles.transcript} aria-live="polite">
          {transcriptText}
        </div>
      )}

      {showPreview && (
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="small"
            icon={Trash2}
            onClick={discard}
            disabled={isSending}
          >
            {discardLabel}
          </Button>
          <Button
            variant="primary"
            size="small"
            icon={Send}
            color={accentColor}
            onClick={send}
            loading={isSending}
            disabled={isSending || isTranscribing}
          >
            {isSending ? sendingLabel : sendLabel}
          </Button>
        </div>
      )}

      {errorMsg && (
        <div className={styles.errorRow} role="alert">
          <AlertCircle size={16} className={styles.errorIcon} />
          <span className={styles.errorMsg}>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
