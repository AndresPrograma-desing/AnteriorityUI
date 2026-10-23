import React from 'react';
import { Tooltip } from '@mui/material';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  Edit3,
  Columns,
} from 'lucide-react';
import { ColorPickerButton } from './components/index.js';
import styles from './index.module.css';

function Toolbar({
  viewMode,
  onViewModeChange,
  onBold,
  onItalic,
  onHeading1,
  onHeading2,
  onHeading3,
  onBulletList,
  onOrderedList,
  onQuote,
  onCodeBlock,
  onLink,
  onImage,
  onTable,
  colorButtonRef,
  pendingColor,
  isColorPickerOpen,
  onToggleColorPicker,
  onCloseColorPicker,
  onColorPreview,
  onApplyColor,
  labels,
}) {
  const {
    editorTab,
    splitTab,
    previewTab,
    boldTooltip,
    italicTooltip,
    titleTooltip,
    heading2Tooltip,
    heading3Tooltip,
    bulletListTooltip,
    orderedListTooltip,
    quoteTooltip,
    codeBlockTooltip,
    linkTooltip,
    imageTooltip,
    colorTooltip,
    tableTooltip,
    applyColorLabel,
  } = labels;

  const disabled = viewMode === 'preview';

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        <Tooltip title={boldTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onBold} disabled={disabled}>
            <Bold size={16} />
          </button>
        </Tooltip>

        <Tooltip title={italicTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onItalic} disabled={disabled}>
            <Italic size={16} />
          </button>
        </Tooltip>

        <div className={styles.toolbarDivider} />

        <Tooltip title={titleTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onHeading1} disabled={disabled}>
            <Heading1 size={16} />
          </button>
        </Tooltip>

        <Tooltip title={heading2Tooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onHeading2} disabled={disabled}>
            <Heading2 size={16} />
          </button>
        </Tooltip>

        <Tooltip title={heading3Tooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onHeading3} disabled={disabled}>
            <Heading3 size={16} />
          </button>
        </Tooltip>

        <div className={styles.toolbarDivider} />

        <Tooltip title={bulletListTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onBulletList} disabled={disabled}>
            <List size={16} />
          </button>
        </Tooltip>

        <Tooltip title={orderedListTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onOrderedList} disabled={disabled}>
            <ListOrdered size={16} />
          </button>
        </Tooltip>

        <Tooltip title={quoteTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onQuote} disabled={disabled}>
            <Quote size={16} />
          </button>
        </Tooltip>

        <div className={styles.toolbarDivider} />

        <Tooltip title={codeBlockTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onCodeBlock} disabled={disabled}>
            <Code size={16} />
          </button>
        </Tooltip>

        <Tooltip title={linkTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onLink} disabled={disabled}>
            <LinkIcon size={16} />
          </button>
        </Tooltip>

        <Tooltip title={imageTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onImage} disabled={disabled}>
            <ImageIcon size={16} />
          </button>
        </Tooltip>

        <Tooltip title={tableTooltip} arrow>
          <button type="button" className={styles.toolButton} onClick={onTable} disabled={disabled}>
            <TableIcon size={16} />
          </button>
        </Tooltip>

        <div className={styles.toolbarDivider} />

        <ColorPickerButton
          buttonRef={colorButtonRef}
          pendingColor={pendingColor}
          isOpen={isColorPickerOpen}
          onToggleOpen={onToggleColorPicker}
          onClose={onCloseColorPicker}
          onColorPreview={onColorPreview}
          onApplyColor={onApplyColor}
          disabled={disabled}
          colorTooltip={colorTooltip}
          applyColorLabel={applyColorLabel}
        />
      </div>

      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeButton} ${viewMode === 'write' ? styles.modeButtonActive : ''}`}
          onClick={() => onViewModeChange('write')}
        >
          <Edit3 size={13} />
          {editorTab}
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${viewMode === 'split' ? styles.modeButtonActive : ''}`}
          onClick={() => onViewModeChange('split')}
        >
          <Columns size={13} />
          {splitTab}
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${viewMode === 'preview' ? styles.modeButtonActive : ''}`}
          onClick={() => onViewModeChange('preview')}
        >
          <Eye size={13} />
          {previewTab}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
