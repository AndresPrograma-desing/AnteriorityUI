import React from 'react';
import { Home, Flame, Gem } from 'lucide-react';
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

export const WithIcons = {
  args: {
    items: [
      { label: 'MUI', icon: Home, onClick: () => console.log('go home') },
      { label: 'Core', icon: Flame, onClick: () => console.log('go core') },
      { label: 'Breadcrumb', icon: Gem },
    ],
  },
};

export const CustomSeparator = {
  args: {
    separator: '>',
    items: [
      { label: 'Inicio', onClick: () => console.log('go home') },
      { label: 'Pacientes', onClick: () => console.log('go patients') },
      { label: 'Juan Pérez' },
    ],
  },
};

export const CondensedWithMenu = {
  args: {
    maxItems: 3,
    items: [
      { label: 'Breadcrumb 1', onClick: () => console.log('go 1') },
      { label: 'Breadcrumb 2', onClick: () => console.log('go 2') },
      { label: 'Breadcrumb 3', onClick: () => console.log('go 3') },
      { label: 'Breadcrumb 4', onClick: () => console.log('go 4') },
      { label: 'Breadcrumb 5', onClick: () => console.log('go 5') },
      { label: 'Breadcrumb 6' },
    ],
  },
};
