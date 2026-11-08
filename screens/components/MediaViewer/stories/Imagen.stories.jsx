import React from 'react';
import { Download } from 'lucide-react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Imagen',
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
