import { useState } from 'react';
import Switch from './index';

export default {
  title: 'Components/Swich',
  component: Switch,
};

const SwitchWithState = (args) => {
  const [value, setValue] = useState(args.value ?? false);
  return <Switch {...args} value={value} onChange={setValue} />;
};

export const Off = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: false,
  },
};

export const On = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
  },
};

export const Disabled = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    disabled: true,
  },
};

export const CustomColors = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    activeColor: '#2563eb',
    inactiveColor: '#cbd5e1',
    thumbColor: '#ffffff',
  },
};
