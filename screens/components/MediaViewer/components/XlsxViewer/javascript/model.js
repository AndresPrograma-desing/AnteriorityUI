// Modelo de edición del visor de hojas de cálculo. La grilla pinta `sheet.rows` (texto ya formateado,
// rápido para miles de filas); el dato real vive en `sheet.ws` (la hoja de SheetJS), y toda edición pasa
// por acá para mantener ambos sincronizados. `ctx` = { XLSX, FormulaParser|null, wb, sheets }.
import {
  XLSX_NEW_SHEET_PREFIX,
  XLSX_SHEET_NAME_MAX,
  XLSX_STATS_CELL_CAP,
  XLSX_DEFAULT_DATE_FORMAT,
  XLSX_COLUMN_KIND_SAMPLE,
} from '../../../constants.js';

const NUMBER_RE = /^[-+]?(\d+([.,]\d+)?|[.,]\d+)$/;

export const addrOf = (XLSX, r, c) => XLSX.utils.encode_cell({ r, c });

export function isDateCell(XLSX, cell) {
  return Boolean(cell) && cell.t === 'n' && typeof cell.z === 'string' && XLSX.SSF.is_date(cell.z);
}

// Texto que muestra la grilla para una celda (respetando su formato numérico/fecha).
export function displayOf(XLSX, cell) {
  if (!cell || cell.v === undefined || cell.v === null || cell.v === '') return '';
  if (cell.t === 'n') {
    if (cell.z && cell.z !== 'General') {
      try {
        return XLSX.SSF.format(cell.z, cell.v);
      } catch {
        return String(cell.v);
      }
    }
    // Formato General: como Excel, hasta 15 cifras significativas (evita 0.1+0.2 = 0.30000000000000004).
    return String(Number(cell.v.toPrecision(15)));
  }
  if (cell.t === 'b') return cell.v ? 'TRUE' : 'FALSE';
  return String(cell.v);
}

export const serialToYmd = (XLSX, serial) => {
  const d = XLSX.SSF.parse_date_code(serial);
  return d ? { y: d.y, m: d.m, d: d.d } : null;
};

export const ymdToSerial = ({ y, m, d }) => Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000);

export const ymdToIso = ({ y, m, d }) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

// "15/01/2025", "15-1-25", "2025-01-15" -> { y, m, d } (día/mes/año, como en es-AR) o null si no es una fecha válida.
export function parseDateText(text) {
  let y;
  let m;
  let d;
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    [, y, m, d] = match;
  } else {
    match = text.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
    if (!match) return null;
    [, d, m, y] = match;
    if (y.length === 2) y = `20${y}`;
  }
  y = Number(y);
  m = Number(m);
  d = Number(d);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
  return { y, m, d };
}

