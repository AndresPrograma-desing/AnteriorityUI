import React, { cloneElement, isValidElement } from 'react';
import ImagePastePreview from '../ImagePastePreview/index';
import usePasteImage from '../../../common/hooks/usePasteImage';
import styles from './index.module.css';
import {
  DEFAULT_BORDER_COLOR,
  DEFAULT_THUMB_BORDER_COLOR,
  DEFAULT_LABEL_BG_COLOR,
  DEFAULT_LABEL_TEXT_COLOR,
  DEFAULT_PREVIEW_LABEL,
  DEFAULT_REMOVE_LABEL,
} from './constants.js';

// Envoltorio genérico: pega la capacidad de "detectar imagen pegada y
// extraerla como File" alrededor de CUALQUIER campo de texto (MultilinePlaceholder,
// TextField, un <textarea> plano, etc.), sin acoplar esa lógica a un componente
// de texto en particular. El children sigue funcionando igual para texto normal;
// `onImagePaste` recibe el File para que el consumidor decida qué hacer con él
// (subirlo, guardarlo en su storage, etc.). El preview reutiliza ImagePastePreview
// (mismo componente que usa MultilinePlaceholder) en vez de reimplementar el chip.
const PasteImageField = ({
  children,
  onImagePaste,
  disabled = false,
  showPreview = true,
  previewLabel = DEFAULT_PREVIEW_LABEL,
  removeLabel = DEFAULT_REMOVE_LABEL,
  borderColor = DEFAULT_BORDER_COLOR,
  thumbBorderColor = DEFAULT_THUMB_BORDER_COLOR,
  labelBgColor = DEFAULT_LABEL_BG_COLOR,
  labelTextColor = DEFAULT_LABEL_TEXT_COLOR,
  className = '',
  style,
  ...props
}) => {
  const { onPaste, previews, clearPreview } = usePasteImage({ onImagePaste, disabled });

  const field = isValidElement(children)
    ? cloneElement(children, {
        onPaste: (event) => {
          children.props.onPaste?.(event);
          onPaste(event);
        },
      })
    : children;

  return (
    <div className={`${styles.wrapper} ${className}`} style={style} {...props}>
      {field}
      {showPreview && (
        <ImagePastePreview
          previews={previews}
          onRemove={clearPreview}
          label={previewLabel}
          removeLabel={removeLabel}
          borderColor={borderColor}
          thumbBorderColor={thumbBorderColor}
          labelBgColor={labelBgColor}
          labelTextColor={labelTextColor}
        />
      )}
    </div>
  );
};

export default PasteImageField;
