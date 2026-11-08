import React, { useRef, useState, useEffect, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react';
import ScrollBar from '../../../../../ScrollBar/index';
import ScrollArrow from '../ScrollArrow/index';
import Resizable from '../../../../../Resizable/index';
import AnchoredCalendar from '../../../../../CalendarPicker/components/AnchoredCalendar/index';
import useScrollEdges from '../../javascript/useScrollEdges.js';
import styles from './index.module.css';
import {
  XLSX_ROW_HEIGHT,
  XLSX_VIEWPORT_HEIGHT,
  XLSX_OVERSCAN_ROWS,
  XLSX_ROWNUM_WIDTH,
  XLSX_SCROLL_STEP_ROWS,
  XLSX_SCROLL_STEP_X,
  XLSX_RESIZE_HANDLE,
  XLSX_COL_MIN_WIDTH,
  XLSX_COL_MAX_WIDTH,
  XLSX_ROW_MIN_HEIGHT,
  XLSX_ROW_MAX_HEIGHT,
} from '../../../../constants.js';
import { colLabel, normalizeSelection } from '../../utils.js';

// Grilla con filas virtualizadas: solo se montan las filas visibles (+ overscan), el resto se reemplaza por dos
// filas espaciadoras, así que el costo no depende de cuántas filas tenga la hoja. Soporta selección de celda /
// rango (click, shift+click, arrastre, flechas), de fila completa (click en el número), de columna completa (click
// en la letra) y de toda la hoja (esquina / Ctrl+A).
//
// Con `editable`: doble click / Enter / F2 / escribir edita la celda (Enter baja, Tab avanza, Esc cancela); en
// celdas de fecha se abre el CalendarPicker; Supr borra la selección; Ctrl+X/V cortan y pegan; Ctrl+Z / Ctrl+Y
// deshacen y rehacen. La grilla no toca los datos: delega en onCommit / onClearSelection / onPasteText / onUndo.
// Geometría de filas con alturas propias. `overrides` = [[índice, alto]] ordenado; el resto mide XLSX_ROW_HEIGHT.
// Con pocas filas modificadas estas cuentas son baratas aunque la hoja tenga decenas de miles de filas.
const rowHeightOf = (r, overrides) => {
  for (let i = 0; i < overrides.length; i++) if (overrides[i][0] === r) return overrides[i][1];
  return XLSX_ROW_HEIGHT;
};
const rowTopOf = (r, overrides) => {
  let extra = 0;
  for (let i = 0; i < overrides.length && overrides[i][0] < r; i++) extra += overrides[i][1] - XLSX_ROW_HEIGHT;
  return r * XLSX_ROW_HEIGHT + extra;
};
const rowAtY = (y, overrides) => {
  let extra = 0;
  for (let i = 0; i < overrides.length; i++) {
    const top = overrides[i][0] * XLSX_ROW_HEIGHT + extra;
    if (y < top) break;
    if (y < top + overrides[i][1]) return overrides[i][0];
    extra += overrides[i][1] - XLSX_ROW_HEIGHT;
  }
  return Math.max(0, Math.floor((y - extra) / XLSX_ROW_HEIGHT));
};

const ARROW_LABELS = { up: 'Subir', down: 'Bajar', left: 'Izquierda', right: 'Derecha' };

const XlsxGrid = forwardRef(function XlsxGrid(
  {
    rows,
    colCount,
    colWidths: autoColWidths,
    sizes,
    sizesTick,
    onSizesChange,
    selection,
    onSelectionChange,
    onCopy,
    onContextMenu,
    emptyLabel,
    editable = false,
    getEditInfo,
    onCommit,
    onClearSelection,
    onPasteText,
    onUndo,
    onRedo,
    accentColor,
    bgColor,
    textColor,
    borderColor,
  },
  ref,
) {
  const scrollRef = useRef(null); // área scrolleable interna del ScrollBar de la librería
  const wrapRef = useRef(null);
  const draggingRef = useRef(false);
  const editingRef = useRef(null);
  const draftRef = useRef('');
  const [scrollTop, setScrollTop] = useState(0);
  const [editing, setEditing] = useState(null);
  editingRef.current = editing;

  const rowCount = rows.length;
  const rect = useMemo(() => normalizeSelection(selection), [selection]);

  // Tamaños propios (arrastrando el borde de un encabezado): viven en `sizes` ({ cols: {c: ancho}, rows: {r: alto} }),
  // un objeto mutable por hoja que pasa el visor; `sizesTick` fuerza el recálculo cuando cambia.
  const colWidths = useMemo(
    () => autoColWidths.map((w, c) => (sizes && sizes.cols[c]) || w),
    [autoColWidths, sizes, sizesTick], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const rowOverrides = useMemo(
    () => Object.entries((sizes && sizes.rows) || {})
      .map(([index, h]) => [Number(index), h])
      .filter(([index]) => index < rowCount)
      .sort((x, y) => x[0] - y[0]),
    [sizes, sizesTick, rowCount], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setColWidth = (c, width) => {
    if (!sizes) return;
    if (width === autoColWidths[c]) delete sizes.cols[c];
    else sizes.cols[c] = width;
    onSizesChange?.();
  };
  const setRowHeight = (r, height) => {
    if (!sizes) return;
    if (height === XLSX_ROW_HEIGHT) delete sizes.rows[r];
    else sizes.rows[r] = height;
    onSizesChange?.();
  };

  const first = Math.max(0, rowAtY(scrollTop, rowOverrides) - XLSX_OVERSCAN_ROWS);
  const last = Math.min(rowCount, rowAtY(scrollTop + XLSX_VIEWPORT_HEIGHT, rowOverrides) + 1 + XLSX_OVERSCAN_ROWS);
  const totalRowsHeight = rowTopOf(rowCount, rowOverrides);
  const topSpacer = rowTopOf(first, rowOverrides);
  const bottomSpacer = totalRowsHeight - rowTopOf(last, rowOverrides);

  const totalWidth = useMemo(
    () => XLSX_ROWNUM_WIDTH + colWidths.reduce((sum, w) => sum + w, 0),
    [colWidths],
  );

  // El arrastre termina aunque se suelte el mouse fuera de la grilla.
  useEffect(() => {
    const stop = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mouseup', stop);
    return () => window.removeEventListener('mouseup', stop);
  }, []);

  const hasData = rowCount > 0 && colCount > 0;
  const edges = useScrollEdges(scrollRef, hasData);

  // Mueve el contenido (flechas en pantalla y teclas sin selección). Las repeticiones al mantener
  // apretado son instantáneas; el primer paso es animado.
  const scrollStep = (dir, repeat = false, pages = 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const dy = XLSX_SCROLL_STEP_ROWS * XLSX_ROW_HEIGHT * pages;
    const dx = XLSX_SCROLL_STEP_X;
    const delta = { up: [0, -dy], down: [0, dy], left: [-dx, 0], right: [dx, 0] }[dir];
    el.scrollBy({ left: delta[0], top: delta[1], behavior: repeat ? 'auto' : 'smooth' });
  };

  // Columna fuera de vista (por flechas del teclado): se desplaza lo justo para mostrarla.
  const colOffsets = useMemo(() => {
    const offsets = [];
    let acc = XLSX_ROWNUM_WIDTH;
    colWidths.forEach((w) => {
      offsets.push(acc);
      acc += w;
    });
    return offsets;
  }, [colWidths]);

  const scrollColIntoView = (c) => {
    const el = scrollRef.current;
    if (!el || colOffsets[c] === undefined) return;
    const left = colOffsets[c];
    const right = left + colWidths[c];
    if (left - XLSX_ROWNUM_WIDTH < el.scrollLeft) el.scrollLeft = left - XLSX_ROWNUM_WIDTH;
    else if (right > el.scrollLeft + el.clientWidth) el.scrollLeft = right - el.clientWidth;
  };

  const scrollRowIntoView = (r) => {
    const el = scrollRef.current;
    if (!el) return;
    const top = rowTopOf(r, rowOverrides);
    const bottom = top + rowHeightOf(r, rowOverrides) + XLSX_ROW_HEIGHT; // + encabezado fijo
    if (top < el.scrollTop) el.scrollTop = top;
    else if (bottom > el.scrollTop + el.clientHeight) el.scrollTop = bottom - el.clientHeight;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const onScroll = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [hasData]);

  // Al cambiar de hoja se vuelve arriba y se cancela cualquier edición abierta.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrollTop(0);
    setEditing(null);
  }, [rows]);

  const select = useCallback(
    (anchor, focus) => onSelectionChange({ anchor, focus }),
    [onSelectionChange],
  );

  const focusGrid = () => wrapRef.current?.focus({ preventScroll: true });

  // ---------- edición
  // `forceDate`: abre el calendario aunque la celda no sea (todavía) una fecha, ej. «Elegir fecha…» en una celda vacía.
  const startEdit = (r, c, initial, forceDate = false) => {
    if (!editable || !getEditInfo) return;
    scrollRowIntoView(r);
    scrollColIntoView(c);
    const info = getEditInfo(r, c);
    select({ r, c }, { r, c });
    if ((info.kind === 'date' || forceDate) && initial === undefined) {
      const td = scrollRef.current?.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      const box = (td || scrollRef.current).getBoundingClientRect();
      setEditing({
        r,
        c,
        mode: 'date',
        ymd: info.ymd || null,
        rect: { left: box.left, top: box.top, width: box.width, height: box.height },
      });
      return;
    }
    const draft = initial !== undefined ? initial : info.text;
    draftRef.current = draft;
    setEditing({ r, c, mode: 'text', draft });
  };

  // Rectángulo en pantalla de la selección (unión de las celdas visibles de sus esquinas, recortado al área de
  // la grilla). Lo usa la calculadora flotante para ubicarse al lado.
  const getAnchorRect = () => {
    const wrap = wrapRef.current;
    if (!wrap) return null;
    const bounds = wrap.getBoundingClientRect();
    if (!rect) return bounds;
    const corners = [[rect.r1, rect.c1], [rect.r1, rect.c2], [rect.r2, rect.c1], [rect.r2, rect.c2]];
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    corners.forEach(([r, c]) => {
      const td = scrollRef.current?.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      if (!td) return;
      const b = td.getBoundingClientRect();
      left = Math.min(left, b.left);
      top = Math.min(top, b.top);
      right = Math.max(right, b.right);
      bottom = Math.max(bottom, b.bottom);
    });
    if (left === Infinity) return bounds; // selección fuera de la vista (virtualizada): se ancla a la grilla
    return {
      left: Math.max(left, bounds.left),
      top: Math.max(top, bounds.top),
      right: Math.min(right, bounds.right),
      bottom: Math.min(bottom, bounds.bottom),
    };
  };

  const scrollToCell = (r, c) => {
    scrollRowIntoView(r);
    scrollColIntoView(c);
  };

  useImperativeHandle(ref, () => ({ startEdit, getAnchorRect, scrollToCell }));

  // Cierra el editor de texto: confirma (commit) o descarta, y opcionalmente mueve la selección (Enter/Tab).
  const finishEdit = (commit, move) => {
    const ed = editingRef.current;
    if (!ed || ed.mode !== 'text') return;
    editingRef.current = null;
    setEditing(null);
    if (commit) onCommit(ed.r, ed.c, { text: draftRef.current });
    if (move) {
      const next = {
        r: Math.min(rowCount - 1, Math.max(0, ed.r + move[0])),
        c: Math.min(colCount - 1, Math.max(0, ed.c + move[1])),
      };
      select(next, next);
      scrollRowIntoView(next.r);
      scrollColIntoView(next.c);
    }
    focusGrid();
  };

  const closeDate = () => {
    editingRef.current = null;
    setEditing(null);
    focusGrid();
  };

  const pickDate = (iso) => {
    const ed = editingRef.current;
    if (!ed || ed.mode !== 'date') return;
    const [y, m, d] = iso ? iso.split('-').map(Number) : [];
    onCommit(ed.r, ed.c, { ymd: iso ? { y, m, d } : null });
    closeDate();
  };

  const handleEditorKeyDown = (event) => {
    event.stopPropagation(); // que el handler de la grilla no interprete estas teclas
    if (event.key === 'Enter') {
      event.preventDefault();
      finishEdit(true, [event.shiftKey ? -1 : 1, 0]);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      finishEdit(true, [0, event.shiftKey ? -1 : 1]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      finishEdit(false);
    }
  };

  const editorRef = (el) => {
    if (el && !el.dataset.focused) {
      el.dataset.focused = '1';
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  };

  // ---------- selección con mouse
  const cellFromEvent = (event) => {
    const cell = event.target.closest('[data-r]');
    if (!cell) return null;
    return { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
  };

  const handleMouseDown = (event) => {
    if (event.button !== 0 || event.target.tagName === 'INPUT') return;
    const target = cellFromEvent(event);
    if (!target) return;
    if (editingRef.current && editingRef.current.mode === 'text') finishEdit(true);
    event.preventDefault(); // evita que el navegador seleccione texto mientras se arrastra
    focusGrid();
    draggingRef.current = true;
    if (event.shiftKey && selection) select(selection.anchor, target);
    else select(target, target);
  };

  const handleMouseOver = (event) => {
    if (!draggingRef.current || !selection) return;
    const target = cellFromEvent(event);
    if (target && (target.r !== selection.focus.r || target.c !== selection.focus.c)) {
      select(selection.anchor, target);
    }
  };

  const handleDoubleClick = (event) => {
    if (!editable || event.target.tagName === 'INPUT') return;
    const target = cellFromEvent(event);
    if (target) startEdit(target.r, target.c);
  };

  const inRect = (r, c) => Boolean(rect) && r >= rect.r1 && r <= rect.r2 && c >= rect.c1 && c <= rect.c2;
  const rowActive = (r) => Boolean(rect) && r >= rect.r1 && r <= rect.r2;
  const colActive = (c) => Boolean(rect) && c >= rect.c1 && c <= rect.c2;

  const selectRow = (r) => select({ r, c: 0 }, { r, c: colCount - 1 });
  const selectCol = (c) => select({ r: 0, c }, { r: rowCount - 1, c });
  const selectAll = () => select({ r: 0, c: 0 }, { r: rowCount - 1, c: colCount - 1 });

  // Click derecho: si cae fuera de la selección actual, la selección pasa a ser lo clickeado (celda,
  // fila o columna completa, según dónde); si cae dentro, se conserva para actuar sobre todo el rango.
  const handleContextMenu = (event) => {
    const cell = event.target.closest('[data-r]');
    const rowHead = event.target.closest('[data-rh]');
    const colHead = event.target.closest('[data-ch]');
    if (!cell && !rowHead && !colHead) return;
    event.preventDefault();
    if (editingRef.current && editingRef.current.mode === 'text') finishEdit(true);
    event.currentTarget.focus({ preventScroll: true });
    if (cell) {
      const target = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
      if (!inRect(target.r, target.c)) select(target, target);
    } else if (rowHead) {
      const r = Number(rowHead.dataset.rh);
      if (!(rect && rect.c1 === 0 && rect.c2 === colCount - 1 && rowActive(r))) selectRow(r);
    } else {
      const c = Number(colHead.dataset.ch);
      if (!(rect && rect.r1 === 0 && rect.r2 === rowCount - 1 && colActive(c))) selectCol(c);
    }
    onContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleKeyDown = (event) => {
    if (editingRef.current) return;
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    if (mod && key === 'c') {
      event.preventDefault();
      onCopy();
      return;
    }
    if (mod && key === 'a') {
      event.preventDefault();
      selectAll();
      return;
    }

    if (editable) {
      if (mod && key === 'x') {
        event.preventDefault();
        onCopy();
        onClearSelection();
        return;
      }
      if (mod && key === 'z') {
        event.preventDefault();
        if (event.shiftKey) onRedo();
        else onUndo();
        return;
      }
      if (mod && key === 'y') {
        event.preventDefault();
        onRedo();
        return;
      }
      if (selection && !mod && !event.altKey) {
        if (event.key === 'Enter' || event.key === 'F2') {
          event.preventDefault();
          startEdit(selection.focus.r, selection.focus.c);
          return;
        }
        if (event.key === 'Delete' || event.key === 'Backspace') {
          event.preventDefault();
          onClearSelection();
          return;
        }
        if (event.key.length === 1) {
          event.preventDefault();
          startEdit(selection.focus.r, selection.focus.c, event.key);
          return;
        }
      }
    }

    const delta = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }[event.key];
    const dirName = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[event.key];
    const page = event.key === 'PageDown' ? visibleCount - 1 : event.key === 'PageUp' ? -(visibleCount - 1) : 0;
    if (!delta && !page) return;
    event.preventDefault();
    // Sin selección, las teclas mueven el contenido; con selección mueven el cursor (y siguen su rastro).
    if (!selection) {
      if (dirName) scrollStep(dirName);
      else scrollStep(page > 0 ? 'down' : 'up', false, 3);
      return;
    }
    const from = selection.focus;
    const next = {
      r: Math.min(rowCount - 1, Math.max(0, from.r + (delta ? delta[0] : page))),
      c: Math.min(colCount - 1, Math.max(0, from.c + (delta ? delta[1] : 0))),
    };
    scrollRowIntoView(next.r);
    scrollColIntoView(next.c);
    if (event.shiftKey && selection) select(selection.anchor, next);
    else select(next, next);
  };

  const handlePaste = (event) => {
    if (!editable || editingRef.current) return;
    const text = event.clipboardData?.getData('text/plain');
    if (!text) return;
    event.preventDefault();
    onPasteText(text);
  };

  if (!hasData) {
    return <div className={styles.empty}>{emptyLabel}</div>;
  }

  const bodyRows = [];
  for (let r = first; r < last; r++) {
    const row = rows[r] || [];
    const cells = [];
    for (let c = 0; c < colCount; c++) {
      const value = row[c] ?? '';
      const isFocus = selection && selection.focus.r === r && selection.focus.c === c;
      const selected = inRect(r, c);
      const isEditingCell = editing && editing.mode === 'text' && editing.r === r && editing.c === c;
      const corner = selected
        ? `${r === rect.r1 && c === rect.c1 ? styles.cellTL : ''} ${r === rect.r1 && c === rect.c2 ? styles.cellTR : ''} ${r === rect.r2 && c === rect.c1 ? styles.cellBL : ''} ${r === rect.r2 && c === rect.c2 ? styles.cellBR : ''}`
        : '';
      cells.push(
        <td
          key={c}
          data-r={r}
          data-c={c}
          className={`${styles.cell} ${selected ? styles.cellSelected : ''} ${corner} ${isFocus ? styles.cellFocus : ''} ${isEditingCell ? styles.cellEditing : ''}`}
          title={!isEditingCell && String(value).length * 7 > colWidths[c] ? String(value) : undefined}
        >
          {isEditingCell ? (
            <input
              ref={editorRef}
              className={styles.editor}
              value={editing.draft}
              spellCheck={false}
              onChange={(event) => {
                draftRef.current = event.target.value;
                setEditing((prev) => (prev ? { ...prev, draft: event.target.value } : prev));
              }}
              onKeyDown={handleEditorKeyDown}
              onBlur={() => finishEdit(true)}
            />
          ) : (
            value
          )}
        </td>,
      );
    }
    bodyRows.push(
      <tr key={r} style={{ height: rowHeightOf(r, rowOverrides) }}>
        <th
          scope="row"
          data-rh={r}
          className={`${styles.rowHeader} ${styles.resizableHeader} ${rowActive(r) ? styles.headerActive : ''}`}
          onClick={(event) => {
            if (event.target.closest('[role="separator"]')) return; // el borde de agarre no selecciona
            selectRow(r);
          }}
        >
          <Resizable
            direction="vertical"
            size={rowHeightOf(r, rowOverrides) - XLSX_RESIZE_HANDLE - 1}
            defaultSize={XLSX_ROW_HEIGHT - XLSX_RESIZE_HANDLE - 1}
            minSize={XLSX_ROW_MIN_HEIGHT - XLSX_RESIZE_HANDLE - 1}
            maxSize={XLSX_ROW_MAX_HEIGHT - XLSX_RESIZE_HANDLE - 1}
            handleSize={XLSX_RESIZE_HANDLE}
            handleLabel={`Alto de la fila ${r + 1}`}
            showGrip={false}
            lineColor="transparent"
            lineActiveColor={accentColor}
            onSizeChange={(next) => setRowHeight(r, next + XLSX_RESIZE_HANDLE + 1)}
          >
            <span className={styles.headerLabel}>{r + 1}</span>
          </Resizable>
        </th>
        {cells}
      </tr>,
    );
  }

  // Alto = el de la hoja (hasta el máximo): al cambiar a una hoja más corta/larga el contenedor anima el
  // cambio (transition de height en .heightAnim) en vez de saltar.
  const height = Math.min(XLSX_VIEWPORT_HEIGHT, totalRowsHeight + XLSX_ROW_HEIGHT + 2);

  return (
    <div
      ref={wrapRef}
      className={styles.focusWrap}
      tabIndex={0}
      role="grid"
      aria-rowcount={rowCount}
      aria-colcount={colCount}
      aria-readonly={editable ? undefined : 'true'}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      onPaste={handlePaste}
    >
      <ScrollBar scrollAreaRef={scrollRef} className={styles.heightAnim} style={{ height }}>
        <table className={styles.table} style={{ width: '100%', minWidth: totalWidth }}>
          <colgroup>
            <col style={{ width: XLSX_ROWNUM_WIDTH }} />
            {colWidths.map((w, c) => (
              <col key={c} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr style={{ height: XLSX_ROW_HEIGHT }}>
              <th className={styles.corner} onClick={selectAll} aria-label="Seleccionar todo" />
              {colWidths.map((_, c) => (
                <th
                  key={c}
                  scope="col"
                  data-ch={c}
                  className={`${styles.colHeader} ${styles.resizableHeader} ${colActive(c) ? styles.headerActive : ''}`}
                  onClick={(event) => {
                    if (event.target.closest('[role="separator"]')) return; // el borde de agarre no selecciona
                    selectCol(c);
                  }}
                >
                  <Resizable
                    direction="horizontal"
                    size={colWidths[c] - XLSX_RESIZE_HANDLE - 1}
                    defaultSize={autoColWidths[c] - XLSX_RESIZE_HANDLE - 1}
                    minSize={XLSX_COL_MIN_WIDTH - XLSX_RESIZE_HANDLE - 1}
                    maxSize={XLSX_COL_MAX_WIDTH - XLSX_RESIZE_HANDLE - 1}
                    handleSize={XLSX_RESIZE_HANDLE}
                    handleLabel={`Ancho de la columna ${colLabel(c)}`}
                    showGrip={false}
                    lineColor="transparent"
                    lineActiveColor={accentColor}
                    style={{ height: XLSX_ROW_HEIGHT - 1 }}
                    onSizeChange={(next) => setColWidth(c, next + XLSX_RESIZE_HANDLE + 1)}
                  >
                    <span className={styles.headerLabel}>{colLabel(c)}</span>
                  </Resizable>
                </th>
              ))}
            </tr>
          </thead>
          <tbody onMouseDown={handleMouseDown} onMouseOver={handleMouseOver} onDoubleClick={handleDoubleClick}>
            {topSpacer > 0 && (
              <tr aria-hidden="true" style={{ height: topSpacer }}>
                <td colSpan={colCount + 1} className={styles.spacer} />
              </tr>
            )}
            {bodyRows}
            {bottomSpacer > 0 && (
              <tr aria-hidden="true" style={{ height: bottomSpacer }}>
                <td colSpan={colCount + 1} className={styles.spacer} />
              </tr>
            )}
          </tbody>
        </table>
      </ScrollBar>

      {['up', 'down', 'left', 'right'].map(
        (dir) =>
          edges[dir] && (
            <ScrollArrow
              key={dir}
              direction={dir}
              label={ARROW_LABELS[dir]}
              onStep={(repeat) => scrollStep(dir, repeat)}
            />
          ),
      )}

      {editing && editing.mode === 'date' && (
        <AnchoredCalendar
          rect={editing.rect}
          value={editing.ymd ? `${editing.ymd.y}-${String(editing.ymd.m).padStart(2, '0')}-${String(editing.ymd.d).padStart(2, '0')}` : ''}
          onPick={pickDate}
          onClose={closeDate}
          accentColor={accentColor}
          bgColor={bgColor}
          textColor={textColor}
          borderColor={borderColor}
        />
      )}
    </div>
  );
});

export default XlsxGrid;
