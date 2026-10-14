import React from 'react';
import { X } from 'lucide-react';
import Barnner from '../Barnner/index';
import styles from './index.module.css';
import {
  DEFAULT_BORDER_COLOR,
  DEFAULT_THUMB_BORDER_COLOR,
  DEFAULT_LABEL_BG_COLOR,
  DEFAULT_LABEL_TEXT_COLOR,
  DEFAULT_LABEL,
  DEFAULT_REMOVE_LABEL,
} from './constants.js';

// Fila de chips (miniatura + badge + botón de quitar) para las imágenes
// extraídas por el hook usePasteImage (`common/hooks/usePasteImage.js`).
// Componente compartido por MultilinePlaceholder y PasteImageField para no
// duplicar este bloque visual entre ambos.
const ImagePastePreview = ({
  previews,
  onRemove,
  label = DEFAULT_LABEL,
  removeLabel = DEFAULT_REMOVE_LABEL,
  borderColor = DEFAULT_BORDER_COLOR,
  thumbBorderColor = DEFAULT_THUMB_BORDER_COLOR,
  labelBgColor = DEFAULT_LABEL_BG_COLOR,
  labelTextColor = DEFAULT_LABEL_TEXT_COLOR,
  className = '',
  style,
}) => {
  if (!previews || previews.length === 0) return null;

  return (
    <div className={`${styles.list} ${className}`} style={style}>
      {previews.map((preview) => (
        <div key={preview.id} className={styles.chip} style={{ '--image-paste-preview-border': borderColor }}>
          <img
            src={preview.url}
            alt={label}
            className={styles.thumb}
            style={{ '--image-paste-preview-thumb-border': thumbBorderColor }}
          />
          <Barnner bgColor={labelBgColor} textColor={labelTextColor}>
            {label}
          </Barnner>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove?.(preview.id)}
            aria-label={removeLabel}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePastePreview;
