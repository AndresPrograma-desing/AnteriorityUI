import { Bell, Shield, User } from 'lucide-react';
import DesplegablePanel from './index.jsx';

export default {
  title: 'Components/DesplegablePanel',
  component: DesplegablePanel,
};

export const Default = {
  args: {
    title: 'Notificaciones',
    description: 'Administra cómo recibes las alertas del sistema',
    icon: Bell,
    isOpen: false,
    onToggle: () => console.log('toggled'),
  },
};

export const OpenWithContent = {
  args: {
    title: 'Seguridad',
    description: 'Configura las opciones de seguridad de tu cuenta',
    icon: Shield,
    iconColorVariant: 'green',
    isOpen: true,
    onToggle: () => console.log('toggled'),
    children: (
      <p style={{ margin: 0 }}>
        Aquí puedes activar la autenticación en dos pasos y revisar tus sesiones activas.
      </p>
    ),
  },
};

export const WithCustomAction = {
  args: {
    title: 'Perfil',
    description: 'Información pública de tu cuenta',
    icon: User,
    isOpen: false,
    action: <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Editar</span>,
    onToggle: () => console.log('toggled'),
  },
};
