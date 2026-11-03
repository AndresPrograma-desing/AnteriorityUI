import React from 'react';
import { Download } from 'lucide-react';
import MediaViewer from './index';
import { AudioRecorder } from './components/index.js';

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

export default {
  title: 'Components/MediaViewer',
  component: MediaViewer,
};

export const Imagen = {
  args: {
    url: 'https://picsum.photos/seed/anteriority/640/360',
    alt: 'Foto de ejemplo',
  },
};

export const ImagenSinZoom = {
  args: {
    url: 'https://picsum.photos/seed/sin-zoom/640/360',
    zoomable: false,
  },
};

export const ImagenVertical = {
  args: {
    url: 'https://picsum.photos/seed/retrato/480/854',
    alt: 'Foto en formato retrato',
  },
};

export const ImagenEnContenedorAngosto = {
  args: {
    url: 'https://picsum.photos/seed/retrato-angosto/480/854',
    alt: 'Foto en formato retrato dentro de un contenedor angosto',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const ImagenConBotonDeAccion = {
  args: {
    url: 'https://picsum.photos/seed/accion/480/854',
    alt: 'Foto con botón de acción debajo del marco',
    actionLabel: 'Descargar',
    actionIcon: Download,
    onAction: () => console.log('acción ejecutada'),
  },
};

export const Video = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-poster/640/360',
  },
};

export const VideoColoresPersonalizados = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-poster-custom/640/360',
    videoBgColor: '#1a0f2e',
    videoAccentColor: '#a855f7',
    videoControlsColor: '#f3e8ff',
  },
};

export const VideoSinPiP = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-no-pip/640/360',
    videoPip: false,
  },
};

export const VideoLargo = {
  args: {
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  },
};

export const VideoControlesNativos = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://picsum.photos/seed/video-native/640/360',
    controls: false,
  },
};

export const Audio = {
  args: {
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    name: 'rugido-trex.mp3',
  },
};

export const AudioLargo = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
  },
};

// Con `senderName` (y/o `senderAvatar`) la insignia de música se reemplaza por el Avatar de la
// librería, para identificar quién envió el audio: iniciales con color generado del nombre...
export const AudioConRemitente = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    senderName: 'Ignacio Angel',
  },
};

// ...o la foto del remitente (si la imagen no carga, cae a las iniciales).
export const AudioConRemitenteYFoto = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    senderName: 'Ignacio Angel',
    senderAvatar: 'https://picsum.photos/seed/remitente/80/80',
  },
};

export const AudioColoresPersonalizados = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    bgColor: '#fdf4ff',
    borderColor: '#f3e8ff',
    audioAccentColor: '#a855f7',
    audioControlsColor: '#581c87',
    audioIconBgColor: '#f3e8ff',
  },
};

export const AudioControlesNativos = {
  args: {
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    name: 'Kalimba.mp3',
    controls: false,
  },
};

export const Pdf = {
  args: {
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    name: 'documento.pdf',
  },
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
    senderName: 'Ignacio Angel',
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

// Simula un servicio de transcripción (ej. Whisper): recibe el audio y devuelve el texto.
const fakeTranscriber = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return 'Texto de ejemplo devuelto por un transcriptor propio.';
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

export const PdfLocal = {
  args: {
    url: '/MediaViewer/documento-de-prueba.pdf',
    name: 'documento-de-prueba.pdf',
  },
};

// Prueba real contra una URL firmada de Backblaze B2 (requiere CORS configurado en el bucket).
// La URL vence a los 5 minutos de generada (X-Amz-Expires=300): para volver a probar, pegar una
// URL firmada nueva en el control `url` del panel Controls de Storybook.
export const PdfUrlFirmadaBackblaze = {
  args: {
    url: 'https://s3.us-east-005.backblazeb2.com/contexthub/ffe30a88-02f6-41fe-88f1-67b2f294a243/0b86f5a2-ff73-4bb0-8d32-d05b1ca7c33b-SIGECOIM_Estructura_Proyecto.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=005f2a062682d2d0000000002%2F20261102%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20261102T162624Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22SIGECOIM_Estructura_Proyecto.pdf%22&X-Amz-Signature=755e8f705af315a9d713b70c6e6d794ed277466f3602782f5f9a430ee389aec8',
    name: 'SIGECOIM_Estructura_Proyecto.pdf',
    type: 'pdf',
  },
};

export const PdfMultiPagina = {
  args: {
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    name: 'multi-pagina.pdf',
  },
};

export const PdfColoresPersonalizados = {
  args: {
    url: '/MediaViewer/documento-de-prueba.pdf',
    name: 'documento-de-prueba.pdf',
    pdfAccentColor: '#7c3aed',
    pdfTextColor: '#4c1d95',
    pdfBgColor: '#f5f3ff',
  },
};

export const PdfIframeNativo = {
  args: {
    url: '/MediaViewer/documento-de-prueba.pdf',
    name: 'documento-de-prueba.pdf',
    controls: false,
  },
};

export const Docx = {
  args: {
    url: 'https://raw.githubusercontent.com/VolodymyrBaydalka/docxjs/master/tests/render-test/table/document.docx',
    name: 'documento.docx',
  },
};

export const DocxColoresPersonalizados = {
  args: {
    url: 'https://raw.githubusercontent.com/VolodymyrBaydalka/docxjs/master/tests/render-test/table/document.docx',
    name: 'documento.docx',
    docxAccentColor: '#0f766e',
    docxTextColor: '#134e4a',
    docxBgColor: '#f0fdfa',
  },
};

export const Markdown = {
  args: {
    url: '/MediaViewer/documento-de-prueba.md',
    name: 'documento-de-prueba.md',
  },
};

export const MarkdownRemoto = {
  args: {
    url: 'https://raw.githubusercontent.com/adam-p/markdown-here/master/README.md',
    name: 'README.md',
  },
};

export const MarkdownColoresPersonalizados = {
  args: {
    url: '/MediaViewer/documento-de-prueba.md',
    name: 'documento-de-prueba.md',
    markdownAccentColor: '#7c3aed',
    markdownTextColor: '#4c1d95',
    markdownBgColor: '#f5f3ff',
  },
};

export const MarkdownTarjetaNativa = {
  args: {
    url: '/MediaViewer/documento-de-prueba.md',
    name: 'documento-de-prueba.md',
    size: 1024,
    controls: false,
  },
};

export const ArchivoGenericoZip = {
  args: {
    url: '#',
    name: 'backup-proyecto.zip',
    size: 2_400_000,
  },
};

export const ArchivoGenericoDesconocido = {
  args: {
    url: '#',
    name: 'notas.xyz',
    size: 1024,
  },
};

export const TipoForzado = {
  args: {
    url: 'https://picsum.photos/seed/forced-type/480/270',
    type: 'image',
  },
};

export const ColoresPersonalizados = {
  args: {
    url: '#',
    name: 'contrato.docx',
    size: 512_000,
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    textColor: '#4c1d95',
    accentColor: '#7c3aed',
  },
};
