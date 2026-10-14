import React, { useState } from 'react';
import MultilinePlaceholder from './index';

export default {
  title: 'Components/Material-UI/MultilinePlaceholder',
  component: MultilinePlaceholder,
};

const ControlledTemplate = (args) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <MultilinePlaceholder
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Descripción',
    placeholder: 'Escribe una descripción...',
    rows: 4,
  },
};

export const WithHelperText = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Notas',
    helperText: 'Opcional, máximo 500 caracteres.',
    rows: 3,
  },
};

export const WithError = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Comentarios',
    error: 'Este campo es obligatorio',
    rows: 3,
  },
};

export const WithImagePaste = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 360 }}>
        <MultilinePlaceholder
          label="Descripción"
          placeholder="Escribe o pega una imagen (Ctrl+V)..."
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onImagePaste={(files) => console.log('Imágenes extraídas:', files)}
        />
      </div>
    );
  },
};
