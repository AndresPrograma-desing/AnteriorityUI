import React from 'react';
import MediaViewer from '../index';
import { AudioRecorder } from '../components/index';

// Simula un envío de red: espera un momento y resuelve.
const fakeSend = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
};

// Simula un envío que falla, para ver el mensaje de error y que se conserve la previsualización.
const failingSend = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  throw new Error('Error de red de ejemplo');
};

// AudioRecorder es un sub-componente interno de MediaViewer, así que sus stories viven acá
// (con render propio) en vez de en un archivo aparte.
const renderRecorder = (args) => (
  <div style={{ width: '100%', maxWidth: 420 }}>
    <AudioRecorder {...args} />
  </div>
);

// Simula un servicio de transcripción (ej. Whisper): recibe el audio y devuelve el texto.
const fakeTranscriber = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return 'Texto de ejemplo devuelto por un transcriptor propio.';
};

export default {
  title: 'Components/MediaViewer/Grabador de audio',
  component: MediaViewer,
};

export const GrabadorDeAudio = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
  },
};

export const GrabadorDeAudioConRemitente = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
    senderName: 'Jane Doe',
  },
};

export const GrabadorDeAudioLimiteCorto = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
    maxDurationSeconds: 10,
  },
};

export const GrabadorDeAudioAltaCalidad = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
    audioBitsPerSecond: 128000,
  },
};

export const GrabadorDeAudioConTranscripcionEnVivo = {
  render: renderRecorder,
  args: {
    onSend: async ({ transcript }) => {
      console.log('transcripción enviada:', transcript);
      await fakeSend();
    },
    transcribe: true,
    transcribeLang: 'es-ES',
  },
};

export const GrabadorDeAudioConTranscriptorPropio = {
  render: renderRecorder,
  args: {
    onSend: async ({ transcript }) => {
      console.log('transcripción enviada:', transcript);
      await fakeSend();
    },
    transcriber: fakeTranscriber,
  },
};

export const GrabadorDeAudioSinLimite = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
    maxDurationSeconds: null,
  },
};

export const GrabadorDeAudioEnvioConError = {
  render: renderRecorder,
  args: {
    onSend: failingSend,
  },
};

export const GrabadorDeAudioColoresPersonalizados = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
    bgColor: '#1e1b4b',
    borderColor: '#4338ca',
    textColor: '#e0e7ff',
    accentColor: '#a78bfa',
    recordingColor: '#f472b6',
    iconBgColor: '#312e81',
    errorColor: '#fca5a5',
  },
};

export const GrabadorDeAudioTextosPersonalizados = {
  render: renderRecorder,
  args: {
    onSend: fakeSend,
    recordLabel: 'Mantené para grabar',
    stopLabel: 'Parar',
    discardLabel: 'Borrar',
    sendLabel: 'Mandar',
    sendingLabel: 'Mandando...',
  },
};