// Texto ISO tipo "2026-10-25", "2026-10-25T14:30:00" o "2026-10-25T14:30:00.000Z" (así exportan fechas muchas APIs
// y bases de datos) -> { ymd, rest } donde `rest` es la parte de hora que sigue a la fecha ('' si no hay). null si no es.
const ISO_TEXT_RE = /^(\d{4})-(\d{2})-(\d{2})((?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?)$/;
export function parseIsoDateText(text) {
  const match = typeof text === 'string' ? text.trim().match(ISO_TEXT_RE) : null;
  if (!match) return null;
  const [y, m, d] = [match[1], match[2], match[3]].map(Number);
  const daysInMonth = [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (m < 1 || m > 12 || d < 1 || d > daysInMonth[m - 1]) return null;
  return { ymd: { y, m, d }, rest: match[4] };
}

export const isDateText = (cell) => Boolean(cell) && cell.t === 's' && parseIsoDateText(cell.v) !== null;

const isoOf = ({ y, m, d }) => `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export const getCell = (ctx, sheet, r, c) => sheet.ws[addrOf(ctx.XLSX, r, c)];

// 'date' si la mayoría de las celdas con dato de esa columna (sin contar los encabezados) son fechas: así una
// celda vacía en una columna de fechas también abre el calendario.
export function columnKind(ctx, sheet, c) {
  let dates = 0;
  let others = 0;
  const limit = Math.min(sheet.rows.length, XLSX_COLUMN_KIND_SAMPLE + 1);
  for (let r = 1; r < limit; r++) {
    const cell = getCell(ctx, sheet, r, c);
    if (!cell || cell.v === undefined || cell.v === '') continue;
    if (isDateCell(ctx.XLSX, cell) || isDateText(cell)) dates += 1;
    else others += 1;
  }
  return dates > 0 && dates >= others ? 'date' : 'other';
}

// Cómo se escriben las fechas en una columna, según la primera fecha de muestra: formato numérico de fecha
// ({ z }) o texto ISO ({ text: true, rest }), para que una fecha nueva se vea igual que sus vecinas.
function columnDateStyle(ctx, sheet, c) {
  const limit = Math.min(sheet.rows.length, XLSX_COLUMN_KIND_SAMPLE + 1);
  for (let r = 1; r < limit; r++) {
    const cell = getCell(ctx, sheet, r, c);
    if (isDateCell(ctx.XLSX, cell)) return { z: cell.z };
    const iso = cell && cell.t === 's' ? parseIsoDateText(cell.v) : null;
    if (iso) return { text: true, rest: iso.rest ? 'T00:00:00' : '' };
  }
  return { z: XLSX_DEFAULT_DATE_FORMAT };
}

// Qué editor corresponde a la celda y con qué contenido arranca (la fórmula si la tiene, el número crudo, etc.).
export function getEditInfo(ctx, sheet, r, c) {
  const cell = getCell(ctx, sheet, r, c);
  if (cell && cell.f !== undefined) return { kind: 'text', text: `=${cell.f}` };
  if (cell && isDateCell(ctx.XLSX, cell)) return { kind: 'date', ymd: serialToYmd(ctx.XLSX, cell.v), text: displayOf(ctx.XLSX, cell) };
  if (isDateText(cell)) return { kind: 'date', ymd: parseIsoDateText(cell.v).ymd, text: String(cell.v) };
  if (!cell) return { kind: columnKind(ctx, sheet, c) === 'date' ? 'date' : 'text', ymd: null, text: '' };
  if (cell.t === 'n') return { kind: 'text', text: String(cell.v) };
  return { kind: 'text', text: cell.v === undefined || cell.v === null ? '' : String(cell.v) };
}

// Fecha elegida en el calendario -> celda. Respeta cómo estaba escrita la celda (fecha numérica o texto ISO, y su
// hora si la tenía); en una celda vacía copia el estilo de las fechas de su columna.
export function dateToCell(ctx, sheet, r, c, ymd) {
  if (!ymd) return null;
  const prev = getCell(ctx, sheet, r, c);
  if (isDateText(prev)) return { t: 's', v: isoOf(ymd) + parseIsoDateText(prev.v).rest };
  if (isDateCell(ctx.XLSX, prev)) {
    return { t: 'n', v: ymdToSerial(ymd) + (prev.v - Math.floor(prev.v)), z: prev.z }; // conserva la hora
  }
  const style = columnDateStyle(ctx, sheet, c);
  if (style.text) return { t: 's', v: isoOf(ymd) + style.rest };
  return { t: 'n', v: ymdToSerial(ymd), z: style.z };
}

// Fecha (y opcionalmente hora) actual -> celda, con el mismo estilo que dateToCell. Para "Insertar fecha de hoy" y
// "Insertar fecha y hora actual" del menú contextual.
export function nowToCell(ctx, sheet, r, c, withTime = false) {
  const now = new Date();
  const ymd = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
  const pad = (n) => String(n).padStart(2, '0');
  const prev = getCell(ctx, sheet, r, c);
  const style = prev && isDateText(prev) ? { text: true } : prev && isDateCell(ctx.XLSX, prev) ? { z: prev.z } : columnDateStyle(ctx, sheet, c);
  if (style.text) {
    return { t: 's', v: `${isoOf(ymd)}${withTime ? `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : style.rest || ''}` };
  }
  const fraction = withTime ? (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400 : 0;
  const z = withTime && !/h/i.test(style.z) ? `${style.z} hh:mm` : style.z;
  return { t: 'n', v: ymdToSerial(ymd) + fraction, z };
}

// Texto tipeado -> celda: fórmula (=...), fecha (en columnas de fechas), número o texto. '' vacía la celda.
export function inputToCell(ctx, sheet, r, c, text, forceDate = false) {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  if (trimmed.startsWith('=') && trimmed.length > 1 && ctx.FormulaParser) {
    return { t: 'n', v: 0, f: trimmed.slice(1) };
  }
  const prev = getCell(ctx, sheet, r, c);
  if (forceDate || isDateCell(ctx.XLSX, prev) || columnKind(ctx, sheet, c) === 'date') {
    const ymd = parseDateText(trimmed);
    if (ymd) return dateToCell(ctx, sheet, r, c, ymd);
  }
  if (NUMBER_RE.test(trimmed)) {
    const keepFormat = prev && prev.t === 'n' && prev.z && !isDateCell(ctx.XLSX, prev);
    return { t: 'n', v: Number(trimmed.replace(',', '.')), ...(keepFormat ? { z: prev.z } : {}) };
  }
  return { t: 's', v: text };
}

// Escribe (o borra, con cell=null) una celda manteniendo ws, el texto mostrado, el rango y el set de fórmulas.
// Devuelve el contenido anterior (para deshacer).
export function writeCell(ctx, sheet, r, c, cell) {
  const { XLSX } = ctx;
  const addr = addrOf(XLSX, r, c);
  const before = sheet.ws[addr] ? { ...sheet.ws[addr] } : null;

  if (cell) sheet.ws[addr] = cell;
  else delete sheet.ws[addr];

  const ref = XLSX.utils.decode_range(sheet.ws['!ref'] || 'A1');
  if (r > ref.e.r) ref.e.r = r;
  if (c > ref.e.c) ref.e.c = c;
  sheet.ws['!ref'] = XLSX.utils.encode_range(ref);

  if (cell && cell.f !== undefined) sheet.formulas.add(addr);
  else sheet.formulas.delete(addr);
  sheet.keep.delete(addr);

  while (sheet.rows.length <= r) sheet.rows.push([]);
  const row = sheet.rows[r];
  while (row.length <= c) row.push('');
  row[c] = cell ? displayOf(XLSX, cell) : '';
  if (c + 1 > sheet.colCount) sheet.colCount = c + 1;
  return before;
}

// Suma / promedio / mínimo / máximo de las celdas numéricas (no fechas) de la selección. null si el rango es
// demasiado grande para calcularlo en cada cambio de selección.
export function selectionStats(ctx, sheet, rect) {
  if (!rect) return null;
  const area = (rect.r2 - rect.r1 + 1) * (rect.c2 - rect.c1 + 1);
  if (area > XLSX_STATS_CELL_CAP) return null;
  let count = 0;
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;
  for (let r = rect.r1; r <= rect.r2; r++) {
    for (let c = rect.c1; c <= rect.c2; c++) {
      const cell = sheet.ws[addrOf(ctx.XLSX, r, c)];
      if (!cell || cell.t !== 'n' || typeof cell.v !== 'number' || isDateCell(ctx.XLSX, cell)) continue;
      count += 1;
      sum += cell.v;
      if (cell.v < min) min = cell.v;
      if (cell.v > max) max = cell.v;
    }
  }
  if (!count) return null;
  return { count, sum, avg: sum / count, min, max };
}

// "A1:B5" a partir de un rectángulo (para armar fórmulas como =SUM(A1:A5)).
export function rectToA1(XLSX, r1, c1, r2, c2) {
  return `${addrOf(XLSX, r1, c1)}:${addrOf(XLSX, r2, c2)}`;
}

// Exporta el workbook (con las ediciones) a bytes. La extensión del nombre decide el formato.
export function workbookToBlob(ctx, fileName) {
  const lower = (fileName || '').toLowerCase();
  let bookType = 'xlsx';
  let mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (lower.endsWith('.csv')) {
    bookType = 'csv';
    mime = 'text/csv;charset=utf-8';
  } else if (lower.endsWith('.xls')) {
    bookType = 'biff8';
    mime = 'application/vnd.ms-excel';
  }
  const data = ctx.XLSX.write(ctx.wb, { type: 'array', bookType });
  return new Blob([data], { type: mime });
}

// Hoja vacía de `rows` x `cols` celdas (las celdas se crean al escribirlas).
export function makeBlankSheet(XLSX, name, rows, cols) {
  return {
    name,
    ws: { '!ref': XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows - 1, c: cols - 1 } }) },
    rows: Array.from({ length: rows }, () => []),
    colCount: cols,
    formulas: new Set(),
    keep: new Set(),
  };
}

