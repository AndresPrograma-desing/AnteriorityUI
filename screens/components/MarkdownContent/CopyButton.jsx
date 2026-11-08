import { Copy, Check } from 'lucide-react';
import Button from '../Button/index';
import useCopyToClipboard from '../../../common/hooks/useCopyToClipboard';

export const CopyButton = ({ text, className = '', label = 'Copiar', copiedLabel = 'Copiado' }) => {
  // Si el portapapeles no está disponible (permisos, contexto inseguro) simplemente no hay feedback.
  const { copied, copy } = useCopyToClipboard({ resetMs: 1600 });

  const handleCopy = (event) => {
    event.preventDefault();
    event.stopPropagation();
    copy(text ?? '');
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
