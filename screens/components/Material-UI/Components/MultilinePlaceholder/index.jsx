import React, { forwardRef } from 'react';
import MuiTextField from '@mui/material/TextField';
import ImagePastePreview from '../../../ImagePastePreview/index';
import { formatHighlightedText } from '../../../GreenHighlight/utils';
import usePasteImage from '../../../../../common/hooks/usePasteImage';
import styles from './index.module.css';
import {
  DEFAULT_BG_COLOR,
  DEFAULT_IMAGE_PREVIEW_BORDER_COLOR,
  DEFAULT_IMAGE_THUMB_BORDER_COLOR,
  DEFAULT_IMAGE_LABEL_BG_COLOR,
  DEFAULT_IMAGE_LABEL_TEXT_COLOR,
  DEFAULT_IMAGE_PREVIEW_LABEL,
  DEFAULT_IMAGE_REMOVE_LABEL,
} from './constants.js';

const MultilinePlaceholder = forwardRef(({
  label,
  value,
  onChange,
  error,
  helperText,
  rows = 4,
  maxRows,
  variant = "outlined",
  size = "small",
  fullWidth = true,
  placeholder,
  bgColor = DEFAULT_BG_COLOR,
  onImagePaste,
  showImagePreview = true,
  imagePreviewLabel = DEFAULT_IMAGE_PREVIEW_LABEL,
  imageRemoveLabel = DEFAULT_IMAGE_REMOVE_LABEL,
  imagePreviewBorderColor = DEFAULT_IMAGE_PREVIEW_BORDER_COLOR,
  imageThumbBorderColor = DEFAULT_IMAGE_THUMB_BORDER_COLOR,
  imageLabelBgColor = DEFAULT_IMAGE_LABEL_BG_COLOR,
  imageLabelTextColor = DEFAULT_IMAGE_LABEL_TEXT_COLOR,
  onPaste,
  ...props
}, ref) => {
  const formattedLabel = typeof label === 'string' ? formatHighlightedText(label) : label;
  const displayHelperText = typeof helperText === 'string' ? formatHighlightedText(helperText) : helperText;

  const { onPaste: handleImagePaste, previews, clearPreview } = usePasteImage({
    onImagePaste,
    disabled: !onImagePaste,
  });

  const handlePaste = (event) => {
    onPaste?.(event);
    handleImagePaste(event);
  };

  const { inputProps, ...restProps } = props;

  return (
    <div>
      <MuiTextField
        label={formattedLabel}
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={error || displayHelperText}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        placeholder={placeholder}
        multiline
        rows={rows}
        maxRows={maxRows}
        sx={{ m: 0, '& .MuiInputBase-root': { backgroundColor: bgColor } }}
        inputRef={ref}
        onPaste={handlePaste}
        inputProps={{
          ...inputProps,
          className: [styles.textarea, inputProps?.className].filter(Boolean).join(' '),
        }}
        {...restProps}
      />
      {showImagePreview && (
        <ImagePastePreview
          previews={previews}
          onRemove={clearPreview}
          label={imagePreviewLabel}
          removeLabel={imageRemoveLabel}
          borderColor={imagePreviewBorderColor}
          thumbBorderColor={imageThumbBorderColor}
          labelBgColor={imageLabelBgColor}
          labelTextColor={imageLabelTextColor}
          className={styles.imagePreviewList}
        />
      )}
    </div>
  );
});

export default MultilinePlaceholder;
