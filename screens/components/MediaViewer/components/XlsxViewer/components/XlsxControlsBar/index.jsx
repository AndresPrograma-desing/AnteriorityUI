import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, Download, Undo2, Redo2, Save, Plus, Calculator } from 'lucide-react';
import Button from '../../../../../Button/index';
import ScrollBar from '../../../../../ScrollBar/index';
import ScrollArrow from '../ScrollArrow/index';
import useScrollEdges from '../../javascript/useScrollEdges.js';
import { XLSX_TABS_SCROLL_STEP } from '../../../../constants.js';
import styles from './index.module.css';

// Barra inferior del visor de hojas de cálculo: pestañas por hoja (como Excel), resumen de la
// selección, botón de copiar y descarga del archivo original.
const XlsxControlsBar = ({
  sheets,
  activeSheet,
  onSheetChange,
  summary,
  canCopy,
  copied,
  onCopy,
  copyLabel,
  copiedLabel,
  downloadUrl,
  downloadLabel,
  fileName,
  editable = false,
  dirty = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onSave,
  onAddSheet,
  onRenameSheet,
  addSheetLabel,
  saveLabel,
  undoLabel,
  redoLabel,
  summaryTitle,
  statsOpen = false,
  onToggleStats,
  statsLabel,
  accentColor,
  textColor,
  bgColor,
}) => {
  const tabsRef = useRef(null);
  const [renaming, setRenaming] = useState(null); // { index, draft, invalid }
  const edges = useScrollEdges(tabsRef, sheets.length);

  // La pestaña activa siempre queda a la vista.
  useEffect(() => {
    const active = tabsRef.current?.querySelector('[aria-selected="true"]');
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [activeSheet]);

  const finishRename = (commit) => {
    if (!renaming) return;
    if (!commit) {
      setRenaming(null);
      return;
    }
    if (onRenameSheet(renaming.index, renaming.draft)) setRenaming(null);
    else setRenaming({ ...renaming, invalid: true }); // nombre vacío, repetido o con caracteres no permitidos
  };

  const stepTabs = (dir) => (repeat) =>
    tabsRef.current?.scrollBy({ left: dir * XLSX_TABS_SCROLL_STEP, behavior: repeat ? 'auto' : 'smooth' });

  return (
    <div className={styles.controlsBar} style={{ backgroundColor: bgColor, color: textColor }}>
      {edges.left && <ScrollArrow inline direction="left" label="Pestañas anteriores" onStep={stepTabs(-1)} />}
      <ScrollBar scrollAreaRef={tabsRef} vertical={false} className={styles.tabsScroll} contentClassName={styles.tabs}>
        <div className={styles.tabsInner} role="tablist">
          {sheets.map((sheet, index) => {
            const active = index === activeSheet;
            return (
              renaming && renaming.index === index ? (
                <input
                  key={`${sheet.name}-${index}-rename`}
                  className={`${styles.tabInput} ${renaming.invalid ? styles.tabInputInvalid : ''}`}
                  value={renaming.draft}
                  maxLength={31}
                  ref={(el) => el && !el.dataset.focused && ((el.dataset.focused = '1'), el.select())}
                  onChange={(event) => setRenaming({ index, draft: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') finishRename(true);
                    else if (event.key === 'Escape') finishRename(false);
                  }}
                  onBlur={() => finishRename(true)}
                  style={{ color: accentColor, borderBottomColor: accentColor }}
                />
              ) : (
                <button
                  key={`${sheet.name}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                  style={active ? { color: accentColor, borderBottomColor: accentColor } : { color: textColor }}
                  onClick={() => onSheetChange(index)}
                  onDoubleClick={onRenameSheet ? () => setRenaming({ index, draft: sheet.name }) : undefined}
                >
                  {sheet.name}
                </button>
              )
            );
          })}
        </div>
      </ScrollBar>
      {onAddSheet && (
        <Button
          circle
          size="small"
          variant="ghost"
          color="transparent"
          icon={Plus}
          onClick={onAddSheet}
          aria-label={addSheetLabel}
          title={addSheetLabel}
          style={{ color: accentColor }}
        />
      )}
      {edges.right && <ScrollArrow inline direction="right" label="Pestañas siguientes" onStep={stepTabs(1)} />}

      <div className={styles.actions}>
        {summary && <span className={styles.summary} title={summaryTitle}>{summary}</span>}
        {onToggleStats && (
          <Button
            circle
            size="small"
            variant="ghost"
            color="transparent"
            icon={Calculator}
            onClick={onToggleStats}
            aria-label={statsLabel}
            aria-pressed={statsOpen}
            title={statsLabel}
            style={{ color: statsOpen ? accentColor : textColor }}
          />
        )}
        {editable && (
          <>
            <Button
              circle
              size="small"
              variant="ghost"
              color="transparent"
              icon={Undo2}
              onClick={onUndo}
              disabled={!canUndo}
              aria-label={undoLabel}
              title={`${undoLabel} (Ctrl+Z)`}
              style={{ color: textColor }}
            />
            <Button
              circle
              size="small"
              variant="ghost"
              color="transparent"
              icon={Redo2}
              onClick={onRedo}
              disabled={!canRedo}
              aria-label={redoLabel}
              title={`${redoLabel} (Ctrl+Y)`}
              style={{ color: textColor }}
            />
            <Button
              size="small"
              variant="ghost"
              color="transparent"
              icon={Save}
              onClick={onSave}
              disabled={!dirty}
              style={{ color: dirty ? accentColor : textColor }}
            >
              {saveLabel}
            </Button>
          </>
        )}
        <Button
          size="small"
          variant="ghost"
          color="transparent"
          icon={copied ? Check : Copy}
          onClick={onCopy}
          disabled={!canCopy}
          style={{ color: copied ? accentColor : textColor }}
        >
          {copied ? copiedLabel : copyLabel}
        </Button>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={fileName || undefined}
            target="_blank"
            rel="noreferrer"
            className={styles.downloadButton}
            style={{ color: accentColor }}
            aria-label={downloadLabel}
            title={downloadLabel}
          >
            <Download size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

export default XlsxControlsBar;
