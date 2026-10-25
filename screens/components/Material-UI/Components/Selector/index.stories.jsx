import React, { useState } from 'react';
import Selector from './index';

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

const MultiSelectTemplate = (args) => {
  const [value, setValue] = useState(args.value || []);
  return (
    <Selector
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const MultiSelect = {
  render: (args) => <MultiSelectTemplate {...args} />,
  args: {
    label: 'Especies',
    options,
    multiSelect: true,
    value: ['perro', 'ave'],
    placeholder: 'Selecciona especies',
  },
};

export const MultiSelectCustomColors = {
  render: (args) => <MultiSelectTemplate {...args} />,
  args: {
    label: 'Especies',
    options,
    multiSelect: true,
    value: ['gato'],
    checkedBgColor: '#0369a1',
    placeholder: 'Selecciona especies',
  },
};

export const MultiSelectCustomChips = {
  render: (args) => <MultiSelectTemplate {...args} />,
  args: {
    label: 'Especies',
    options,
    multiSelect: true,
    value: ['gato', 'perro'],
    chipBgColor: '#0369a1',
    chipTextColor: '#ffffff',
    chipIconColor: '#e0f2fe',
    placeholder: 'Selecciona especies',
  },
};

const manyOptions = Array.from({ length: 30 }, (_, i) => ({
  value: `option-${i}`,
  label: `Opción ${i + 1}`,
}));

export const VisibleScrollbar = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Opciones',
    options: manyOptions,
    hideScrollbar: false,
    placeholder: 'Abrí el listado para ver el scrollbar',
  },
};

export const VisibleScrollbarCustomColor = {
  render: (args) => <ControlledTemplate {...args} />,
  args: {
    label: 'Opciones',
    options: manyOptions,
    hideScrollbar: false,
    scrollbarColor: '#38bdf8',
    placeholder: 'Abrí el listado para ver el scrollbar',
  },
};
