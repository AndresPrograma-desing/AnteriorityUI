import React from 'react';
import Text from './index';

export default {
  title: 'Components/Text',
  component: Text,
};

export const Heading1 = {
  args: {
    variant: 'h1',
    children: 'Título principal',
  },
};

export const Heading2 = {
  args: {
    variant: 'h2',
    children: 'Título secundario',
  },
};

export const Heading3 = {
  args: {
    variant: 'h3',
    children: 'Subtítulo',
  },
};

export const Body = {
  args: {
    variant: 'body',
    children: 'Texto de párrafo normal, para contenido dentro de un Container o Frame.',
  },
};

export const Caption = {
  args: {
    variant: 'caption',
    children: 'Texto pequeño, para notas o descripciones secundarias.',
  },
};

export const CustomColorAndAlign = {
  args: {
    variant: 'h2',
    children: 'Título centrado en color personalizado',
    color: '#2563eb',
    align: 'center',
  },
};
