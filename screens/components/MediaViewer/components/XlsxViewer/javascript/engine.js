// Motor de fórmulas del visor de hojas de cálculo, sobre `fast-formula-parser` (peer opcional, cargado con
// import() dinámico solo cuando el visor es editable). Recalcula TODAS las fórmulas de todas las hojas cada vez
// que se edita algo; el orden de dependencias se resuelve evaluando de forma recursiva con memo.
import { displayOf, addrOf } from './model.js';

export async function loadFormulaParser() {
  try {
    const mod = await import('fast-formula-parser');
    return mod.default || mod;
  } catch (err) {
    console.warn('[XlsxViewer] fast-formula-parser no está instalado: las fórmulas (=...) se guardan como texto.', err);
    return null;
  }
}

// Marca las fórmulas que ya venían en el archivo: si el motor no soporta alguna de sus funciones, se conserva el
// valor que Excel dejó calculado en vez de pisarlo con un error.
export function indexFormulas(XLSX, sheet) {
  sheet.formulas = new Set();
  sheet.keep = new Set();
  for (const key of Object.keys(sheet.ws)) {
    if (key.charCodeAt(0) === 33) continue; // '!ref', '!cols', ...
    const cell = sheet.ws[key];
    if (cell && cell.f !== undefined) {
      sheet.formulas.add(key);
      sheet.keep.add(key);
    }
  }
}

export function recalcAll(ctx) {
  const { XLSX, FormulaParser, sheets } = ctx;
  if (!FormulaParser) return;
  const { FormulaError } = FormulaParser;
  const byName = new Map(sheets.map((s) => [s.name, s]));
  const cache = new Map();
  const stack = new Set();
  let parser;

  const evalFormula = (s, r, c, cell) => {
    const key = `${s.name}!${r},${c}`;
    if (cache.has(key)) return cache.get(key);
    if (stack.has(key)) return new FormulaError('#REF!', 'Referencia circular');
    stack.add(key);
    let result;
    try {
      result = parser.parse(cell.f, { sheet: s.name, row: r + 1, col: c + 1 });
    } catch (err) {
      result = err instanceof FormulaError ? err : new FormulaError('#ERROR!', err && err.message);
    }
    if (Array.isArray(result)) result = Array.isArray(result[0]) ? result[0][0] : result[0];
    stack.delete(key);
    cache.set(key, result);
    return result;
  };

  const valueAt = (s, r, c) => {
    const cell = s.ws[addrOf(XLSX, r, c)];
    if (!cell) return null;
    if (cell.f !== undefined) return evalFormula(s, r, c, cell);
    if (cell.v === undefined || cell.v === null || cell.v === '') return null;
    if (cell.t === 'e') return new FormulaError('#VALUE!');
    return cell.v;
  };

  parser = new FormulaParser({
    onCell: (ref) => valueAt(byName.get(ref.sheet) || sheets[0], ref.row - 1, ref.col - 1),
    onRange: (ref) => {
      const s = byName.get(ref.sheet) || sheets[0];
      const out = [];
      // Columnas/filas enteras (A:A) llegan con límites de millones: se recortan al área usada de la hoja.
      const toRow = Math.min(ref.to.row, Math.max(s.rows.length, ref.from.row));
      const toCol = Math.min(ref.to.col, Math.max(s.colCount, ref.from.col));
      for (let row = ref.from.row; row <= toRow; row++) {
        const line = [];
        for (let col = ref.from.col; col <= toCol; col++) line.push(valueAt(s, row - 1, col - 1));
        out.push(line);
      }
      return out;
    },
  });

  for (const s of sheets) {
    for (const addr of s.formulas) {
      const { r, c } = XLSX.utils.decode_cell(addr);
      const cell = s.ws[addr];
      if (!cell) continue;
      const result = evalFormula(s, r, c, cell);

      if (result instanceof FormulaError) {
        // Función no soportada por el motor en una fórmula del archivo original: se conserva el valor cacheado.
        if (s.keep.has(addr) && (result.error === '#NAME?' || result.error === '#ERROR!')) continue;
        cell.t = 's';
        cell.v = result.error;
      } else if (typeof result === 'number' && Number.isFinite(result)) {
        cell.t = 'n';
        cell.v = result;
      } else if (typeof result === 'boolean') {
        cell.t = 'b';
        cell.v = result;
      } else if (result === null || result === undefined) {
        cell.t = 'n';
        cell.v = 0;
      } else {
        cell.t = 's';
        cell.v = String(result);
      }
      delete cell.w;
      while (s.rows.length <= r) s.rows.push([]);
      const row = s.rows[r];
      while (row.length <= c) row.push('');
      row[c] = displayOf(XLSX, cell);
    }
  }
}
