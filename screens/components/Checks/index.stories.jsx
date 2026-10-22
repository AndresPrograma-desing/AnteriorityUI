import React, { useState } from 'react';
import PermissionCheckboxItem from './index';

export default {
  title: 'Components/Checks',
  component: PermissionCheckboxItem,
  argTypes: {
    iconOnly: {
      control: 'boolean',
      description: 'Si es true, elimina los paddings internos y muestra únicamente el recuadro del check',
    },
  },
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

/* Story para probar la nueva prop iconOnly */
export const IconOnly = {
  args: {
    label: 'Marcar como completado', // Se muestra como tooltip al pasar el cursor
    checked: true,
    iconOnly: true,
    onChange: () => console.log('toggled iconOnly'),
  },
};

/* Ejemplo interactivo en una tabla/listado ajustado */
export const IconOnlyInTable = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '6px', width: 'fit-content' }}>
      <PermissionCheckboxItem
        checked={checked}
        iconOnly
        label="Seleccionar fila"
        onChange={() => setChecked(!checked)}
      />
      <span style={{ fontSize: '0.88rem', color: '#334155' }}>Fila de tabla o elemento compacto</span>
    </div>
  );
};