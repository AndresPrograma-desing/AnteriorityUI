import { Info } from 'lucide-react';
import InfoTooltip from './index.jsx';

export default {
  title: 'Components/InfoTooltip',
  component: InfoTooltip,
};

export const Default = {
  args: {
    title: '¿Qué es esto?',
    content: 'Este campo se utiliza para identificar de forma única cada registro en el sistema.',
  },
};

export const MultipleParagraphs = {
  args: {
    title: 'Detalles del cálculo',
    content: [
      'El total se calcula sumando todos los conceptos activos.',
      'Los descuentos se aplican antes de los impuestos.',
    ],
  },
};

export const CustomIcon = {
  args: {
    title: 'Información adicional',
    content: 'Puedes personalizar el ícono, tamaño y color del disparador.',
    icon: Info,
    iconSize: 22,
    iconColor: '#3b82f6',
    width: '320px',
  },
};
