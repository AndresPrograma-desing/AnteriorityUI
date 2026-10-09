import React from 'react';
import CalendarPicker from './index';

export default {
  title: 'Components/CalendarPicker',
  component: CalendarPicker,
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

export const Range = {
  args: {
    label: 'Rango de estadía',
    name: 'stayRange',
    range: true,
    value: { start: '', end: '' },
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const RangeWithValue = {
  args: {
    label: 'Período de licencia',
    name: 'licenseRange',
    range: true,
    value: { start: '2024-06-10', end: '2024-06-18' },
    onChange: (e) => console.log('changed', e.target.value),
  },
};
