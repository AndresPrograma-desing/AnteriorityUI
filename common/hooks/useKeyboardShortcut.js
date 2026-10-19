import { useEffect } from 'react';

// Convierte un string combinado tipo "ctrl+shift+e" o "cmd+k" en el shape
// { key, ctrlOrMeta, shift, alt } que espera useKeyboardShortcut, para poder
// declarar un atajo desde una sola prop en vez de un objeto. "ctrl" y "cmd"/
// "meta" son equivalentes (ctrlOrMeta: true) para que el mismo atajo
// funcione en Windows/Linux (Ctrl) y Mac (Cmd) sin que el consumidor tenga
// que distinguir el sistema operativo.
// "space" es un alias legible para la barra espaciadora, cuyo event.key real es " " (un
// string vacío tras trim, que el parser normal de abajo descarta como si no hubiera key).
const KEY_ALIASES = {
  space: ' ',
};

export function parseShortcut(shortcut) {
  if (!shortcut) return null;
  const parts = shortcut.toLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
  const modifiers = new Set(['ctrl', 'cmd', 'meta']);
  const rawKey = parts.find((part) => !modifiers.has(part) && part !== 'shift' && part !== 'alt');
  const key = rawKey ? (KEY_ALIASES[rawKey] ?? rawKey) : null;
  if (!key) return null;

  return {
    key,
    ctrlOrMeta: parts.includes('ctrl') || parts.includes('cmd') || parts.includes('meta'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  };
}

// Hook genérico para registrar un atajo de teclado global (ej. Ctrl/Cmd+K),
// sin acoplarlo a ningún componente en particular. Antes esta lógica vivía
// reimplementada a mano en cada componente que necesitaba un shortcut (ver
// TopBar/utils.js useCommandPaletteShortcut); ahora cualquier componente
// puede llamar a este hook directamente. Acepta la combinación como objeto
// ({ key, ctrlOrMeta, shift, alt }) o, más cómodo desde JSX, como string vía
// `shortcut` (ej. "ctrl+e"), parseado internamente con parseShortcut.
const useKeyboardShortcut = ({
  key,
  ctrlOrMeta = false,
  shift = false,
  alt = false,
  shortcut,
  enabled = true,
  onTrigger,
  preventDefault = true,
}) => {
  const parsed = shortcut ? parseShortcut(shortcut) : null;
  const resolvedKey = parsed ? parsed.key : key;
  const resolvedCtrlOrMeta = parsed ? parsed.ctrlOrMeta : ctrlOrMeta;
  const resolvedShift = parsed ? parsed.shift : shift;
  const resolvedAlt = parsed ? parsed.alt : alt;

  useEffect(() => {
    if (!enabled || !resolvedKey || !onTrigger) return undefined;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() !== resolvedKey.toLowerCase()) return;
      if (resolvedCtrlOrMeta && !(event.ctrlKey || event.metaKey)) return;
      if (!resolvedCtrlOrMeta && (event.ctrlKey || event.metaKey)) return;
      if (resolvedShift !== event.shiftKey) return;
      if (resolvedAlt !== event.altKey) return;

      if (preventDefault) event.preventDefault();
      onTrigger(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resolvedKey, resolvedCtrlOrMeta, resolvedShift, resolvedAlt, enabled, onTrigger, preventDefault]);
};

export default useKeyboardShortcut;
