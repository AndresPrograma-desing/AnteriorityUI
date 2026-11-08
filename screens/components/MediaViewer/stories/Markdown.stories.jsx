import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Markdown',
  component: MediaViewer,
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
