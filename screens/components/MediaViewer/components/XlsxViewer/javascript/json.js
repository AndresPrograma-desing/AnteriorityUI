// Planilla a partir de JSON (+ JSON Schema opcional) y de vuelta. `data` es un array de objetos (una fila cada uno);
// `schema` describe las columnas y sus validaciones con el vocabulario de JSON Schema (type, format, enum, pattern,
// minimum/maximum, minLength/maxLength, required, title). Ver .claude / AnteriorityUI.md → MediaViewer → «Planilla desde JSON».
import { addrOf, displayOf, getCell, isDateCell, isDateText, parseIsoDateText, serialToYmd, ymdToSerial } from './model.js';

const DATE_FORMATS = { date: 'dd/mm/yyyy', 'date-time': 'dd/mm/yyyy hh:mm' };
const EMAIL_RE = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
const BIG_ROW = 1048575; // las reglas del esquema cubren también las filas que el usuario agregue debajo

// El `type` de JSON Schema puede ser una lista (['string', 'null']): se toma el primero que no sea null.
const typeOf = (prop = {}) => (Array.isArray(prop.type) ? prop.type.find((t) => t !== 'null') : prop.type);

// Esquema → columnas en orden. Acepta { type: 'array', items: { properties } }, { type: 'object', properties } o
// { properties }. Sin esquema (o sin properties), las columnas salen de las claves de los datos.
export function resolveColumns(schema, data) {
  const root = schema && schema.type === 'array' && schema.items ? schema.items : schema;
  const properties = root && root.properties;
  const required = new Set((root && root.required) || []);
  let keys;
  if (properties && Object.keys(properties).length) {
    const order = Array.isArray(root['ui:order']) ? root['ui:order'] : [];
    const rest = Object.keys(properties).filter((key) => !order.includes(key));
    keys = [...order.filter((key) => key in properties), ...rest];
  } else {
    const seen = new Set();
    (data || []).forEach((row) => row && typeof row === 'object' && Object.keys(row).forEach((key) => seen.add(key)));
    keys = [...seen];
  }
  return keys.map((key) => {
    const prop = (properties && properties[key]) || {};
    return { key, title: prop.title || key, prop, required: required.has(key) };
  });
}

// Propiedad del esquema → regla de validación del visor (o null si no restringe nada).
export function ruleFromProperty(prop, required) {
  const type = typeOf(prop);
  const rule = {};
  if (prop.format === 'date' || prop.format === 'date-time') rule.type = 'date';
  else if (type === 'integer') rule.type = 'integer';
  else if (type === 'number') rule.type = 'number';
  else if (type === 'boolean') rule.type = 'boolean';
  else if (prop.pattern) {
    rule.type = 'custom';
    rule.pattern = prop.pattern;
  } else if (prop.format === 'email') {
    rule.type = 'custom';
    rule.pattern = EMAIL_RE;
  } else rule.type = 'any';

  if (Array.isArray(prop.enum)) rule.enum = prop.enum;
  if (prop.minimum !== undefined) rule.min = prop.minimum;
  if (prop.maximum !== undefined) rule.max = prop.maximum;
  if (prop.minLength !== undefined) rule.minLength = prop.minLength;
  if (prop.maxLength !== undefined) rule.maxLength = prop.maxLength;
  if (required) rule.required = true;
  if (prop['x-message'] || prop.errorMessage) rule.message = prop['x-message'] || prop.errorMessage;

  const constrained = rule.type !== 'any' || rule.enum || rule.min !== undefined || rule.max !== undefined
    || rule.minLength !== undefined || rule.maxLength !== undefined || rule.required;
  return constrained ? rule : null;
}

// Valor JSON → celda de SheetJS. Las fechas ISO pasan a fecha real de Excel (se ven, ordenan y exportan como fecha).
export function valueToCell(value, prop = {}) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return { t: 'b', v: value };
  if (typeof value === 'number') return Number.isFinite(value) ? { t: 'n', v: value } : null;
  if (typeof value === 'object') return { t: 's', v: JSON.stringify(value) };
  const text = String(value);
  if (prop.format === 'date' || prop.format === 'date-time') {
    const iso = parseIsoDateText(text);
    if (iso) {
      const time = iso.rest.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
      const fraction = time ? (Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3] || 0)) / 86400 : 0;
      const withTime = prop.format === 'date-time' || fraction > 0;
      return { t: 'n', v: ymdToSerial(iso.ymd) + fraction, z: withTime ? DATE_FORMATS['date-time'] : DATE_FORMATS.date };
    }
  }
  return { t: 's', v: text };
}

// Arma la hoja del visor desde los datos: fila 1 = títulos de columna, desde la fila 2 un registro por fila.
export function buildSheetFromJson(XLSX, { data, schema, name = 'Datos' }) {
  const records = Array.isArray(data) ? data : [];
  const columns = resolveColumns(schema, records);
  const ws = {};
  columns.forEach((col, c) => {
    ws[addrOf(XLSX, 0, c)] = { t: 's', v: col.title };
  });
  records.forEach((record, i) => {
    columns.forEach((col, c) => {
      const cell = valueToCell(record ? record[col.key] : undefined, col.prop);
      if (cell) ws[addrOf(XLSX, i + 1, c)] = cell;
    });
  });
  const lastRow = Math.max(records.length, 0);
  const lastCol = Math.max(columns.length - 1, 0);
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastRow, c: lastCol } });

  const rows = [];
  for (let r = 0; r <= lastRow; r++) {
    rows.push(columns.map((_, c) => displayOf(XLSX, ws[addrOf(XLSX, r, c)])));
  }

  const validations = [];
  columns.forEach((col, c) => {
    const rule = ruleFromProperty(col.prop, col.required);
    if (rule) validations.push({ r1: 1, c1: c, r2: BIG_ROW, c2: c, ...rule });
  });

  return { name, ws, rows, colCount: columns.length, formulas: new Set(), keep: new Set(), jsonColumns: columns, validations };
}

// Hoja → array de objetos tipados (las claves salen de las columnas del esquema). Fechas como ISO, números como
// número, booleanos como booleano. Se omiten las filas totalmente vacías.
export function sheetToJson(ctx, sheet) {
  if (!sheet.jsonColumns) return null;
  const { XLSX } = ctx;
  const pad = (n) => String(n).padStart(2, '0');
  const out = [];
  for (let r = 1; r < sheet.rows.length; r++) {
    const record = {};
    let any = false;
    sheet.jsonColumns.forEach((col, c) => {
      const cell = getCell(ctx, sheet, r, c);
      if (!cell || cell.v === undefined || cell.v === null || cell.v === '') return;
      any = true;
      if (isDateCell(XLSX, cell)) {
        const d = XLSX.SSF.parse_date_code(cell.v);
        const ymd = serialToYmd(XLSX, cell.v);
        const day = `${String(ymd.y).padStart(4, '0')}-${pad(ymd.m)}-${pad(ymd.d)}`;
        const withTime = d.H || d.M || d.S || col.prop.format === 'date-time';
        record[col.key] = withTime ? `${day}T${pad(d.H)}:${pad(d.M)}:${pad(Math.floor(d.S))}` : day;
      } else if (isDateText(cell)) {
        record[col.key] = String(cell.v);
      } else {
        record[col.key] = cell.v;
      }
    });
    if (any) out.push(record);
  }
  return out;
}
