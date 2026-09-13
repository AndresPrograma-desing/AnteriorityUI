import { Info } from 'lucide-react';
import Frame from './Index.jsx';

export default {
  title: 'Components/Frame',
  component: Frame,
};

export const Default = {
  args: {
    title: 'Información general',
    content: 'Este es un panel de contenido simple con título y descripción.',
  },
};

export const WithIconAndChildren = {
  args: {
    title: 'Detalles',
    icon: <Info size={20} />,
    children: <p style={{ margin: 0 }}>Contenido personalizado dentro del marco.</p>,
  },
};

export const WithError = {
  args: {
    title: 'Error al cargar',
    error: 'No se pudo obtener la información solicitada.',
  },
};

export const Loading = {
  args: {
    title: 'Cargando datos',
    isLoading: true,
    children: <p style={{ margin: 0 }}>Este contenido queda oculto mientras carga.</p>,
  },
};
