import React from 'react';
import MediaViewer from '../index';

export default {
  title: 'Components/MediaViewer/Word (DOCX)',
  component: MediaViewer,
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
