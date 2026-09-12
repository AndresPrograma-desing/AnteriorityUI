import React from 'react';
import ErrorMessage from './ErrorMessage';

export default {
  title: 'Components/Notification/Error/ErrorMessage',
  component: ErrorMessage,
};

export const Danger = {
  args: {
    title: 'Atención',
    message: 'No se pudo completar la operación. Intenta de nuevo.',
    variant: 'danger',
  },
};

export const Success = {
  args: {
    title: 'Operación Exitosa',
    message: '¡Contraseña actualizada correctamente!',
    variant: 'success',
  },
};

export const CustomTitle = {
  args: {
    title: 'Error de validación',
    message: 'El correo electrónico ya está registrado.',
    variant: 'danger',
  },
};

export const NoMessage = {
  args: {
    message: '',
  },
};
