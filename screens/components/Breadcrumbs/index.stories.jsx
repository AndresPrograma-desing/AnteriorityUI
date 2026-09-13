import React from 'react';
import { Breadcrumbs } from './index';

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
};

export const Default = {
  args: {
    items: [
      { label: 'Inicio', onClick: () => console.log('go home') },
      { label: 'Pacientes', onClick: () => console.log('go patients') },
      { label: 'Juan Pérez' },
    ],
  },
};

export const TwoLevels = {
  args: {
    items: [
      { label: 'Inicio', onClick: () => console.log('go home') },
      { label: 'Configuración' },
    ],
  },
};

export const DeepPath = {
  args: {
    items: [
      { label: 'Inicio', onClick: () => console.log('go home') },
      { label: 'Sesiones', onClick: () => console.log('go sessions') },
      { label: '2024-05-10', onClick: () => console.log('go date') },
      { label: 'Detalle' },
    ],
  },
};
