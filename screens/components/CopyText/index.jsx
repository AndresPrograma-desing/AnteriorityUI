import React from 'react';
import { Copy, Check } from 'lucide-react';
import ModalTooltip from '../ModalTooltip/ModalTooltip';
import useCopyToClipboard from '../../../common/hooks/useCopyToClipboard';
import styles from './index.module.css'; 

export default function CopyableText({ text, bgColor, borderColor, textColor, className = '', style }) {

  const { copied, copy } = useCopyToClipboard({
    resetMs: 2000,
    onError: () => console.error('Error al copiar el texto'),
  });

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    copy(text);
  };

  return (
    <ModalTooltip text={copied ? "¡Copiado!" : "Haga clic para copiar"}>
      <span
        className={`${styles.copyableContainer} ${className}`.trim()}
        onClick={handleCopy}
        style={{
          ...(bgColor ? { '--copytext-bg': bgColor } : {}),
          ...(borderColor ? { '--copytext-border': borderColor } : {}),
          ...(textColor ? { '--copytext-text': textColor } : {}),
          ...style,
        }}
      >
        <span className={styles.copyableText}>{text}</span>
        {copied ? (
          <Check size={14} className={styles.copyIconSuccess} />
        ) : (
          <Copy size={14} className={styles.copyIcon} />
        )}
      </span>
    </ModalTooltip>
  );
}