import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import AlertModal from './AlertModal';

export default {
  title: 'Components/AlertModal',
  component: AlertModal,
};

export const Plain = {
  args: {
    open: true,
    title: 'Alerta',
    message: '¿Estás seguro de que deseas continuar con esta acción?',
    confirmText: 'Ok',
    cancelText: 'Cancelar',
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed'),
  },
};

export const WithTextInput = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <AlertModal
        {...args}
        inputValue={value}
        onInputChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    open: true,
    title: 'Renombrar elemento',
    message: 'Ingresa el nuevo nombre para continuar.',
    showInput: true,
    inputType: 'text',
    inputLabel: 'Nombre',
    inputPlaceholder: 'Escribe un nombre...',
    confirmText: 'Guardar',
    cancelText: 'Cancelar',
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed'),
  },
};

export const WithSelectInput = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <AlertModal
        {...args}
        inputValue={value}
        onInputChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    open: true,
    title: 'Seleccionar motivo',
    message: 'Elige el motivo de esta acción.',
    showInput: true,
    inputType: 'select',
    inputLabel: 'Motivo',
    inputPlaceholder: 'Selecciona una opción',
    inputOptions: [
      { value: 'duplicado', label: 'Registro duplicado' },
      { value: 'error', label: 'Error de captura' },
      { value: 'otro', label: 'Otro motivo' },
    ],
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed'),
  },
};

export const WithImage = {
  args: {
    open: true,
    title: 'Foto de Perfil',
    imageUrl: 'https://i.pravatar.cc/300?img=12',
    confirmText: 'Cerrar',
    showWarningIcon: false,
    onClose: () => console.log('closed'),
  },
};

export const WithCustomIcon = {
  args: {
    open: true,
    title: 'Operación Exitosa',
    message: 'Los cambios fueron guardados correctamente en la base de datos.',
    icon: Trash2,
    iconColor: '#ef4444',
    titleBorderColor: '#ef4444',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    onClose: () => console.log('closed'),
    onConfirm: () => console.log('confirmed delete'),
  },
};

