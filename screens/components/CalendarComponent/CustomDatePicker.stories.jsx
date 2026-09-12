import React from 'react';
import CustomDatePicker from './CustomDatePicker';

export default {
  title: 'Components/CalendarComponent',
  component: CustomDatePicker,
};

export const Default = {
  args: {
    label: 'Fecha de nacimiento',
    name: 'birthDate',
    value: '',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const WithValue = {
  args: {
    label: 'Fecha de la cita',
    name: 'appointmentDate',
    value: '2024-06-15',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Required = {
  args: {
    label: 'Fecha requerida',
    name: 'requiredDate',
    value: '',
    required: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Disabled = {
  args: {
    label: 'Fecha bloqueada',
    name: 'disabledDate',
    value: '2024-01-01',
    disabled: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};
