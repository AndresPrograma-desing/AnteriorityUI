// ¿El valor no tiene nada cargado? Recursivo, para datos de un JSON Schema: `undefined`, `null`,
// string vacío/solo espacios, y arrays/objetos que no contienen nada cargado (ej. `{}` o
// `{ calle: '', ciudad: undefined }`) cuentan como vacíos. Números y booleanos (incluido `false`)
// cuentan como cargados.
export function isEmptyValue(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.every(isEmptyValue);
  if (typeof value === 'object') return Object.values(value).every(isEmptyValue);
  return false;
}

// ¿Hay algo que el usuario haya cargado y se perdería al cerrar? Como `isEmptyValue`, pero un
// `false` no cuenta: un toggle/checkbox sin marcar es el estado inicial, no un dato escrito.
export function hasUserValues(value) {
  if (value === false) return false;
  if (Array.isArray(value)) return value.some(hasUserValues);
  if (value && typeof value === 'object') return Object.values(value).some(hasUserValues);
  return !isEmptyValue(value);
}

// Campos obligatorios de un JSON Schema (`required`), usados para calcular el progreso del
// formulario cuando no se pasa `requiredFields` explícito.
export function getSchemaRequiredFields(schema) {
  return Array.isArray(schema?.required) ? schema.required : [];
}
