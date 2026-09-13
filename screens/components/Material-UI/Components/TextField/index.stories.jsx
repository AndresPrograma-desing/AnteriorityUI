import React, { useState } from 'react';
import TextField from './index';

export default {
  title: 'Components/Material-UI/TextField',
  component: TextField,
};

const ControlledTemplate = (args) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <TextField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre...',
  },
};

export const Required = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Correo electrónico',
    placeholder: 'usuario@correo.com',
    required: true,
  },
};

export const WithError = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Contraseña',
    type: 'password',
    error: true,
    helperText: 'La contraseña debe tener al menos 6 caracteres',
  },
};

export const Disabled = {
  args: {
    label: 'Correo electrónico (Autocompletado)',
    value: 'usuario@correo.com',
    disabled: true,
  },
};
