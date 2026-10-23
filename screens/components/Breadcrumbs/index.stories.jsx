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

// Simula un trail largo con varios íconos en un contenedor angosto (ej. TopBar
// en mobile, < 320px disponibles para el breadcrumb): el trail debe truncar en
// una sola línea con ellipsis en vez de envolver a una segunda línea o
// solaparse con elementos vecinos (logo, botón hamburguesa, etc.).
export const NarrowContainer = {
  render: (args) => (
    <div style={{ width: 220, border: '1px dashed #cbd5e1', padding: 8 }}>
      <Breadcrumbs {...args} />
    </div>
  ),
  args: {
    items: [
      { label: 'ContextHub', icon: Home, onClick: () => console.log('go home') },
      { label: 'Context Finance', icon: Gem, onClick: () => console.log('go finance') },
      { label: 'Plan de Ahorro (2)' },
    ],
  },
};

// Crumbs cuyo label no entra ni truncado: en vez de quedar cortado sin forma
// de leerlo, al pasar el mouse aparece un ModalTooltip con el texto completo.
// Pasa un crumb clicable largo y el crumb actual (más largo típicamente, como
// un título de sesión) para ejercitar ambos casos.
export const TruncatedWithTooltip = {
  render: (args) => (
    <div style={{ width: 320, border: '1px dashed #cbd5e1', padding: 8, background: '#13161c' }}>
      <Breadcrumbs {...args} />
    </div>
  ),
  args: {
    items: [
      { label: 'ContextHub', icon: Home, onClick: () => console.log('go home') },
      { label: 'Gubernamentales-API / Sesiones', icon: Gem, onClick: () => console.log('go sessions') },
      { label: '# Fix propuesto: memoización de `available_amount` para evitar recálculo en cada render de la tabla de compensación' },
    ],
  },
};
