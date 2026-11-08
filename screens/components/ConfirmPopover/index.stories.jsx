import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import ConfirmPopover from './index';

export default {
  title: 'Components/ConfirmPopover',
  component: ConfirmPopover,
};

// Caja de referencia para ver el popover anclado en una posición real.
const Stage = ({ children }) => (
  <div style={{ position: 'relative', height: 260, width: 420, border: '1px dashed #cbd5e1', padding: 16 }}>
    {children}
  </div>
);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DangerTemplate = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <Stage>
      <button type="button" onClick={() => setOpen(true)}>Abrir</button>
      <ConfirmPopover
        {...args}
        open={open}
        position={{ top: 60, left: 40 }}
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await wait(1500);
          setOpen(false);
        }}
      />
    </Stage>
  );
};

export const Danger = {
  render: (args) => <DangerTemplate {...args} />,
  args: {
    danger: true,
    title: '¿Eliminar este elemento?',
    message: 'Se eliminará junto con su contenido. Esta acción **no se puede deshacer**.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
  },
};

// El markdown se renderiza en título y mensaje: negritas, listas y links.
export const MarkdownMessage = {
  render: (args) => <DangerTemplate {...args} />,
  args: {
    title: '**Salir** de *Proyecto-API*',
    message: [
      'Vas a perder acceso a:',
      '',
      '- Tableros compartidos',
      '- Comentarios pendientes',
      '',
      'Más info en [la guía](https://example.com).',
    ].join('\n'),
    confirmText: 'Salir',
    cancelText: 'Volver',
  },
};

// Props de Button expuestas por el popover: iconos y tamaño directos, y el resto por
// `confirmButtonProps` / `cancelButtonProps` (ej. tooltip, fullWidth). `onClick` y `loading`
// siguen controlados por el popover.
export const WithButtonProps = {
  render: (args) => <DangerTemplate {...args} />,
  args: {
    danger: true,
    title: 'Eliminar comentario',
    message: 'No se puede recuperar después.',
    confirmText: 'Eliminar',
    cancelText: 'Volver',
    confirmIcon: Trash2,
    cancelIcon: X,
    buttonSize: 'medium',
    confirmButtonProps: { fullWidth: true },
  },
};

export const CustomColors = {
  render: (args) => <DangerTemplate {...args} />,
  args: {
    title: 'Publicar cambios',
    message: 'Se notificará a todo el equipo.',
    confirmText: 'Publicar',
    bgColor: '#0f172a',
    borderColor: '#334155',
    titleColor: '#f8fafc',
    textColor: '#94a3b8',
    confirmBgColor: '#16a34a',
    confirmTextColor: '#ffffff',
  },
};
