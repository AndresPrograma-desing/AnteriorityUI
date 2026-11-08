// Validación de datos del visor de hojas de cálculo. Una regla se aplica a un rango de celdas
// ({ r1, c1, r2, c2, type, pattern?, message?, enum?, min?, max?, minLength?, maxLength?, required? }) y se guarda en
// `sheet.validations` (no se escribe en el archivo .xlsx: SheetJS community no exporta validaciones). Gana la regla
// más reciente que cubra la celda. Las reglas vienen del menú «Validar datos…», de la prop `validations` o de un
// JSON Schema (planilla desde JSON, ver json.js).
import { displayOf, isDateCell, isDateText } from './model.js';

const LETTERS_RE = /^[\p{L}\s.'’-]+$/u;
const ALPHANUMERIC_RE = /^[\p{L}\p{N}\s]+$/u;
const BOOLEAN_WORDS = ['true', 'false'];

// Patrón estilo JSON Schema (ECMA-262): con el flag `u` (admite \p{L}); si el patrón no lo tolera, sin flag. Un patrón
// inválido no bloquea.
function patternTest(pattern, text) {
  let re;
  try {
    re = new RegExp(pattern || '', 'u');
  } catch {
    try {
      re = new RegExp(pattern || '');
    } catch {
      return true;
    }
  }
  return re.test(text);
}

export function findRule(sheet, r, c) {
  const rules = sheet.validations;
  if (!rules || !rules.length) return null;
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i];
    if (r >= rule.r1 && r <= rule.r2 && c >= rule.c1 && c <= rule.c2) return rule;
  }
  return null;
}

// Por qué no cumple la regla: null si cumple, o un código ('required', 'type', 'enum', 'min', 'max', 'minLength',
// 'maxLength'). Vaciar una celda se permite salvo que la regla sea `required`; las fórmulas (=...) se aceptan en
// tipos numéricos y de fecha (su resultado se calcula, no se tipea) y no se les aplican los límites.
export function failureOf(ctx, rule, cell) {
  if (!rule) return null;
  const { XLSX } = ctx;
  const isFormula = Boolean(cell) && cell.f !== undefined;
  const text = cell ? displayOf(XLSX, cell) : '';
  if (text === '' && !isFormula) return rule.required ? 'required' : null;

  const isDate = isDateCell(XLSX, cell) || isDateText(cell);
  let typeOk = true;
  switch (rule.type) {
    case 'number':
      typeOk = isFormula || (cell.t === 'n' && !isDate);
      break;
    case 'integer':
      typeOk = isFormula || (cell.t === 'n' && !isDate && Number.isInteger(cell.v));
      break;
    case 'date':
      typeOk = isFormula || isDate;
      break;
    case 'boolean':
      typeOk = cell.t === 'b' || BOOLEAN_WORDS.includes(text.toLowerCase());
      break;
    case 'letters':
      typeOk = cell.t === 's' && !isDate && LETTERS_RE.test(text);
      break;
    case 'alphanumeric':
      typeOk = !isDate && ALPHANUMERIC_RE.test(text);
      break;
    case 'custom':
      typeOk = patternTest(rule.pattern, text);
      break;
    default:
      break;
  }
  if (!typeOk) return 'type';
  if (isFormula) return null;

  if (Array.isArray(rule.enum) && !rule.enum.map(String).includes(text)) return 'enum';
  if (cell.t === 'n' && !isDate) {
    if (rule.min !== undefined && cell.v < rule.min) return 'min';
    if (rule.max !== undefined && cell.v > rule.max) return 'max';
  }
  if (rule.minLength !== undefined && text.length < rule.minLength) return 'minLength';
  if (rule.maxLength !== undefined && text.length > rule.maxLength) return 'maxLength';
  return null;
}

export const cellMatchesRule = (ctx, rule, cell) => failureOf(ctx, rule, cell) === null;

// Texto del aviso para un fallo: el `message` de la regla o, si no, el mensaje por defecto de ese fallo/tipo
// (`messages` viene de DEFAULT_XLSX_VALIDATION_LABELS y admite plantillas {n} / {values}).
export function reasonFor(rule, code, messages) {
  if (rule.message) return rule.message;
  const fill = (template, vars) => String(template).replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : ''));
  switch (code) {
    case 'required': return messages.required;
    case 'enum': return fill(messages.enum, { values: (rule.enum || []).join(', ') });
    case 'min': return fill(messages.min, { n: rule.min });
    case 'max': return fill(messages.max, { n: rule.max });
    case 'minLength': return fill(messages.minLength, { n: rule.minLength });
    case 'maxLength': return fill(messages.maxLength, { n: rule.maxLength });
    default: return messages[rule.type] || messages.fallback;
  }
}

// Rango A1 → { r1, c1, r2, c2 }. Acepta 'E:E' (columna completa), 'E2:E50', 'B2', '3:3' (fila completa).
export function parseRuleRange(XLSX, spec, sheet) {
  try {
    const d = XLSX.utils.decode_range(String(spec));
    const maxRow = Math.max(sheet.rows.length - 1, 0);
    return { r1: d.s.r, c1: d.s.c, r2: Math.min(d.e.r, Math.max(maxRow, d.s.r)), c2: d.e.c };
  } catch {
    return null;
  }
}
