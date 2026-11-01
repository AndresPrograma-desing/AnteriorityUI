import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Toast from './index';
import Button from '../Button/index';

export default {
  title: 'Components/Toast',
  component: Toast,
};

// Dispara notificaciones desde un botón y las apila en la esquina, como en una app real.
const ToastDemo = (args) => {
  const [toasts, setToasts] = useState([]);
  const [count, setCount] = useState(0);

  const trigger = () => {
    setCount((c) => c + 1);
    setToasts((prev) => [...prev, { ...args, id: `${Date.now()}-${count}` }]);
  };

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <Button variant="primary" onClick={trigger}>
        Disparar notificación
      </Button>

      <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={remove} />
        ))}
      </div>
    </div>
  );
};

export const Success = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'success',
    title: '¡Operación exitosa!',
    message: 'Los cambios se han guardado correctamente en la base de datos.',
    duration: 4000,
  },
};

export const ErrorToast = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'error',
    title: 'Error de conexión',
    message: 'No se pudo establecer comunicación con el servidor central.',
    duration: 5000,
  },
};

export const Info = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'info',
    title: 'Aviso importante',
    message: 'Hay una nueva actualización disponible para descargar.',
    duration: 4000,
  },
};

export const Warning = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'warning',
    title: 'Espacio bajo',
    message: 'Te quedan menos de 500 MB disponibles en tu cuenta.',
    duration: 6000,
  },
};

export const WithAction = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'info',
    title: 'Mensaje eliminado',
    message: 'La conversación se movió a la papelera.',
    action: { label: 'Deshacer', onClick: () => {} },
    duration: 6000,
  },
};

export const Sticky = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'warning',
    title: 'Sesión por expirar',
    message: 'Esta notificación no se cierra sola: usá la ✕ para descartarla.',
    duration: 0,
  },
};

export const NotClosable = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'info',
    title: 'Sincronizando',
    message: 'No se puede cerrar hasta que termine.',
    closable: false,
    duration: 3000,
  },
};

export const CustomIcon = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'success',
    title: 'Proceso sincronizado',
    message: 'Se usó un ícono personalizado de lucide-react.',
    icon: Sparkles,
    duration: 4000,
  },
};

export const CustomColors = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    type: 'info',
    title: 'Paleta personalizada',
    message: 'Los colores salen de las props bgColor, textColor, mutedColor, accentColor, iconColor y borderColor.',
    bgColor: '#1e1b4b',
    textColor: '#f5f3ff',
    mutedColor: '#c4b5fd',
    accentColor: '#a78bfa',
    iconColor: '#e9d5ff',
    borderColor: '#4c1d95',
    hoverColor: 'rgba(255, 255, 255, 0.08)',
    duration: 5000,
  },
};
