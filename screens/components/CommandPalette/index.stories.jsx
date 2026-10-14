import React, { useState } from 'react';
import { Folder, FileText, User } from 'lucide-react';
import CommandPalette from './index.jsx';

export default {
  title: 'Components/CommandPalette',
  component: CommandPalette,
};

const items = [
  { id: 's1', label: 'Gubernamentales-API', category: 'Sesiones', icon: Folder, onSelect: () => console.log('Gubernamentales-API') },
  { id: 's2', label: 'Proyecto', category: 'Sesiones', icon: Folder, onSelect: () => console.log('Proyecto') },
  { id: 'p1', label: 'EDENOR', category: 'Proyectos', icon: Folder, onSelect: () => console.log('EDENOR') },
  { id: 'p2', label: 'reunir', category: 'Proyectos', icon: Folder, onSelect: () => console.log('reunir') },
  { id: 'p3', label: 'PROYECTO', category: 'Proyectos', icon: Folder, onSelect: () => console.log('PROYECTO') },
  { id: 'p4', label: 'Kortech-Camuzzi', category: 'Proyectos', icon: Folder, onSelect: () => console.log('Kortech-Camuzzi') },
  { id: 'd1', label: 'Informe mensual.pdf', category: 'Documentos', icon: FileText, description: 'Modificado hoy', onSelect: () => console.log('doc') },
  { id: 'u1', label: 'Jane Doe', category: 'Usuarios', icon: User, description: 'jane.doe@example.com', onSelect: () => console.log('user') },
];

const OpenablePalette = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>Abrir (o Ctrl+K no aplica en esta story)</button>
      <CommandPalette {...args} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export const Default = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
  },
};

export const WithQueryFilter = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
    query: 'e',
  },
};

export const Empty = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items: [],
  },
};

export const CustomColors = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
    bgColor: '#ffffff',
    textColor: '#0f172a',
    borderColor: '#e2e8f0',
    iconColor: '#64748b',
    accentColor: '#2563eb',
    categoryColor: '#94a3b8',
  },
};

export const LoadingSpinner = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
    isLoading: true,
  },
};

export const LoadingSkeleton = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
    isLoading: true,
    loadingType: 'skeleton',
    skeletonCount: 5,
  },
};

// Por defecto lo que se escribió queda en el input al cerrar y reabrir la
// paleta (`clearQueryOnClose: false`, el default). Escribí algo, cerrá con
// Escape y volvé a abrir con el botón: el texto sigue ahí.
export const QueryPersistsByDefault = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
  },
};

// `clearQueryOnClose: true` resetea el input cada vez que la paleta se
// cierra, para quien prefiera que cada apertura empiece en blanco.
export const ClearsQueryOnClose = {
  render: (args) => <OpenablePalette {...args} />,
  args: {
    items,
    clearQueryOnClose: true,
  },
};
