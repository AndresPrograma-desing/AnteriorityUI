import HoursPicker from './index.jsx';

export default {
  title: 'Components/HoursPicker',
  component: HoursPicker,
};

export const Default = {
  args: {
    label: 'Hora de inicio',
    name: 'startTime',
    value: '',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const WithPreselectedValue = {
  args: {
    label: 'Hora de la cita',
    name: 'appointmentTime',
    value: '14:30',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Required = {
  args: {
    label: 'Hora límite',
    name: 'deadlineTime',
    value: '09:00',
    required: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Disabled = {
  args: {
    label: 'Hora de cierre',
    name: 'closeTime',
    value: '18:00',
    disabled: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};
