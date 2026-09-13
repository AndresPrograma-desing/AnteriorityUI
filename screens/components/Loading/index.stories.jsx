import Loading from './Index';

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
