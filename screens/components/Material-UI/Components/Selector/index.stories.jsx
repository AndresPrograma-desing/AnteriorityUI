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

// Simula el bug real: un overlay propio del consumidor (ej. el backdrop de un
// modal/drawer) con z-index mayor al popper default de MUI (100000). El
// overlay SÍ intercepta clics (sin pointerEvents: 'none') — por eso la lista
// se ve pero clickear una opción no hace nada, el síntoma exacto reportado.
// Subiendo popperZIndex por encima del overlay, el Autocomplete vuelve a
// responder a los clics.
const HighZIndexOverlayTemplate = (args) => {
  const [value, setValue] = useState('');
  return (
    <div style={{ position: 'relative' }}>
      <Selector
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div
        title="Overlay simulado (z-index: 999999) — intercepta clics como lo haría el backdrop de un modal propio"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: 'rgba(239, 68, 68, 0.05)',
          border: '2px dashed #ef4444',
        }}
      />
    </div>
  );
};

export const BlockedByConsumerOverlay = {
  render: (args) => <HighZIndexOverlayTemplate {...args} />,
  args: {
    label: 'Especie (bloqueado)',
    options,
    placeholder: 'El overlay rojo bloquea los clics del listado',
    // Sin esta prop (o con un valor menor al z-index del overlay), la lista
    // se abre y se ve, pero clickear una opción no selecciona nada.
    popperZIndex: 500,
  },
};

export const AbovePageOverlay = {
  render: (args) => <HighZIndexOverlayTemplate {...args} />,
  args: {
    label: 'Especie (solucionado)',
    options,
    placeholder: 'popperZIndex por encima del overlay simulado',
    popperZIndex: 1000000,
  },
};
