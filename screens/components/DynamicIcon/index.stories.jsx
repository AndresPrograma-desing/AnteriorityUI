import DynamicIcon from './index.jsx';

export default {
  title: 'Components/DynamicIcon',
  component: DynamicIcon,
};

export const Icon = { args: { name: 'SiReact', size: 32 } };

export const ColoredIcon = { args: { name: 'FaHeart', color: '#e11d48', size: 32 } };

export const Emoji = { args: { name: '🚀', size: 32 } };

export const InheritsTextColor = {
  render: () => (
    <p style={{ color: '#7c3aed', fontSize: '1.25rem' }}>
      Hereda el color del texto <DynamicIcon name="LuHome" /> y el tamaño en <code>em</code>.
    </p>
  ),
};
