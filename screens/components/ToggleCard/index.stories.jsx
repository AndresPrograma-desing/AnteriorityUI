import { Info, Sparkles } from 'lucide-react';
import ToggleCard from './index';

export default {
  title: 'Components/ToggleCard',
  component: ToggleCard,
};

export const Default = {
  args: {
    title: 'Nueva funcionalidad disponible',
    description: 'Ahora puedes **destacar** información importante directamente en el texto.',
    icon: Info,
  },
};

export const Floating = {
  args: {
    title: 'Sugerencia inteligente',
    description: 'Este mensaje aparece flotando sobre el contenido principal.',
    icon: Sparkles,
    variant: 'floating',
  },
};

export const Closable = {
  args: {
    title: 'Aviso importante',
    description: 'Puedes cerrar este mensaje cuando quieras.',
    icon: Info,
    onClose: () => console.log('closed'),
    closeText: 'Cerrar',
  },
};

export const WithActionAndCustomColors = {
  args: {
    title: 'Acción requerida',
    description: 'Revisa los cambios pendientes antes de continuar.',
    icon: Info,
    action: <button type="button" onClick={() => console.log('action clicked')}>Revisar</button>,
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    titleColor: '#92400e',
    descriptionColor: '#78350f',
    iconColor: '#b45309',
    onClick: () => console.log('card clicked'),
  },
};
