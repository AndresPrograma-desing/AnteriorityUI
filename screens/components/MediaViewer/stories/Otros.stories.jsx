import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Otros tipos',
  component: MediaViewer,
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
