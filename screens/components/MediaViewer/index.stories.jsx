import React from 'react';
import { Download } from 'lucide-react';
import MediaViewer from './index';

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

export const PdfLocal = {
  args: {
    url: '/MediaViewer/documento-de-prueba.pdf',
    name: 'documento-de-prueba.pdf',
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
