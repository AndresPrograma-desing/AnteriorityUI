import { useState } from 'react';
import EmojiPicker from './index.jsx';

export default {
  title: 'Components/EmojiPicker',
  component: EmojiPicker,
  argTypes: {
    onChange: { action: 'changed' },
  },
};

const TemplateWithState = (args) => {
  const [value, setValue] = useState(args.value ?? '');
  const [color, setColor] = useState(args.color ?? '');
  return <EmojiPicker {...args} value={value} onChange={setValue} color={color} onColorChange={setColor} />;
};

export const Default = {
  render: (args) => <TemplateWithState {...args} />,
  args: { placeholder: 'Elegir emoji o ícono...' },
};

export const WithPreselectedEmoji = {
  render: (args) => <TemplateWithState {...args} />,
  args: { value: '🚀' },
};

export const WithPreselectedIcon = {
  render: (args) => <TemplateWithState {...args} />,
  args: { value: 'SiReact' },
};

export const English = {
  render: (args) => <TemplateWithState {...args} />,
  args: { locale: 'en' },
};

export const WithIconColor = {
  render: (args) => <TemplateWithState {...args} />,
  args: { value: 'SiReact', color: '#06b6d4' },
};

export const DarkTheme = {
  render: (args) => <TemplateWithState {...args} />,
  args: { theme: 'dark', placeholder: 'Modo oscuro...' },
};

export const CustomColors = {
  render: (args) => <TemplateWithState {...args} />,
  args: {
    value: 'FaHeart',
    modalTitle: 'Paleta personalizada',
    bgColor: '#fdf4ff',
    surfaceColor: '#fae8ff',
    textColor: '#581c87',
    mutedColor: '#a21caf',
    iconColor: '#86198f',
    borderColor: '#f0abfc',
    accentColor: '#c026d3',
    backdropColor: 'rgba(74, 4, 78, 0.55)',
    dangerColor: '#be123c',
  },
};

export const Disabled = {
  render: (args) => <TemplateWithState {...args} />,
  args: { value: '🔥', disabled: true },
};
