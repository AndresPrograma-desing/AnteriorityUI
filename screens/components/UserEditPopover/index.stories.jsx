import React, { useState, useRef, useEffect } from 'react';
import UserEditPopover from './index';

export default {
  title: 'Components/UserEditPopover',
  component: UserEditPopover,
};

// UserEditPopover uses a MUI Popover, which needs a real DOM node as anchorEl.
// This wrapper renders a trigger button, stores its DOM node in state once
// mounted, and passes that node down as anchorEl so the popover has something
// to anchor to when `open` is true.
const AnchoredPopover = (args) => {
  const anchorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setAnchorEl(anchorRef.current);
  }, []);

  return (
    <div style={{ padding: '60px' }}>
      <button ref={anchorRef} type="button">
        Editar nombre
      </button>
      <UserEditPopover {...args} anchorEl={anchorEl} />
    </div>
  );
};

export const Open = {
  render: (args) => <AnchoredPopover {...args} />,
  args: {
    open: true,
    currentName: 'Ana Gomez',
    onClose: () => console.log('popover closed'),
    onSuccess: (name) => console.log('saved name', name),
  },
};

export const EmptyName = {
  render: (args) => <AnchoredPopover {...args} />,
  args: {
    open: true,
    currentName: '',
    onClose: () => console.log('popover closed'),
    onSuccess: (name) => console.log('saved name', name),
  },
};
