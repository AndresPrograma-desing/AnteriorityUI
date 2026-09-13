import React, { useState } from 'react';
import Selector from './Index';

export default {
  title: 'Components/Material-UI/Selector',
  component: Selector,
};

const options = [
  { value: 'perro', label: 'Perro' },
  { value: 'gato', label: 'Gato' },
  { value: 'ave', label: 'Ave' },
];

const ControlledTemplate = (args) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <Selector
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Especie',
    options,
    placeholder: 'Selecciona una especie',
  },
};

export const Required = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Especie',
    options,
    required: true,
    placeholder: 'Selecciona una especie',
  },
};

export const WithValue = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Especie',
    options,
    value: 'gato',
  },
};
