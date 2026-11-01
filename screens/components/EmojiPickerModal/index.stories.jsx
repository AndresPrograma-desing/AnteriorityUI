import { useRef, useState } from 'react';
import Button from '../Button/index';
import DynamicIcon from '../DynamicIcon/index';
import EmojiPickerModal from './index.jsx';
import { toInlineValue } from './utils';

export default {
  title: 'Components/EmojiPickerModal',
  component: EmojiPickerModal,
};

// Abierto desde un botón propio, sin ningún disparador del componente.
const ExternalButtonDemo = (args) => {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(null);
  const buttonRef = useRef(null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button ref={buttonRef} variant="outline" onClick={() => setOpen(true)}>
        😊 Insertar
      </Button>
      {picked && (
        <span style={{ fontSize: '1.5rem' }}>
          <DynamicIcon name={picked.value} color={picked.color} size="1.5rem" />
        </span>
      )}
      {picked && <code>{toInlineValue(picked.value, { color: picked.color })}</code>}
      <EmojiPickerModal
        anchorEl={buttonRef}
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(value, meta) => setPicked({ value, color: meta.color })}
      />
    </div>
  );
};

export const ExternalButton = { render: (args) => <ExternalButtonDemo {...args} /> };

export const English = { render: (args) => <ExternalButtonDemo {...args} />, args: { locale: 'en' } };

export const DarkTheme = { render: (args) => <ExternalButtonDemo {...args} />, args: { theme: 'dark' } };

export const KeepOpenAfterSelect = {
  render: (args) => <ExternalButtonDemo {...args} />,
  args: { closeOnSelect: false },
};

export const CustomColors = {
  render: (args) => <ExternalButtonDemo {...args} />,
  args: {
    bgColor: '#fdf4ff',
    surfaceColor: '#fae8ff',
    textColor: '#581c87',
    mutedColor: '#a21caf',
    borderColor: '#f0abfc',
    accentColor: '#c026d3',
    backdropColor: 'rgba(74, 4, 78, 0.55)',
  },
};

export const FullFromTheStart = {
  render: (args) => <ExternalButtonDemo {...args} />,
  args: { initialView: 'full' },
};

export const CustomQuickEmojis = {
  render: (args) => <ExternalButtonDemo {...args} />,
  args: { quickEmojis: ['🚀', '💡', '🐛', '✅', '🔥'], recentLimit: 5, recentsStorageKey: 'storybook-emoji-recents' },
};
