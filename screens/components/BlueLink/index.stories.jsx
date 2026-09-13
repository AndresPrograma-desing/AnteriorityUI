import React from 'react';
import BlueLink from './Index';

export default {
  title: 'Components/BlueLink',
  component: BlueLink,
};

export const ExternalUrl = {
  args: {
    label: 'Visitar sitio web',
    url: 'https://example.com',
  },
};

export const InternalNavigation = {
  args: {
    label: 'Ir al perfil',
    url: '/profile/123',
    navigate: (path) => console.log('navigate to', path),
  },
};

export const LongLabel = {
  args: {
    label: 'Ver documento adjunto completo',
    url: 'https://example.com/documento.pdf',
  },
};
