import React, { useState } from 'react';
import { VARIANTS, COLORS } from '../Button/index';
import NotificationsPanel from './index.jsx';

export default {
  title: 'Components/NotificationsPanel',
  component: NotificationsPanel,
};

const baseNotifications = [
  {
    id: 1,
    title: 'Nueva cita agendada - Firulais',
    message: 'Se agendó una cita para Firulais el 08/10/2026 a las 15:00 con el Dr. Doctor Doctor.',
    timestamp: 'Hace 5 minutos',
    actions: [
      { key: 'confirm', label: 'Confirmar asistencia', variant: VARIANTS.PRIMARY, onClick: () => console.log('confirmar') },
      { key: 'decline', label: 'No podré asistir', variant: VARIANTS.OUTLINE, color: COLORS.RED, onClick: () => console.log('rechazar') },
    ],
  },
  {
    id: 2,
    title: 'Tu solicitud de cita fue aceptada',
    message: 'La clínica aceptó tu solicitud de cita y se pondrá en contacto para confirmar fecha y hora. Mensaje de la clínica: si podremos atenderte, en un momento la agendo.',
    timestamp: 'Hace 2 horas',
  },
  {
    id: 3,
    title: 'Recordatorio de pago',
    message: 'La factura #00234 vence mañana. Evitá recargos abonando antes de las 23:59.',
    timestamp: 'Ayer',
    actions: [
      { key: 'pay', label: 'Ir a pagar', variant: VARIANTS.PRIMARY, onClick: () => console.log('pagar') },
    ],
  },
];

export const Default = {
  args: {
    notifications: baseNotifications,
  },
};

export const Empty = {
  args: {
    notifications: [],
  },
};

export const Dismissible = {
  render: (args) => {
    const [items, setItems] = useState(baseNotifications);
    return (
      <NotificationsPanel
        {...args}
        notifications={items}
        onDismiss={(id) => setItems((prev) => prev.filter((n) => n.id !== id))}
      />
    );
  },
};

export const ScrollableManyItems = {
  args: {
    notifications: Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `Notificación #${index + 1}`,
      message: 'Este panel scrollea internamente sin mostrar una barra de scroll visible.',
      timestamp: `Hace ${index + 1} horas`,
    })),
    maxHeight: 320,
  },
};

export const LoadingSkeleton = {
  args: {
    notifications: baseNotifications,
    isLoading: true,
    loadingType: 'skeleton',
    skeletonCount: 3,
  },
};

export const LoadingSpinner = {
  args: {
    notifications: baseNotifications,
    isLoading: true,
    loadingType: 'spinner',
    loadingVariant: 'bars',
  },
};

export const Clickable = {
  args: {
    notifications: [
      {
        id: 1,
        title: 'Nueva cita agendada - Firulais',
        message: 'Se agendó una cita para Firulais el 08/10/2026 a las 15:00. Click para ver el detalle completo.',
        timestamp: 'Hace 5 minutos',
        onClick: () => console.log('navegar a detalle de la cita'),
      },
      {
        id: 2,
        title: 'Factura disponible',
        message: 'Tu factura #00234 ya está disponible para descargar.',
        timestamp: 'Ayer',
        href: '#factura-00234',
      },
    ],
  },
};

export const CustomColors = {
  args: {
    bgColor: '#0f172a',
    iconColor: '#38bdf8',
    notifications: [
      {
        id: 1,
        variant: 'danger',
        title: 'Pago rechazado',
        message: 'No se pudo procesar el pago de la factura #00234. Reintentá con otro medio.',
        timestamp: 'Hace 10 minutos',
        actions: [
          { key: 'retry', label: 'Reintentar pago', variant: VARIANTS.PRIMARY, onClick: () => console.log('reintentar') },
        ],
      },
      {
        id: 2,
        title: 'Notificación con colores propios',
        message: 'Esta tarjeta define sus propios bgColor/borderColor/textColor, distintos al resto del panel.',
        timestamp: 'Hace 1 hora',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        textColor: '#065f46',
      },
      {
        id: 3,
        title: 'Notificación con el color por default del panel',
        message: 'Esta usa itemBgColor/itemBorderColor/textColor definidos a nivel de NotificationsPanel.',
        timestamp: 'Ayer',
      },
    ],
    itemBgColor: '#eff6ff',
    itemBorderColor: '#bfdbfe',
    textColor: '#1e3a8a',
  },
};

export const AsModal = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return open ? (
      <NotificationsPanel {...args} isModal onClose={() => setOpen(false)} />
    ) : (
      <button onClick={() => setOpen(true)}>Abrir notificaciones</button>
    );
  },
  args: {
    notifications: baseNotifications,
  },
};
