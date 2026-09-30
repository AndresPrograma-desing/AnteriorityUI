import Input from './index.jsx';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = {
  args: {
    label: 'Nombre',
    placeholder: 'Escribe tu nombre',
  },
};

export const Required = {
  args: {
    label: 'Correo electrónico',
    placeholder: 'correo@ejemplo.com',
    required: true,
  },
};

export const WithError = {
  args: {
    label: 'Teléfono',
    placeholder: '555-555-5555',
    error: 'El número de teléfono no es válido',
  },
};

export const WithHelperText = {
  args: {
    label: 'Contraseña',
    type: 'password',
    helperText: 'Debe tener al menos 8 caracteres',
  },
};

export const Numeric = {
  args: {
    label: 'Cantidad',
    numeric: true,
    defaultValue: 100,
    min: 0,
    max: 1000,
    step: 5,
  },
};
