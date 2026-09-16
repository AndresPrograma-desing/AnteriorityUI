import { useRef, useState } from 'react';
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
  Table as TableIcon,
  Eye,
  Edit3,
  Columns,
} from 'lucide-react';
import { MarkdownContent } from '../MarkdownContent/index';
import styles from './index.module.css';

export const MarkdownEditor = ({
  value = '',
  onChange,
  placeholder = '',
  defaultHeight = 320,
  labels = {},
  activeColor,
}) => {
  const {
    editorTab = 'Editor',
    splitTab = 'Dividido',
    previewTab = 'Vista previa',
    splitEmptyPreview = 'Vista previa del formato markdown...',
    previewEmptyPreview = 'Sin contenido para previsualizar',
    boldTooltip = 'Negrita (Ctrl+B)',
    italicTooltip = 'Cursiva (Ctrl+I)',
    titleTooltip = 'Título',
    heading2Tooltip = 'Encabezado principal',
    heading3Tooltip = 'Subtítulo',
    bulletListTooltip = 'Lista con viñetas',
    orderedListTooltip = 'Lista numerada',
    quoteTooltip = 'Cita',
    codeBlockTooltip = 'Bloque de código',
    linkTooltip = 'Insertar enlace (Ctrl+K)',
    tableTooltip = 'Insertar tabla',
    resizeHandleTitle = 'Arrastra para cambiar la altura (doble click para expandir/reducir)',
    boldDefaultText = 'negrita',
    italicDefaultText = 'cursiva',
    linkDefaultText = 'enlace',
    codeDefaultText = 'código',
    tableColumnLabels = ['Columna 1', 'Columna 2', 'Columna 3'],
    tableRowLabels = ['Dato 1', 'Dato 2', 'Dato 3'],
  } = labels;

  const [viewMode, setViewMode] = useState('write'); // 'write' | 'split' | 'preview'
  const [editorHeight, setEditorHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef(null);
  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(defaultHeight);

  const handleMouseDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
    dragStartYRef.current = event.clientY;
    dragStartHeightRef.current = editorHeight;

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const newHeight = Math.max(180, Math.min(1200, dragStartHeightRef.current + deltaY));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    setEditorHeight((prev) => (prev > 450 ? 320 : 580));
  };

  const insertFormatting = (before, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultText;

    const newContent =
      value.substring(0, start) +
      before +
      textToInsert +
      after +
      value.substring(end);

    onChange({ target: { value: newContent } });

    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + before.length;
      const newCursorEnd = newCursorStart + textToInsert.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find start of current line
    const lastNewline = value.lastIndexOf('\n', start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const selectedLines = value.substring(lineStart, end).split('\n');
    const prefixedLines = selectedLines.map((line) => `${prefix}${line}`).join('\n');

    const newContent =
      value.substring(0, lineStart) +
      prefixedLines +
      value.substring(end);

    onChange({ target: { value: newContent } });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        lineStart + prefix.length,
        lineStart + prefixedLines.length
      );
    }, 0);
  };

  const handleKeyDown = (event) => {
    // Shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+K (Link)
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      insertFormatting('**', '**', boldDefaultText);
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault();
      insertFormatting('*', '*', italicDefaultText);
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      insertFormatting('[', '](https://)', linkDefaultText);
    } else if (event.key === 'Enter') {
      // Auto list continuation
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const lastNewline = value.lastIndexOf('\n', start - 1);
      const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
      const currentLine = value.substring(lineStart, start);

      const bulletMatch = currentLine.match(/^(\s*)-\s+/);
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s+/);

      if (bulletMatch) {
        if (currentLine.trim() === '-') {
          // Empty bullet -> clear line
          event.preventDefault();
          const newContent = value.substring(0, lineStart) + value.substring(start);
          onChange({ target: { value: newContent } });
          setTimeout(() => {
            textarea.setSelectionRange(lineStart, lineStart);
          }, 0);
        } else {
          event.preventDefault();
          const indent = bulletMatch[1];
          const newText = `\n${indent}- `;
          const newContent = value.substring(0, start) + newText + value.substring(start);
          onChange({ target: { value: newContent } });
          setTimeout(() => {
            textarea.setSelectionRange(start + newText.length, start + newText.length);
          }, 0);
        }
      } else if (orderedMatch) {
        const num = parseInt(orderedMatch[2], 10);
        if (currentLine.trim() === `${num}.`) {
          // Empty item -> clear line
          event.preventDefault();
          const newContent = value.substring(0, lineStart) + value.substring(start);
          onChange({ target: { value: newContent } });
          setTimeout(() => {
            textarea.setSelectionRange(lineStart, lineStart);
          }, 0);
        } else {
          event.preventDefault();
          const indent = orderedMatch[1];
          const newText = `\n${indent}${num + 1}. `;
          const newContent = value.substring(0, start) + newText + value.substring(start);
          onChange({ target: { value: newContent } });
          setTimeout(() => {
            textarea.setSelectionRange(start + newText.length, start + newText.length);
          }, 0);
        }
      }
    }
  };

  const insertTable = () => {
    const [col1, col2, col3] = tableColumnLabels;
    const [row1, row2, row3] = tableRowLabels;
    const tableTemplate = `\n| ${col1} | ${col2} | ${col3} |\n| --- | --- | --- |\n| ${row1} | ${row2} | ${row3} |\n`;
    insertFormatting(tableTemplate, '');
  };

  return (
    <div
      className={styles.editorContainer}
      style={activeColor ? { '--markdown-editor-active': activeColor } : undefined}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <Tooltip title={boldTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertFormatting('**', '**', boldDefaultText)}
              disabled={viewMode === 'preview'}
            >
              <Bold size={16} />
            </button>
          </Tooltip>

          <Tooltip title={italicTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertFormatting('*', '*', italicDefaultText)}
              disabled={viewMode === 'preview'}
            >
              <Italic size={16} />
            </button>
          </Tooltip>

          <div className={styles.toolbarDivider} />

          <Tooltip title={titleTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertLinePrefix('# ')}
              disabled={viewMode === 'preview'}
            >
              <Heading1 size={16} />
            </button>
          </Tooltip>

          <Tooltip title={heading2Tooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertLinePrefix('## ')}
              disabled={viewMode === 'preview'}
            >
              <Heading2 size={16} />
            </button>
          </Tooltip>

          <Tooltip title={heading3Tooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertLinePrefix('### ')}
              disabled={viewMode === 'preview'}
            >
              <Heading3 size={16} />
            </button>
          </Tooltip>

          <div className={styles.toolbarDivider} />

          <Tooltip title={bulletListTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertLinePrefix('- ')}
              disabled={viewMode === 'preview'}
            >
              <List size={16} />
            </button>
          </Tooltip>

          <Tooltip title={orderedListTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertLinePrefix('1. ')}
              disabled={viewMode === 'preview'}
            >
              <ListOrdered size={16} />
            </button>
          </Tooltip>

          <Tooltip title={quoteTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertLinePrefix('> ')}
              disabled={viewMode === 'preview'}
            >
              <Quote size={16} />
            </button>
          </Tooltip>

          <div className={styles.toolbarDivider} />

          <Tooltip title={codeBlockTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertFormatting('```\n', '\n```', codeDefaultText)}
              disabled={viewMode === 'preview'}
            >
              <Code size={16} />
            </button>
          </Tooltip>

          <Tooltip title={linkTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => insertFormatting('[', '](https://)', linkDefaultText)}
              disabled={viewMode === 'preview'}
            >
              <LinkIcon size={16} />
            </button>
          </Tooltip>

          <Tooltip title={tableTooltip} arrow>
            <button
              type="button"
              className={styles.toolButton}
              onClick={insertTable}
              disabled={viewMode === 'preview'}
            >
              <TableIcon size={16} />
            </button>
          </Tooltip>
        </div>

        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeButton} ${viewMode === 'write' ? styles.modeButtonActive : ''}`}
            onClick={() => setViewMode('write')}
          >
            <Edit3 size={13} />
            {editorTab}
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${viewMode === 'split' ? styles.modeButtonActive : ''}`}
            onClick={() => setViewMode('split')}
          >
            <Columns size={13} />
            {splitTab}
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${viewMode === 'preview' ? styles.modeButtonActive : ''}`}
            onClick={() => setViewMode('preview')}
          >
            <Eye size={13} />
            {previewTab}
          </button>
        </div>
      </div>

      <div className={styles.contentArea} style={{ height: `${editorHeight}px` }}>
        {viewMode === 'write' && (
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              spellCheck={false}
            />
            <div className={styles.previewPane}>
              {value.trim() ? (
                <MarkdownContent>{value}</MarkdownContent>
              ) : (
                <span className={styles.emptyPreview}>{splitEmptyPreview}</span>
              )}
            </div>
          </div>
        )}

        {viewMode === 'preview' && (
          <div className={styles.previewPane}>
            {value.trim() ? (
              <MarkdownContent>{value}</MarkdownContent>
            ) : (
              <span className={styles.emptyPreview}>{previewEmptyPreview}</span>
            )}
          </div>
        )}
      </div>

      <div
        className={`${styles.resizeHandle} ${isDragging ? styles.resizeHandleDragging : ''}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title={resizeHandleTitle}
      >
        <div className={styles.gripPill} />
      </div>
    </div>
  );
};

export default MarkdownEditor;
