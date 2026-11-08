import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '../utils/copyToClipboard.js';

// Copiar al portapapeles con feedback temporal ("Copiado" / ícono de check).
//
//   const { copied, copy } = useCopyToClipboard({ resetMs: 1600 });
//   <button onClick={() => copy(text)}>{copied ? 'Copiado' : 'Copiar'}</button>
//
// `copy(text, key)` devuelve true si copió. `copied` es `false` en reposo y, tras copiar, `key` (default `true`)
// durante `resetMs`: con una `key` distinta por botón, una lista de valores copiables resuelve el feedback
// con un solo hook (`copied === 'sum'`). `onError` se llama si no se pudo copiar.
export default function useCopyToClipboard({ resetMs = 2000, onError } = {}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(
    async (text, key = true) => {
      const ok = await copyToClipboard(text);
      if (!ok) {
        onErrorRef.current?.();
        return false;
      }
      setCopied(key);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  return { copied, copy };
}
