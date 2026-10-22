import { useEffect, useState } from 'react';
import Loading from './index';
import Button from '../Button/index';

export default {
  title: 'Components/Loading',
  component: Loading,
};

export const Default = {
  args: {
    text: 'Cargando...',
    size: 'medium',
    variant: 'default',
  },
};

export const WithRotatingPhrases = {
  args: {
    phrases: ['Cargando datos...', 'Procesando información...', 'Casi listo...'],
    size: 'medium',
    variant: 'default',
  },
};

export const BarsVariant = {
  args: {
    text: 'Un momento...',
    size: 'large',
    variant: 'bars',
  },
};

export const BounceVariantSmall = {
  args: {
    text: 'Cargando',
    size: 'small',
    variant: 'bounce',
  },
};

export const SkeletonVariant = {
  args: {
    variant: 'skeleton',
  },
};

export const BounceBarVariant = {
  args: {
    text: 'Subiendo archivo...',
    variant: 'bounce-bar',
  },
};

export const ContinuousBarVariant = {
  args: {
    text: 'Procesando...',
    variant: 'continuous-bar',
  },
};

export const NeonScannerVariant = {
  args: {
    text: 'Cargando',
    variant: 'neon-scanner',
  },
};

export const LiquidPulseVariant = {
  args: {
    text: 'Un momento...',
    variant: 'liquid-pulse',
  },
};

export const Orbit3DVariant = {
  args: {
    text: 'Sincronizando...',
    variant: 'orbit-3d',
  },
};

export const WaveformVariant = {
  args: {
    text: 'Escuchando...',
    variant: 'waveform',
  },
};

export const DnaHelixVariant = {
  args: {
    text: 'Analizando...',
    variant: 'dna-helix',
  },
};

export const RocketVariant = {
  args: {
    text: 'Desplegando...',
    size: 'giant',
    variant: 'rocket',
  },
};

export const RocketCustomColor = {
  args: {
    text: 'Desplegando...',
    size: 'giant',
    variant: 'rocket',
    color: '#ec4899',
  },
};

export const Cube3DVariant = {
  args: {
    text: 'Renderizando...',
    size: 'giant',
    variant: 'cube-3d',
  },
};

export const Prism3DVariant = {
  args: {
    text: 'Verificando...',
    size: 'giant',
    variant: 'prism-3d',
  },
};

export const Text3DVariant = {
  args: {
    text: 'AnteriorityUI',
    size: 'giant',
    variant: 'text-3d',
  },
};

export const Text3DWithWord = {
  args: {
    text: 'AnteriorityUI',
    size: 'giant',
    variant: 'text-3d',
    color: '#a855f7',
  },
};

export const Text3DStaticVariant = {
  args: {
    text: 'AnteriorityUI',
    size: 'giant',
    variant: 'text-3d-static',
  },
};

const ExitAnimationDemo = (args) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setActive((prev) => !prev), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <Loading {...args} active={active} />
      <Button onClick={() => setActive((prev) => !prev)}>
        {active ? 'Terminar carga' : 'Volver a cargar'}
      </Button>
    </div>
  );
};

export const ExitAnimationText3D = {
  render: (args) => <ExitAnimationDemo {...args} />,
  args: {
    text: 'AnteriorityUI',
    size: 'giant',
    variant: 'text-3d',
  },
};

export const ExitAnimationText3DStatic = {
  render: (args) => <ExitAnimationDemo {...args} />,
  args: {
    text: 'AnteriorityUI',
    size: 'giant',
    variant: 'text-3d-static',
  },
};
