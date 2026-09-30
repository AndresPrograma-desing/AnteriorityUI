import { useState } from 'react';
import ColorPicker from './index.jsx';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
};

const Controlled = (args) => {
  const [color, setColor] = useState(args.value);
  return (
    <div style={{ padding: 24, minHeight: 420 }}>
      <ColorPicker {...args} value={color} onChange={setColor} />
      <p style={{ marginTop: 16 }}>Valor: {color}</p>
    </div>
  );
};

export const Default = {
  render: (args) => <Controlled {...args} />,
  args: { value: '#1717FF', label: 'Color', ariaLabel: 'Elegir color' },
};

export const Disabled = {
  render: (args) => <Controlled {...args} />,
  args: { value: '#0F766E', label: 'Color', disabled: true },
};

export const CustomColors = {
  render: (args) => <Controlled {...args} />,
  args: {
    value: '#EA1F1F',
    label: 'Color de acento',
    bgColor: '#1f232b',
    textColor: '#e6e8ec',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    accentColor: '#7c9cff',
  },
};

export const EnglishLabels = {
  render: (args) => <Controlled {...args} />,
  args: {
    value: '#22C55E',
    label: 'Color',
    labels: {
      saturation: 'Saturation and brightness',
      hue: 'Hue',
      invalidHex: 'Invalid hex color',
      invalidRgb: 'Invalid RGB values (0-255)',
      invalidHsl: 'Invalid HSL values (H 0-360, S/L 0-100)',
    },
  },
};
