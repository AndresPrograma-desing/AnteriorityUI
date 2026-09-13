import React from 'react';
import PermissionCheckboxItem from './index';

export default {
  title: 'Components/Checks',
  component: PermissionCheckboxItem,
};

export const Unchecked = {
  args: {
    label: 'Ver historial clínico',
    checked: false,
    onChange: () => console.log('toggled'),
  },
};

export const Checked = {
  args: {
    label: 'Editar información de pacientes',
    checked: true,
    onChange: () => console.log('toggled'),
  },
};

export const Disabled = {
  args: {
    label: 'Eliminar registros (bloqueado)',
    checked: false,
    disabled: true,
    onChange: () => console.log('toggled'),
  },
};
