import useKeyboardShortcut from '../../../common/hooks/useKeyboardShortcut';

// Envoltorio genérico: asigna un atajo de teclado global a CUALQUIER
// children (Button, Input, un <div> propio, etc.) sin acoplar esa lógica a
// un componente en particular y sin agregar markup propio al DOM — es el
// hook compartido useKeyboardShortcut (common/hooks/useKeyboardShortcut.js)
// expuesto como componente para usarlo cómodo desde JSX:
// `<KeyboardShortcut shortcut="ctrl+e" onTrigger={...}>{children}</KeyboardShortcut>`.
const KeyboardShortcut = ({ children, shortcut, enabled = true, onTrigger, preventDefault = true }) => {
  useKeyboardShortcut({ shortcut, enabled, onTrigger, preventDefault });
  return children;
};

export default KeyboardShortcut;
