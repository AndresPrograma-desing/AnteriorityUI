import { Info } from 'lucide-react';
import Frame from './index.jsx';

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
    loadingType: 'spinner',
    children: <p style={{ margin: 0 }}>Este contenido queda oculto mientras carga.</p>,
  },
};

export const LoadingSpinnerVariant = {
  args: {
    title: 'Cargando datos',
    isLoading: true,
    loadingType: 'spinner',
    loadingVariant: 'bars',
    children: <p style={{ margin: 0 }}>Este contenido queda oculto mientras carga.</p>,
  },
};

export const LoadingSkeleton = {
  args: {
    title: 'Cargando datos',
    isLoading: true,
    loadingType: 'skeleton',
    skeletonCount: 4,
    children: <p style={{ margin: 0 }}>Este contenido queda oculto mientras carga.</p>,
  },
};

export const Scrollable = {
  args: {
    title: 'Lista larga',
    scrollable: true,
    maxHeight: 220,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i} style={{ margin: 0, padding: '0.5rem', background: '#f1f5f9', borderRadius: 6 }}>
            Item #{i + 1}
          </p>
        ))}
      </div>
    ),
  },
};
