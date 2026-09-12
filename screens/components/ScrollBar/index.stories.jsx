import ScrollBar from './index';

export default {
  title: 'Components/ScrollBar',
  component: ScrollBar,
};

const LongContent = () => (
  <div style={{ padding: '8px 16px' }}>
    {Array.from({ length: 30 }).map((_, i) => (
      <p key={i}>Line {i + 1} of scrollable content.</p>
    ))}
  </div>
);

const WideContent = () => (
  <div style={{ width: '1600px', padding: '8px 16px' }}>
    This is a very wide line of content that forces horizontal scrolling to appear within the ScrollBar container.
  </div>
);

export const Vertical = {
  args: {
    vertical: true,
    horizontal: false,
    autoHide: true,
    maxHeight: 200,
    children: <LongContent />,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ScrollBar {...args} />
    </div>
  ),
};

export const Horizontal = {
  args: {
    vertical: false,
    horizontal: true,
    autoHide: true,
    children: <WideContent />,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ScrollBar {...args} />
    </div>
  ),
};

export const AlwaysVisible = {
  args: {
    vertical: true,
    horizontal: false,
    autoHide: false,
    maxHeight: 180,
    children: <LongContent />,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ScrollBar {...args} />
    </div>
  ),
};
