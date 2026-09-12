import { Calendar } from 'lucide-react';
import PlaceholderButton from './index';

export default {
  title: 'Components/PlaceholderButton',
  component: PlaceholderButton,
};

const fakeSavePromise = (value) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log('saved', value);
      resolve({ message: 'Guardado correctamente' });
    }, 800);
  });

export const Default = {
  args: {
    icon: Calendar,
    placeholder: 'Días',
    unitText: 'días',
    buttonText: 'Guardar',
    hintText: 'Define cuántos días de anticipación se requieren.',
    initialValue: '7',
    inputType: 'number',
    min: '1',
    onSavePromise: fakeSavePromise,
    successMessage: 'Valor guardado con éxito',
    errorMessage: 'Ocurrió un error al guardar',
    validationErrorMsg: 'El valor debe ser mayor o igual a 1',
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    disabled: true,
    disabledHintText: 'Esta opción está deshabilitada por ahora.',
  },
};

export const Multiline = {
  args: {
    placeholder: 'Escribe una nota...',
    buttonText: 'Guardar nota',
    hintText: 'Puedes usar Ctrl+Enter para agregar una nueva línea.',
    initialValue: '',
    multiline: true,
    onSavePromise: fakeSavePromise,
    successMessage: 'Nota guardada',
    errorMessage: 'Error al guardar la nota',
    validationErrorMsg: 'La nota no puede estar vacía',
    clearOnSuccess: true,
  },
};

export const TextInput = {
  args: {
    placeholder: 'Ingresa un texto',
    buttonText: 'Guardar',
    hintText: 'Texto libre de ejemplo.',
    initialValue: '',
    inputType: 'text',
    onSavePromise: fakeSavePromise,
    successMessage: 'Guardado',
    errorMessage: 'Error',
    validationErrorMsg: 'Campo requerido',
  },
};
