import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Loading from '../../../Loading/index';
import ErrorState from '../../../ErrorState/index';
import { XlsxGrid, XlsxControlsBar, XlsxContextMenu, XlsxStatsPanel, XlsxValidationPanel } from './components/index.js';
import styles from './index.module.css';
import {
  DEFAULT_XLSX_ERROR_LABEL,
  DEFAULT_XLSX_ACCENT,
  DEFAULT_XLSX_TEXT_COLOR,
  DEFAULT_XLSX_BG_COLOR,
  DEFAULT_XLSX_HEADER_BG_COLOR,
  DEFAULT_XLSX_BORDER_COLOR,
  DEFAULT_XLSX_ERROR_COLOR,
  DEFAULT_XLSX_JSON_SHEET_NAME,
  DEFAULT_XLSX_JSON_FILE_NAME,
  DEFAULT_XLSX_VALIDATION_LABELS,
  XLSX_VALIDATION_NOTICE_MS,
  DEFAULT_XLSX_COPY_LABEL,
  DEFAULT_XLSX_COPIED_LABEL,
  DEFAULT_XLSX_EMPTY_LABEL,
  DEFAULT_XLSX_SAVE_LABEL,
  DEFAULT_XLSX_UNDO_LABEL,
  DEFAULT_XLSX_NEW_ROWS,
  DEFAULT_XLSX_NEW_COLS,
  DEFAULT_XLSX_ADD_SHEET_LABEL,
  XLSX_ADD_ROWS_STEP,
  XLSX_NEW_SHEET_PREFIX,
  DEFAULT_XLSX_REDO_LABEL,
  XLSX_COPIED_FEEDBACK_MS,
  XLSX_HISTORY_LIMIT,
  XLSX_BULK_EDIT_CAP,
  DEFAULT_XLSX_MENU_LABELS,
  DEFAULT_XLSX_STATS_LABELS,
  XLSX_STATS_NOTICE_MS,
  DEFAULT_LOADING_VARIANT,
  DEFAULT_LOADING_SIZE,
} from '../../constants.js';
import {
  parseWorkbook, computeColWidths, normalizeSelection, selectionToTsv, extractRows, toCsv, toJson, colLabel,
  parseTsv, formatNumber,
} from './utils.js';
import useCopyToClipboard from '../../../../../common/hooks/useCopyToClipboard';
import downloadBlob from '../../../../../common/utils/downloadBlob';
import {
  getEditInfo, inputToCell, dateToCell, nowToCell, writeCell, getCell, selectionStats, rectToA1, workbookToBlob,
  makeBlankSheet, nextSheetName, validSheetName, renameSheetInWorkbook, appendRows,
} from './javascript/model.js';
import { loadFormulaParser, indexFormulas, recalcAll } from './javascript/engine.js';
import { findRule, failureOf, reasonFor, parseRuleRange } from './javascript/validation.js';
import { buildSheetFromJson, sheetToJson } from './javascript/json.js';

