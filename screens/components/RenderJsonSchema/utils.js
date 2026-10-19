import { format as formatDate, isValid as isValidDate, parseISO } from 'date-fns';
import { DEFAULT_BOOLEAN_LABELS, DEFAULT_DATE_FORMAT } from './constants.js';

// Dado un enum con enumNames paralelo (convención de rjsf/JSON Schema Form)
// o un anyOf de const+title (convención de json-schema-to-ui), resuelve el
// label legible de un valor crudo. Si no encuentra nada, devuelve el valor tal cual.
export function resolveEnumLabel(propSchema, rawValue) {
  if (rawValue === undefined || rawValue === null) return rawValue;

  const { enum: enumValues, enumNames, anyOf } = propSchema || {};

  if (Array.isArray(enumValues) && Array.isArray(enumNames)) {
    const index = enumValues.indexOf(rawValue);
    if (index !== -1 && enumNames[index] !== undefined) return enumNames[index];
  }

  if (Array.isArray(anyOf)) {
    const match = anyOf.find((option) => option?.const === rawValue);
    if (match?.title) return match.title;
  }

  return rawValue;
}

// Datos guardados por una versión vieja/rota de un widget (ej. el bug de
// DateWidget que guardaba el evento { target: { value } } entero en vez del
// valor) no deben romper la vista de solo lectura — se muestran como "vacío"
// en lugar de "[object Object]" o tirar una excepción.
function isPlainDisplayable(rawValue) {
  if (rawValue === null || rawValue === undefined) return false;
  const type = typeof rawValue;
  return type === 'string' || type === 'number' || type === 'boolean';
}

function formatDateValue(rawValue) {
  if (typeof rawValue !== 'string') return null;
  const parsed = parseISO(rawValue);
  if (!isValidDate(parsed)) return null;
  return formatDate(parsed, DEFAULT_DATE_FORMAT);
}

// Punto central de formateo: devuelve siempre un string (u null si no hay
// nada que mostrar), nunca el valor crudo de un objeto mal guardado.
export function formatPrimitiveValue(propSchema, rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === '') return null;

  if (propSchema?.type === 'boolean') {
    if (typeof rawValue !== 'boolean') return null;
    return DEFAULT_BOOLEAN_LABELS[String(rawValue)];
  }

  if (propSchema?.format === 'date' || propSchema?.format === 'date-time') {
    return formatDateValue(rawValue) ?? (isPlainDisplayable(rawValue) ? String(rawValue) : null);
  }

  if (propSchema?.enum || propSchema?.anyOf) {
    const label = resolveEnumLabel(propSchema, rawValue);
    return isPlainDisplayable(label) ? String(label) : null;
  }

  if (!isPlainDisplayable(rawValue)) return null;

  return String(rawValue);
}
