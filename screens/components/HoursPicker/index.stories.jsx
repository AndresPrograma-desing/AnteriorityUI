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

export const Range = {
  args: {
    label: 'Horario de atención',
    name: 'attentionRange',
    range: true,
    value: { start: '', end: '' },
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const RangeWithValue = {
  args: {
    label: 'Turno',
    name: 'shiftRange',
    range: true,
    value: { start: '09:00', end: '17:30' },
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Format24h = {
  args: {
    label: 'Hora (formato 24h)',
    name: 'militaryTime',
    format24h: true,
    value: '14:30',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Format24hRange = {
  args: {
    label: 'Horario de atención (24h)',
    name: 'attentionRange24h',
    range: true,
    format24h: true,
    value: { start: '09:00', end: '22:00' },
    onChange: (e) => console.log('changed', e.target.value),
  },
};
