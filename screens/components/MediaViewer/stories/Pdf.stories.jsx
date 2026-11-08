import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/PDF',
  component: MediaViewer,
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

// URL remota de ejemplo (PDF público de pdf.js). Para probar contra un bucket propio con URL
// firmada, pegar la URL en el control `url` del panel Controls de Storybook.
export const PdfUrlRemota = {
  args: {
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    name: 'documento-remoto.pdf',
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
