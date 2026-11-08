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
