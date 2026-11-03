import { ERROR_MESSAGES } from './constants.js';

// Traduce los errores de ajv (en inglés, técnicos) a mensajes legibles para el usuario.
// Los textos viven en ERROR_MESSAGES (constants.js) y se pueden pisar por prop `errorMessages`.
// El mensaje puede ser un string o una función (params) => string.
export function localizeError(error, messages = ERROR_MESSAGES) {
  const params = error.params || {};
  const key = error.name === 'format' ? `format:${params.format}` : error.name;
  const entry = messages[key] ?? messages[error.name];
  if (!entry) return error;
  const message = typeof entry === 'function' ? entry(params) : entry;
  return { ...error, message };
}

// Arma el transformErrors de rjsf: primero traduce, después aplica el del consumidor (si hay).
export function buildTransformErrors(errorMessages, custom) {
  const messages = { ...ERROR_MESSAGES, ...errorMessages };
  return (errors, uiSchema) => {
    const localized = errors.map((e) => localizeError(e, messages));
    return custom ? custom(localized, uiSchema) : localized;
  };
}

// Props de restricción numérica derivadas del JSON Schema para el Input numérico:
// minimum/maximum → min/max (si min >= 0 el Input bloquea el signo "-" al tipear),
// multipleOf → step, type 'integer' → sin decimales.
export function numericPropsFromSchema(schema = {}) {
  const min = schema.minimum ?? (schema.exclusiveMinimum !== undefined ? schema.exclusiveMinimum : undefined);
  const max = schema.maximum ?? (schema.exclusiveMaximum !== undefined ? schema.exclusiveMaximum : undefined);
  return {
    min,
    max,
    step: schema.multipleOf ?? 1,
    allowDecimal: schema.type !== 'integer',
  };
}
