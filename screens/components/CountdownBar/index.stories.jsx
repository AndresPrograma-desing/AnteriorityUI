import CountdownBar from './index.jsx';

export default {
  title: 'Components/CountdownBar',
  component: CountdownBar,
};

export const Default = {
  args: {
    active: true,
    duration: 10000,
    onComplete: () => console.log('countdown complete'),
  },
};

export const CustomColors = {
  args: {
    active: true,
    duration: 15000,
    height: '10px',
    colors: ['#ef4444', '#f97316', '#22c55e'],
    onComplete: () => console.log('countdown complete'),
  },
};

export const StaticValue = {
  args: {
    active: true,
    value: 65,
    increment: true,
    height: '8px',
  },
};

export const Overlay = {
  args: {
    active: true,
    duration: 8000,
    isOverlay: true,
    overlayMessage: 'Guardando cambios, no cierres esta ventana...',
    onComplete: () => console.log('countdown complete'),
  },
};
