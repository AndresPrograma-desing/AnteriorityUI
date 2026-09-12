import React from 'react';
import { Settings } from 'lucide-react';
import MenuPopover from './index';

export default {
  title: 'Components/Material-UI/MenuPopover',
  component: MenuPopover,
};

const item = {
  label: 'Opciones',
  icon: Settings,
  subItems: [
    { label: 'Editar' },
    { label: 'Duplicar' },
    { label: 'Eliminar', isDanger: true },
  ],
};

export const Default = {
  args: {
    item,
    renderIcon: (Icon) => (Icon ? <Icon size={18} /> : null),
    onNavigate: (subItem) => console.log('navigate to', subItem),
    isCollapsed: false,
  },
};

export const Collapsed = {
  args: {
    item,
    renderIcon: (Icon) => (Icon ? <Icon size={18} /> : null),
    onNavigate: (subItem) => console.log('navigate to', subItem),
    isCollapsed: true,
  },
};
