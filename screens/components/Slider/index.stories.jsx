import React, { useState } from 'react';
import Slider from './index';

export default {
  title: 'Components/Slider',
  component: Slider,
};

export const Default = {
  render: (args) => {
    const [value, setValue] = useState(30);
    return (
      <div style={{ width: 280 }}>
        <Slider {...args} value={value} onChange={setValue} showPercentage aria-label="Valor" />
        <p>Valor: {value}</p>
      </div>
    );
  },
};

export const CustomColor = {
  render: () => {
    const [value, setValue] = useState(60);
    return (
      <div style={{ width: 280 }}>
        <Slider value={value} onChange={setValue} accentColor="#10b981" aria-label="Valor" />
      </div>
    );
  },
};

export const Disabled = {
  args: { value: 40, disabled: true },
};
