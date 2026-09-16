import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './index.module.css';

export const CopyButton = ({ text, className = '', label = 'Copiar', copiedLabel = 'Copiado' }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopy = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(text ?? '');
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard no disponible (contexto inseguro, permisos, etc.) - no-op
    }
  };

  return (
    <button
      type="button"
      className={`${styles.copyButton} ${className}`}
      onClick={handleCopy}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

export default CopyButton;
