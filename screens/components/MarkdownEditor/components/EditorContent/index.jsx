import React from 'react';
import { MarkdownContent } from '../../../MarkdownContent/index';
import ScrollBar from '../../../ScrollBar/index';
import styles from './index.module.css';

function EditorContent({
  viewMode,
  editorHeight,
  value,
  onChange,
  onKeyDown,
  onPaste,
  placeholder,
  textareaRef,
  images,
  splitEmptyPreview,
  previewEmptyPreview,
}) {
  const hasContent = Boolean(value.trim());

  return (
    <div className={styles.contentArea} style={{ height: `${editorHeight}px` }}>
      {viewMode === 'write' && (
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          placeholder={placeholder}
          spellCheck={false}
        />
      )}

      {viewMode === 'split' && (
        <div className={styles.splitArea}>
          <textarea
            ref={textareaRef}
            className={`${styles.textarea} ${styles.splitEditor}`}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder={placeholder}
            spellCheck={false}
          />
          <div className={styles.previewPane}>
            {hasContent ? (
              <ScrollBar className={styles.previewScrollBar} contentClassName={styles.previewScrollBarContent} horizontal={false}>
                <MarkdownContent images={images}>{value}</MarkdownContent>
              </ScrollBar>
            ) : (
              <span className={styles.emptyPreview}>{splitEmptyPreview}</span>
            )}
          </div>
        </div>
      )}

      {viewMode === 'preview' && (
        <div className={styles.previewPane}>
          {hasContent ? (
            <ScrollBar className={styles.previewScrollBar} contentClassName={styles.previewScrollBarContent} horizontal={false}>
              <MarkdownContent images={images}>{value}</MarkdownContent>
            </ScrollBar>
          ) : (
            <span className={styles.emptyPreview}>{previewEmptyPreview}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default EditorContent;