// "Hoja1", "Hoja2"... el primero libre.
export function nextSheetName(sheets) {
  const taken = new Set(sheets.map((s) => s.name.toLowerCase()));
  let n = sheets.length + 1;
  while (taken.has(`${XLSX_NEW_SHEET_PREFIX}${n}`.toLowerCase())) n += 1;
  return `${XLSX_NEW_SHEET_PREFIX}${n}`;
}

// Valida un nombre de hoja con las reglas de Excel. Devuelve el nombre limpio o null si no es válido.
export function validSheetName(sheets, index, raw) {
  const name = String(raw).trim();
  if (!name || name.length > XLSX_SHEET_NAME_MAX || /[[\]:*?/\\]/.test(name)) return null;
  const clash = sheets.some((s, i) => i !== index && s.name.toLowerCase() === name.toLowerCase());
  return clash ? null : name;
}

export function renameSheetInWorkbook(ctx, index, name) {
  const sheet = ctx.sheets[index];
  const old = sheet.name;
  const { wb } = ctx;
  wb.SheetNames[index] = name;
  wb.Sheets[name] = wb.Sheets[old];
  delete wb.Sheets[old];
  sheet.name = name;
}

// Agrega `count` filas vacías al final de la hoja.
export function appendRows(ctx, sheet, count) {
  const { XLSX } = ctx;
  for (let i = 0; i < count; i++) sheet.rows.push([]);
  const ref = XLSX.utils.decode_range(sheet.ws['!ref'] || 'A1');
  ref.e.r = Math.max(ref.e.r, sheet.rows.length - 1);
  sheet.ws['!ref'] = XLSX.utils.encode_range(ref);
}