// TSV con la fila 1 (encabezados) antepuesta si la selección no la incluye.
const toTsvWithHeaders = (rows, rect) =>
  extractRows(rows, rect, { withHeaders: true })
    .map((row) => row.map((v) => (/[\t\r\n"]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join('\t'))
    .join('\n');

// Visor de hojas de cálculo (.xlsx, .xls, .csv). SheetJS se importa dinámicamente (es un peer opcional, como
// pdfjs-dist) para no pagar su costo en quien nunca muestra una planilla. Las filas se virtualizan en
// XlsxGrid, así que hojas con decenas de miles de filas siguen siendo fluidas; el parseo del archivo en sí
// corre en el hilo principal.
//
// Con `editable` se pueden modificar las celdas (texto, números, fechas con CalendarPicker y fórmulas =SUM(...)
// evaluadas con fast-formula-parser, también peer opcional), con deshacer/rehacer, pegado desde Excel y
// guardado del archivo editado. Los datos viven en `ctxRef` (workbook de SheetJS); `version` solo fuerza el
// re-render porque las ediciones mutan en el lugar para no copiar hojas de 100k filas en cada tecla.
const XlsxViewer = ({
  url,
  fileName,
  openLabel,
  downloadLabel,
  errorLabel = DEFAULT_XLSX_ERROR_LABEL,
  copyLabel = DEFAULT_XLSX_COPY_LABEL,
  copiedLabel = DEFAULT_XLSX_COPIED_LABEL,
  emptyLabel = DEFAULT_XLSX_EMPTY_LABEL,
  saveLabel = DEFAULT_XLSX_SAVE_LABEL,
  menuLabels,
  statsLabels,
  data,
  schema,
  sheetName = DEFAULT_XLSX_JSON_SHEET_NAME,
  validations,
  validationLabels,
  errorColor = DEFAULT_XLSX_ERROR_COLOR,
  editable: editableProp = false,
  createNew = false,
  newRows = DEFAULT_XLSX_NEW_ROWS,
  newCols = DEFAULT_XLSX_NEW_COLS,
  addSheetLabel = DEFAULT_XLSX_ADD_SHEET_LABEL,
  onChange,
  onSave,
  accentColor = DEFAULT_XLSX_ACCENT,
  textColor = DEFAULT_XLSX_TEXT_COLOR,
  bgColor = DEFAULT_XLSX_BG_COLOR,
  headerBgColor = DEFAULT_XLSX_HEADER_BG_COLOR,
  borderColor = DEFAULT_XLSX_BORDER_COLOR,
  loadingVariant = DEFAULT_LOADING_VARIANT,
  loadingSize = DEFAULT_LOADING_SIZE,
}) => {
  const fromJson = Array.isArray(data); // planilla armada desde JSON (+ JSON Schema), sin archivo detrás
  const editable = editableProp || createNew; // una planilla nueva siempre es editable
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [selection, setSelection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [statsNotice, setStatsNotice] = useState('');
  const [sizesTick, setSizesTick] = useState(0); // fuerza el re-render cuando cambia el tamaño de una columna/fila
  const [validationNotice, setValidationNotice] = useState('');
  const validationTimer = useRef(null);
  const noticeTimer = useRef(null);
  const [, setVersion] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [historySize, setHistorySize] = useState({ undo: 0, redo: 0 });
  const { copied, copy } = useCopyToClipboard({ resetMs: XLSX_COPIED_FEEDBACK_MS });
  const ctxRef = useRef(null);
  const gridRef = useRef(null);
  const historyRef = useRef({ undo: [], redo: [] });

  const bump = () => setVersion((v) => v + 1);
  const syncHistory = () =>
    setHistorySize({ undo: historyRef.current.undo.length, redo: historyRef.current.redo.length });

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setSheets([]);
    setActiveSheet(0);
    setSelection(null);
    setMenuPosition(null);
    setDirty(false);
    historyRef.current = { undo: [], redo: [] };
    syncHistory();
    ctxRef.current = null;

    (async () => {
      try {
        if (fromJson) {
          // Planilla desde JSON: columnas y validaciones salen del JSON Schema; no se descarga nada.
          const [XLSX, FormulaParser] = await Promise.all([import('xlsx'), editable ? loadFormulaParser() : null]);
          if (cancelled) return;
          const jsonSheet = buildSheetFromJson(XLSX, { data, schema, name: sheetName });
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, jsonSheet.ws, jsonSheet.name);
          ctxRef.current = { XLSX, FormulaParser, wb, sheets: [jsonSheet] };
          applyInitialValidations(XLSX, [jsonSheet], { keepExisting: true });
          setSheets([jsonSheet]);
          setIsLoading(false);
          return;
        }
        if (createNew) {
          // Planilla nueva: libro en blanco con una hoja, sin descargar nada.
          const [XLSX, FormulaParser] = await Promise.all([import('xlsx'), loadFormulaParser()]);
          if (cancelled) return;
          const blank = makeBlankSheet(XLSX, `${XLSX_NEW_SHEET_PREFIX}1`, newRows, newCols);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, blank.ws, blank.name);
          ctxRef.current = { XLSX, FormulaParser, wb, sheets: [blank] };
          setSheets([blank]);
          setIsLoading(false);
          return;
        }
        const [XLSX, response, FormulaParser] = await Promise.all([
          import('xlsx'),
          fetch(url),
          editable ? loadFormulaParser() : null,
        ]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        const { wb, sheets: parsed } = parseWorkbook(XLSX, buffer);
        if (cancelled) return;
        parsed.forEach((sheet) => indexFormulas(XLSX, sheet));
        applyInitialValidations(XLSX, parsed);
        ctxRef.current = { XLSX, FormulaParser, wb, sheets: parsed };
        recalcAll(ctxRef.current); // archivos generados sin valores cacheados muestran el resultado real, no 0
        setSheets(parsed);
        setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          // Sin este log el motivo real (CORS, 403 por URL firmada vencida, archivo corrupto, falta
          // instalar `xlsx`) queda oculto detrás del mensaje genérico. No se loguea la url (puede ser firmada).
          console.error('[XlsxViewer] No se pudo cargar la hoja de cálculo:', err);
          setHasError(true);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, editable, createNew, data, schema, sheetName]); // data/schema: pasar referencias estables (useMemo/estado)

  useEffect(
    () => () => {
      clearTimeout(noticeTimer.current);
      clearTimeout(validationTimer.current);
    },
    [],
  );

  const ctx = ctxRef.current;
  const sheet = sheets[activeSheet];
  const colCount = sheet ? sheet.colCount : 0;
  const colWidths = useMemo(() => (sheet ? computeColWidths(sheet.rows, sheet.colCount) : []), [sheet, colCount]); // eslint-disable-line react-hooks/exhaustive-deps
  const rect = useMemo(() => normalizeSelection(selection), [selection]);

  const handleSheetChange = (index) => {
    setActiveSheet(index);
    setSelection(null);
  };

  // ---------- copiar
  const copyWith = useCallback(
    async (text) => {
      if (!sheet || !rect) return;
      await copy(text);
    },
    [sheet, rect, copy],
  );

  const handleCopy = useCallback(() => {
    if (sheet && rect) copyWith(selectionToTsv(sheet.rows, rect));
  }, [sheet, rect, copyWith]);

  // ---------- edición
  // Aplica una lista de cambios [{ r, c, cell }] (cell = null borra) sobre la hoja activa, los registra para
  // deshacer y recalcula las fórmulas.
  const applyEdits = (edits) => {
    const context = ctxRef.current;
    const current = context && context.sheets[activeSheet];
    if (!current || !edits.length) return;
    const entries = edits.map(({ r, c, cell }) => ({
      si: activeSheet,
      r,
      c,
      before: writeCell(context, current, r, c, cell),
      after: cell ? { ...cell } : null,
    }));
    recalcAll(context);
    const history = historyRef.current;
    history.undo.push(entries);
    if (history.undo.length > XLSX_HISTORY_LIMIT) history.undo.shift();
    history.redo = [];
    syncHistory();
    setDirty(true);
    bump();
    onChange?.({
      sheet: current.name,
      edits: entries.map((e) => ({ row: e.r, col: e.c, value: e.after ? e.after.v : null, formula: e.after && e.after.f !== undefined ? e.after.f : null })),
    });
  };

  const restore = (from, to) => {
    const context = ctxRef.current;
    const entries = historyRef.current[from].pop();
    if (!context || !entries) return;
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      const target = from === 'undo' ? e.before : e.after;
      writeCell(context, context.sheets[e.si], e.r, e.c, target ? { ...target } : null);
    }
    recalcAll(context);
    historyRef.current[to].push(entries);
    syncHistory();
    setActiveSheet(entries[0].si);
    setDirty(true);
    bump();
  };
  const handleUndo = () => restore('undo', 'redo');
  const handleRedo = () => restore('redo', 'undo');

  // ---------- validación de datos
  const validationLabelsMerged = {
    ...DEFAULT_XLSX_VALIDATION_LABELS,
    ...validationLabels,
    types: { ...DEFAULT_XLSX_VALIDATION_LABELS.types, ...(validationLabels && validationLabels.types) },
    messages: { ...DEFAULT_XLSX_VALIDATION_LABELS.messages, ...(validationLabels && validationLabels.messages) },
  };

  // Reglas iniciales de la prop `validations`: [{ sheet?, range: 'E:E' | 'E2:E50' | 'B2', type, pattern?, message? }].
  function applyInitialValidations(XLSX, parsedSheets, { keepExisting = false } = {}) {
    parsedSheets.forEach((sh) => { sh.validations = keepExisting ? sh.validations || [] : []; });
    (validations || []).forEach((spec) => {
      const targets = spec.sheet ? parsedSheets.filter((sh) => sh.name === spec.sheet) : parsedSheets;
      targets.forEach((sh) => {
        const range = parseRuleRange(XLSX, spec.range, sh);
        if (range) sh.validations.push({ ...range, type: spec.type, pattern: spec.pattern, message: spec.message });
      });
    });
  }

  const showValidationNotice = (text) => {
    setValidationNotice(text);
    clearTimeout(validationTimer.current);
    validationTimer.current = setTimeout(() => setValidationNotice(''), XLSX_VALIDATION_NOTICE_MS);
  };

  // Descarta las ediciones que no cumplen la regla de su celda y avisa cuáles (la primera). Vaciar siempre se permite.
  const filterByValidation = (edits) => {
    if (!ctx || !sheet) return edits;
    const rejected = [];
    const kept = edits.filter((edit) => {
      const rule = findRule(sheet, edit.r, edit.c);
      const code = failureOf(ctx, rule, edit.cell);
      if (code === null) return true;
      rejected.push({ edit, rule, code });
      return false;
    });
    if (rejected.length) {
      const { edit, rule, code } = rejected[0];
      const where = `${colLabel(edit.c)}${edit.r + 1}`;
      const extra = rejected.length > 1 ? ` (+${rejected.length - 1})` : '';
      // Mensaje de la regla; si no tiene, el de su fallo/tipo (así siempre se explica por qué no se guardó).
      showValidationNotice(`${where}: ${reasonFor(rule, code, validationLabelsMerged.messages)}${extra}`);
    }
    return kept;
  };

  const handleApplyValidation = ({ type, pattern, message }) => {
    if (!sheet || !rect) return;
    const rules = sheet.validations || [];
    // Las reglas que quedan completamente dentro del rango nuevo se reemplazan.
    sheet.validations = rules.filter((rule) => !(rule.r1 >= rect.r1 && rule.r2 <= rect.r2 && rule.c1 >= rect.c1 && rule.c2 <= rect.c2));
    if (type !== 'any') sheet.validations.push({ r1: rect.r1, c1: rect.c1, r2: rect.r2, c2: rect.c2, type, pattern, message });
    setMenuPosition(null);
    bump();
  };

  const handleClearValidation = () => {
    if (!sheet || !rect) return;
    sheet.validations = (sheet.validations || []).filter(
      (rule) => rule.r2 < rect.r1 || rule.r1 > rect.r2 || rule.c2 < rect.c1 || rule.c1 > rect.c2,
    );
    setMenuPosition(null);
    bump();
  };

  // Texto tipeado → celda respetando la regla: en columnas de tipo fecha 15/01/2025 pasa a fecha, y en columnas
  // booleanas true/false pasan a booleano real.
  const textToCell = (r, c, text) => {
    const rule = sheet && findRule(sheet, r, c);
    const trimmed = String(text).trim().toLowerCase();
    if (rule && rule.type === 'boolean' && (trimmed === 'true' || trimmed === 'false')) return { t: 'b', v: trimmed === 'true' };
    return inputToCell(ctx, sheet, r, c, text, Boolean(rule && rule.type === 'date'));
  };

  // ¿La celda tiene una regla de tipo fecha? Entonces un texto tipeado/pegado como 15/01/2025 se guarda como fecha.
  const isDateRule = (r, c) => {
    const rule = sheet && findRule(sheet, r, c);
    return Boolean(rule && rule.type === 'date');
  };

  const handleCommit = (r, c, payload) => {
    if (!ctx || !sheet) return;
    let cell;
    if ('text' in payload) {
      if (payload.text === getEditInfo(ctx, sheet, r, c).text) return; // Enter sin cambios: no ensucia el historial
      cell = textToCell(r, c, payload.text);
    } else {
      cell = dateToCell(ctx, sheet, r, c, payload.ymd);
    }
    applyEdits(filterByValidation([{ r, c, cell }]));
  };

  const handleClearSelection = () => {
    if (!ctx || !sheet || !rect) return;
    if ((rect.r2 - rect.r1 + 1) * (rect.c2 - rect.c1 + 1) > XLSX_BULK_EDIT_CAP) return;
    const edits = [];
    for (let r = rect.r1; r <= rect.r2; r++) {
      for (let c = rect.c1; c <= rect.c2; c++) {
        if (getCell(ctx, sheet, r, c)) edits.push({ r, c, cell: null });
      }
    }
    applyEdits(edits);
  };

  // Pegar TSV (copiado de Excel/Sheets/este visor) desde la celda activa; un solo valor se replica en toda la selección.
  const handlePasteText = (text) => {
    if (!ctx || !sheet || !rect) return;
    const matrix = parseTsv(text);
    if (!matrix.length) return;
    const edits = [];
    if (matrix.length === 1 && matrix[0].length === 1 && (rect.r2 > rect.r1 || rect.c2 > rect.c1)) {
      if ((rect.r2 - rect.r1 + 1) * (rect.c2 - rect.c1 + 1) > XLSX_BULK_EDIT_CAP) return;
      for (let r = rect.r1; r <= rect.r2; r++) {
        for (let c = rect.c1; c <= rect.c2; c++) edits.push({ r, c, cell: textToCell(r, c, matrix[0][0]) });
      }
    } else {
      if (matrix.length * Math.max(...matrix.map((row) => row.length)) > XLSX_BULK_EDIT_CAP) return;
      matrix.forEach((row, i) => {
        row.forEach((value, j) => {
          const r = rect.r1 + i;
          const c = rect.c1 + j;
          edits.push({ r, c, cell: textToCell(r, c, value) });
        });
      });
    }
    applyEdits(filterByValidation(edits));
  };

  // Autosuma: bajo cada columna seleccionada escribe =SUM(rango seleccionado de esa columna).
  const handleAutosum = () => {
    if (!ctx || !ctx.FormulaParser || !sheet || !rect) return;
    const edits = [];
    for (let c = rect.c1; c <= rect.c2; c++) {
      edits.push({ r: rect.r2 + 1, c, cell: { t: 'n', v: 0, f: `SUM(${rectToA1(ctx.XLSX, rect.r1, c, rect.r2, c)})` } });
    }
    applyEdits(edits);
  };

  // ---------- hojas y filas (planilla nueva o editable)
  const handleAddSheet = () => {
    const context = ctxRef.current;
    if (!context) return;
    const blank = makeBlankSheet(context.XLSX, nextSheetName(context.sheets), newRows, newCols);
    context.XLSX.utils.book_append_sheet(context.wb, blank.ws, blank.name);
    context.sheets.push(blank);
    setSheets([...context.sheets]);
    setActiveSheet(context.sheets.length - 1);
    setSelection(null);
    setDirty(true);
  };

  // Devuelve true si el nombre era válido y se aplicó (el input de la pestaña vuelve a su estado normal).
  const handleRenameSheet = (index, raw) => {
    const context = ctxRef.current;
    if (!context) return false;
    const name = validSheetName(context.sheets, index, raw);
    if (!name) return false;
    if (name === context.sheets[index].name) return true;
    renameSheetInWorkbook(context, index, name);
    setSheets([...context.sheets]);
    setDirty(true);
    return true;
  };

  const handleAddRows = () => {
    if (!ctx || !sheet) return;
    appendRows(ctx, sheet, XLSX_ADD_ROWS_STEP);
    setDirty(true);
    bump();
  };

  // Inserta un resultado de la calculadora como fórmula: debajo de cada columna, a la derecha de cada fila o en
  // una sola celda debajo de la selección (con todo el rango).
  const handleInsertStat = (fn, destination) => {
    if (!ctx || !ctx.FormulaParser || !sheet || !rect) return;
    const { XLSX } = ctx;
    const edits = [];
    if (destination === 'below') {
      for (let c = rect.c1; c <= rect.c2; c++) {
        edits.push({ r: rect.r2 + 1, c, cell: { t: 'n', v: 0, f: `${fn}(${rectToA1(XLSX, rect.r1, c, rect.r2, c)})` } });
      }
    } else if (destination === 'right') {
      for (let r = rect.r1; r <= rect.r2; r++) {
        edits.push({ r, c: rect.c2 + 1, cell: { t: 'n', v: 0, f: `${fn}(${rectToA1(XLSX, r, rect.c1, r, rect.c2)})` } });
      }
    } else {
      edits.push({ r: rect.r2 + 1, c: rect.c1, cell: { t: 'n', v: 0, f: `${fn}(${rectToA1(XLSX, rect.r1, rect.c1, rect.r2, rect.c2)})` } });
    }
    applyEdits(edits);
    const first = edits[0];
    const last = edits[edits.length - 1];
    gridRef.current?.scrollToCell(last.r, last.c);
    const where = edits.length === 1 ? `${colLabel(first.c)}${first.r + 1}` : `${colLabel(first.c)}${first.r + 1}:${colLabel(last.c)}${last.r + 1}`;
    setStatsNotice(`${statsLabelsMerged.inserted} ${where}`);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setStatsNotice(''), XLSX_STATS_NOTICE_MS);
  };

  const handleSave = () => {
    if (!ctx) return;
    const name = fileName || (fromJson ? DEFAULT_XLSX_JSON_FILE_NAME : createNew ? 'planilla.xlsx' : 'hoja.xlsx');
    const blob = workbookToBlob(ctx, name);
    // `data`: con una planilla desde JSON, los registros actuales (tipados, con las claves del esquema).
    if (onSave) onSave({ blob, fileName: name, workbook: ctx.wb, data: fromJson && sheet ? sheetToJson(ctx, sheet) : undefined });
    else downloadBlob(blob, name);
    setDirty(false);
  };

  const statsLabelsMerged = { ...DEFAULT_XLSX_STATS_LABELS, ...statsLabels };

  // ---------- menú contextual
  const labels = { ...DEFAULT_XLSX_MENU_LABELS, ...menuLabels };

  // Qué hay en la celda sobre la que se abre el menú (solo con una celda seleccionada): una fecha (real o en texto
  // ISO) ofrece «Editar fecha»; una celda vacía ofrece elegir/insertar fecha de una vez.
  let menuCellKind = 'other';
  if (ctx && sheet && rect && selection && rect.r1 === rect.r2 && rect.c1 === rect.c2) {
    const focusCell = getCell(ctx, sheet, selection.focus.r, selection.focus.c);
    if (!focusCell || focusCell.v === undefined || focusCell.v === null || focusCell.v === '') menuCellKind = 'empty';
    else if (getEditInfo(ctx, sheet, selection.focus.r, selection.focus.c).kind === 'date') menuCellKind = 'date';
  }

  const handleMenuAction = (action) => {
    if (!sheet || !rect) return;
    const { rows } = sheet;
    if (action === 'copy') copyWith(selectionToTsv(rows, rect));
    else if (action === 'cut') {
      copyWith(selectionToTsv(rows, rect));
      handleClearSelection();
    } else if (action === 'copyWithHeaders') copyWith(toTsvWithHeaders(rows, rect));
    else if (action === 'copyCsv') copyWith(toCsv(extractRows(rows, rect)));
    else if (action === 'copyJson') copyWith(toJson(rows, rect));
    else if (action === 'edit') gridRef.current?.startEdit(selection.focus.r, selection.focus.c);
    else if (action === 'editDate') gridRef.current?.startEdit(selection.focus.r, selection.focus.c, undefined, true);
    else if (action === 'insertToday' || action === 'insertNow') {
      const { r, c } = selection.focus;
      applyEdits(filterByValidation([{ r, c, cell: nowToCell(ctx, sheet, r, c, action === 'insertNow') }]));
    } else if (action === 'clear') handleClearSelection();
    else if (action === 'autosum') handleAutosum();
    else if (action === 'addRows') handleAddRows();
    else if (action === 'selectRow') setSelection({ anchor: { r: rect.r1, c: 0 }, focus: { r: rect.r2, c: sheet.colCount - 1 } });
    else if (action === 'selectColumn') setSelection({ anchor: { r: 0, c: rect.c1 }, focus: { r: rows.length - 1, c: rect.c2 } });
    else if (action === 'selectAll') setSelection({ anchor: { r: 0, c: 0 }, focus: { r: rows.length - 1, c: sheet.colCount - 1 } });
  };

  // ---------- resumen de la barra: dirección de la celda, tamaño de la selección o, si hay números, la calculadora
  const stats = useMemo(
    () => (ctx && sheet && rect ? selectionStats(ctx, sheet, rect) : null),
    [ctx, sheet, rect, historySize, dirty], // eslint-disable-line react-hooks/exhaustive-deps
  );

  let summary = '';
  let summaryTitle;
  if (stats && stats.count >= 2) {
    summary = `Suma ${formatNumber(stats.sum)} · Prom ${formatNumber(stats.avg)} · Cont ${stats.count}`;
    summaryTitle = `Suma ${formatNumber(stats.sum)} · Promedio ${formatNumber(stats.avg)} · Mín ${formatNumber(stats.min)} · Máx ${formatNumber(stats.max)} · ${stats.count} números`;
  } else if (sheet && rect) {
    const rowsSel = rect.r2 - rect.r1 + 1;
    const colsSel = rect.c2 - rect.c1 + 1;
    summary =
      rowsSel === 1 && colsSel === 1
        ? `${colLabel(rect.c1)}${rect.r1 + 1}`
        : `${rowsSel} × ${colsSel}`;
  } else if (sheet) {
    summary = `${sheet.rows.length.toLocaleString()} × ${sheet.colCount.toLocaleString()}`;
  }

  const statsRangeLabel = rect
    ? rect.r1 === rect.r2 && rect.c1 === rect.c2
      ? `${colLabel(rect.c1)}${rect.r1 + 1}`
      : `${colLabel(rect.c1)}${rect.r1 + 1}:${colLabel(rect.c2)}${rect.r2 + 1}`
    : '';

  const cssVars = {
    '--xlsx-accent': accentColor,
    '--xlsx-text': textColor,
    '--xlsx-bg': bgColor,
    '--xlsx-header-bg': headerBgColor,
    '--xlsx-border': borderColor,
    '--xlsx-error': errorColor,
  };

  return (
    <div className={styles.xlsxViewer} style={cssVars}>
      <div className={styles.gridArea} style={{ backgroundColor: bgColor, minHeight: isLoading || hasError ? 160 : undefined }}>
        {validationNotice && (
          <div className={styles.validationNotice} role="alert">{validationNotice}</div>
        )}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <Loading variant={loadingVariant} size={loadingSize} color={accentColor} />
          </div>
        )}
        {hasError && (
          <ErrorState
            errorLabel={errorLabel}
            actionLabel={openLabel}
            onAction={() => window.open(url, '_blank', 'noopener,noreferrer')}
            textColor={textColor}
          />
        )}
        {sheet && (
          <XlsxGrid
            ref={gridRef}
            rows={sheet.rows}
            colCount={sheet.colCount}
            colWidths={colWidths}
            sizes={sheet.sizes || (sheet.sizes = { cols: {}, rows: {} })}
            sizesTick={sizesTick}
            onSizesChange={() => setSizesTick((t) => t + 1)}
            selection={selection}
            onSelectionChange={setSelection}
            onCopy={handleCopy}
            onContextMenu={setMenuPosition}
            emptyLabel={emptyLabel}
            editable={editable}
            getEditInfo={(r, c) => getEditInfo(ctx, sheet, r, c)}
            onCommit={handleCommit}
            onClearSelection={handleClearSelection}
            onPasteText={handlePasteText}
            onUndo={handleUndo}
            onRedo={handleRedo}
            accentColor={accentColor}
            bgColor={bgColor}
            textColor={textColor}
            borderColor={borderColor}
          />
        )}
      </div>

      <XlsxContextMenu
        position={menuPosition}
        onClose={() => setMenuPosition(null)}
        onAction={handleMenuAction}
        labels={labels}
        editable={editable}
        canAutosum={Boolean(ctx && ctx.FormulaParser)}
        cellKind={menuCellKind}
        validationPanel={
          sheet && rect ? (
            <XlsxValidationPanel
              rangeLabel={statsRangeLabel}
              initial={findRule(sheet, rect.r1, rect.c1)}
              labels={validationLabelsMerged}
              onApply={handleApplyValidation}
              onClear={handleClearValidation}
              onClose={() => setMenuPosition(null)}
              bgColor={bgColor}
              textColor={textColor}
              accentColor={accentColor}
              borderColor={borderColor}
            />
          ) : null
        }
        bgColor={bgColor}
        textColor={textColor}
        accentColor={accentColor}
        borderColor={borderColor}
      />

      {statsOpen && sheet && (
        <XlsxStatsPanel
          stats={stats}
          rangeLabel={statsRangeLabel}
          getAnchorRect={() => gridRef.current?.getAnchorRect() || null}
          canInsert={Boolean(editable && ctx && ctx.FormulaParser && rect)}
          onInsert={handleInsertStat}
          onClose={() => setStatsOpen(false)}
          labels={statsLabelsMerged}
          notice={statsNotice}
          accentColor={accentColor}
          textColor={textColor}
          bgColor={bgColor}
          headerBgColor={headerBgColor}
          borderColor={borderColor}
        />
      )}

      {!hasError && !isLoading && (
        <XlsxControlsBar
          sheets={sheets}
          activeSheet={activeSheet}
          onSheetChange={handleSheetChange}
          summary={summary}
          summaryTitle={summaryTitle}
          statsOpen={statsOpen}
          onToggleStats={() => setStatsOpen((open) => !open)}
          statsLabel={statsLabelsMerged.button}
          canCopy={Boolean(rect)}
          copied={copied}
          onCopy={handleCopy}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
          editable={editable}
          dirty={dirty}
          canUndo={historySize.undo > 0}
          canRedo={historySize.redo > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onAddSheet={editable ? handleAddSheet : undefined}
          onRenameSheet={editable ? handleRenameSheet : undefined}
          addSheetLabel={addSheetLabel}
          saveLabel={saveLabel}
          undoLabel={DEFAULT_XLSX_UNDO_LABEL}
          redoLabel={DEFAULT_XLSX_REDO_LABEL}
          downloadUrl={createNew || fromJson ? undefined : url}
          downloadLabel={downloadLabel}
          fileName={fileName}
          accentColor={accentColor}
          textColor={textColor}
          bgColor={headerBgColor}
        />
      )}
    </div>
  );
};

export default XlsxViewer;
