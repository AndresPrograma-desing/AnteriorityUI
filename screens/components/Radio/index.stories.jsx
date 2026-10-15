import React, { useState } from 'react';
import { RadioGroup, Radio } from './index';
import { COLORS } from './constants';

export default {
  title: 'Components/Radio',
  component: RadioGroup,
};

export const Default = {
  render: () => (
    <RadioGroup label="Seleccione una opción" defaultValue="opt1">
      <Radio value="opt1" label="Opción 1" />
      <Radio value="opt2" label="Opción 2" />
      <Radio value="opt3" label="Opción 3" />
    </RadioGroup>
  ),
};

export const RowLayout = {
  render: () => (
    <RadioGroup label="Opciones en línea (Row)" direction="row" defaultValue="yes">
      <Radio value="yes" label="Sí" />
      <Radio value="no" label="No" />
      <Radio value="maybe" label="Tal vez" disabled />
    </RadioGroup>
  ),
};

export const ColorVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RadioGroup label="Color Primario" color={COLORS.primary} defaultValue="a">
        <Radio value="a" label="Opción A" />
        <Radio value="b" label="Opción B" />
      </RadioGroup>

      <RadioGroup label="Color Success (Verde)" color={COLORS.success} defaultValue="approved">
        <Radio value="approved" label="Aprobado" />
        <Radio value="rejected" label="Rechazado" />
      </RadioGroup>

      <RadioGroup label="Color Secondary" color={COLORS.secondary} defaultValue="pro">
        <Radio value="pro" label="Plan Pro" />
        <Radio value="free" label="Plan Gratuito" />
      </RadioGroup>
    </div>
  ),
};

export const Interactive = {
  render: function Render() {
    const [value, setValue] = useState('react');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <RadioGroup
          label="Framework de preferencia"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          color={COLORS.primary}
        >
          <Radio value="react" label="React / Next.js" />
          <Radio value="vue" label="Vue / Nuxt" />
          <Radio value="angular" label="Angular" />
        </RadioGroup>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontFamily: 'sans-serif' }}>
          Valor seleccionado: <strong>{value}</strong>
        </span>
      </div>
    );
  },
};