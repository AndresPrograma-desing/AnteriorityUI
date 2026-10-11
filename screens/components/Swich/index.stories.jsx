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

export const WithThumbIcons = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    showIcons: true,
  },
};

export const WithThumbIconsOff = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: false,
    showIcons: true,
  },
};

export const WithTrackLabels = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    showLabels: true,
  },
};

export const WithTrackLabelsOff = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: false,
    showLabels: true,
  },
};

export const WithBoth = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    variant: 'both',
  },
};

export const CustomLabels = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    showLabels: true,
    yesText: 'ON',
    noText: 'OFF',
    activeColor: '#2563eb',
  },
};

export const WithoutTooltip = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    showTooltip: false,
  },
};

export const WithCustomTooltip = {
  render: (args) => <SwitchWithState {...args} />,
  args: {
    value: true,
    tooltip: 'Tooltip personalizado fijo',
  },
};

export const ShowcaseAllVariants = {
  render: () => {
    const [val1, setVal1] = useState(false);
    const [val2, setVal2] = useState(true);
    const [val3, setVal3] = useState(false);
    const [val4, setVal4] = useState(true);
    const [val5, setVal5] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch value={val1} onChange={setVal1} />
          <span>Default: {val1 ? 'Activo' : 'Inactivo'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch value={val2} onChange={setVal2} showIcons />
          <span>Con Check / X en el redondito blanco (thumb): {val2 ? 'True (Check)' : 'False (X)'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch value={val3} onChange={setVal3} showLabels />
          <span>Con texto SI / NO en la parte libre del switch: {val3 ? 'True (SI)' : 'False (NO)'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch value={val4} onChange={setVal4} variant="both" />
          <span>Con ambos (íconos en thumb + SI / NO en parte libre): {val4 ? 'True' : 'False'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Switch value={val5} onChange={setVal5} showTooltip={false} />
          <span>Sin tooltip (showTooltip={false})</span>
        </div>
      </div>
    );
  },
};


