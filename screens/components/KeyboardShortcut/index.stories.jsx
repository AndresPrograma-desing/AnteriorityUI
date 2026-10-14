import React, { useState } from 'react';
import KeyboardShortcut from './index';
import Button from '../Button/index';
import TextField from '../Material-UI/Components/TextField/index';

export default {
  title: 'Components/KeyboardShortcut',
  component: KeyboardShortcut,
};

export const WrappingButton = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <KeyboardShortcut shortcut="ctrl+e" onTrigger={() => setCount((c) => c + 1)}>
          <Button onClick={() => setCount((c) => c + 1)}>Editar (Ctrl+E)</Button>
        </KeyboardShortcut>
        <p>Disparado {count} veces</p>
      </div>
    );
  },
};

export const WrappingInputFocus = {
  render: () => {
    const [value, setValue] = useState('');
    const inputRef = React.useRef(null);
    return (
      <KeyboardShortcut shortcut="ctrl+shift+f" onTrigger={() => inputRef.current?.focus()}>
        <TextField
          inputRef={inputRef}
          label="Buscar (Ctrl+Shift+F para enfocar)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </KeyboardShortcut>
    );
  },
};
