import {
  XLSX_COL_SAMPLE_ROWS,
  XLSX_CHAR_PX,
  XLSX_MIN_COL_WIDTH,
  XLSX_MAX_COL_WIDTH,
} from '../../constants.js';

// Número con separadores del idioma del navegador y como máximo `maxDigits` decimales (sin ceros de relleno).
export const formatNumber = (n, maxDigits = 4) => n.toLocaleString(undefined, { maximumFractionDigits: maxDigits });

// 0 -> A, 25 -> Z, 26 -> AA ...
export function colLabel(index) {
  let n = index + 1;
  let label = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

// Convierte el workbook de SheetJS en [{ name, rows: string[][], colCount }]. Los valores se leen ya
// formateados (fechas, moneda, porcentajes como los muestra Excel) y las fórmulas traen su resultado.
// La hoja se ancla en A1 para que los números de fila/columna coincidan con los de Excel aunque los
// datos empiecen más abajo o a la derecha.
export function parseWorkbook(XLSX, buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellNF: true }); // cellNF conserva el formato (z): sin él no se distinguen las fechas
  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet || !sheet['!ref']) return { name, ws: sheet || {}, rows: [], colCount: 0 };

    const range = XLSX.utils.decode_range(sheet['!ref']);
    range.s.r = 0;
    range.s.c = 0;
    sheet['!ref'] = XLSX.utils.encode_range(range);

    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '', blankrows: true });

    // Excel suele arrastrar filas vacías con formato al final: se recortan.
    let last = rows.length;
    while (last > 0 && rows[last - 1].every((cell) => cell === '' || cell == null)) last -= 1;
    rows.length = last;

    let colCount = 0;
    for (const row of rows) if (row.length > colCount) colCount = row.length;
    return { name, ws: sheet, rows, colCount };
  });
  return { wb: workbook, sheets };
}

// Ancho de cada columna estimado por el largo del contenido en las primeras filas.
export function computeColWidths(rows, colCount) {
  const widths = new Array(colCount).fill(0);
  const limit = Math.min(rows.length, XLSX_COL_SAMPLE_ROWS);
  for (let r = 0; r < limit; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const len = String(row[c] ?? '').length;
      if (len > widths[c]) widths[c] = len;
    }
  }
  return widths.map((len, c) => {
    const wanted = Math.max(len, colLabel(c).length) * XLSX_CHAR_PX + 20;
    return Math.round(Math.min(XLSX_MAX_COL_WIDTH, Math.max(XLSX_MIN_COL_WIDTH, wanted)));
  });
}

// { anchor: {r,c}, focus: {r,c} } -> rectángulo normalizado { r1, c1, r2, c2 }
export function normalizeSelection(selection) {
  if (!selection) return null;
  const { anchor, focus } = selection;
  return {
    r1: Math.min(anchor.r, focus.r),
    r2: Math.max(anchor.r, focus.r),
    c1: Math.min(anchor.c, focus.c),
    c2: Math.max(anchor.c, focus.c),
  };
}

// Filas/columnas de la selección como matriz. Con withHeaders se antepone la fila 1 de la hoja
// (los encabezados) si la selección no la incluye.
export function extractRows(rows, rect, { withHeaders = false } = {}) {
  if (!rect) return [];
  const out = [];
  const slice = (row) => {
    const cells = [];
    for (let c = rect.c1; c <= rect.c2; c++) cells.push(String((row || [])[c] ?? ''));
    return cells;
  };
  if (withHeaders && rect.r1 > 0) out.push(slice(rows[0]));
  for (let r = rect.r1; r <= rect.r2; r++) out.push(slice(rows[r]));
  return out;
}

function escapeCsv(value) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(matrix) {
  return matrix.map((row) => row.map(escapeCsv).join(',')).join('\n');
}

// Array de objetos usando la fila 1 de la hoja como claves (vacías -> letra de columna).
export function toJson(rows, rect) {
  if (!rect) return '[]';
  const keys = [];
  for (let c = rect.c1; c <= rect.c2; c++) keys.push(String((rows[0] || [])[c] || '') || colLabel(c));
  const first = Math.max(rect.r1, 1); // la fila 1 son los encabezados, no un dato
  const data = [];
  for (let r = first; r <= rect.r2; r++) {
    const row = rows[r] || [];
    const obj = {};
    keys.forEach((key, i) => {
      obj[key] = row[rect.c1 + i] ?? '';
    });
    data.push(obj);
  }
  return JSON.stringify(data, null, 2);
}

function escapeCell(value) {
  const text = String(value ?? '');
  // Formato que Excel / Google Sheets entienden al pegar: se entrecomilla si hay tab, salto o comilla.
  return /[\t\r\n"]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// Texto tabulado (TSV) de la selección: pegarlo en Excel/Sheets reconstruye las celdas.
export function selectionToTsv(rows, rect) {
  if (!rect) return '';
  const lines = [];
  for (let r = rect.r1; r <= rect.r2; r++) {
    const row = rows[r] || [];
    const cells = [];
    for (let c = rect.c1; c <= rect.c2; c++) cells.push(escapeCell(row[c]));
    lines.push(cells.join('\t'));
  }
  return lines.join('\n');
}

// Texto pegado (TSV de Excel/Sheets, con celdas entrecomilladas) -> matriz de strings.
export function parseTsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const t = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (quoted) {
      if (ch === '"' && t[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"' && cell === '') {
      quoted = true;
    } else if (ch === '\t') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
