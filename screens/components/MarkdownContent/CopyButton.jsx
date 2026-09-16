import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../Button/index';

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
    <Button
      variant="ghost"
      color="transparent"
      circle
      onClick={handleCopy}
      className={className}
      style={{ width: '1.6rem', height: '1.6rem', minWidth: 0, padding: 0 }}
      ToolTip={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </Button>
  );
};

export default CopyButton;
