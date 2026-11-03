export function getNextFilterValue(options, currentValue) {
  if (!Array.isArray(options) || options.length === 0) return currentValue;
  const currentIndex = options.findIndex((option) => option.value === currentValue);
  const nextIndex = (currentIndex + 1) % options.length;
  return options[nextIndex].value;
}

export function getFilterOptionLabel(options, value) {
  if (!Array.isArray(options)) return undefined;
  return options.find((option) => option.value === value)?.label;
}

// ---- Tabla dinámica (schema) -------------------------------------------------------------

const DATE_FORMATS = {
  date: { dateStyle: 'short' },
  datetime: { dateStyle: 'short', timeStyle: 'short' },
  time: { timeStyle: 'short' },
};

// Formatea un valor de fecha. `format`: 'date' | 'datetime' | 'time' | (value) => string.
export function formatDateValue(value, format = 'date', locale = 'es-AR') {
  if (value === null || value === undefined || value === '') return '';
  if (typeof format === 'function') return format(value);
  // 'YYYY-MM-DD' se parsea como UTC y corre un día en zonas con offset negativo: se fuerza local.
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, DATE_FORMATS[format] || DATE_FORMATS.date).format(date);
}

// Deduce el type de columna a partir de una propiedad de JSON Schema.
function inferColumnType(prop = {}) {
  if (prop.type === 'boolean') return 'switch';
  if (prop.type === 'number' || prop.type === 'integer') return 'number';
  if (prop.format === 'date' || prop.format === 'date-time') return 'date';
  if (prop.format === 'uri' || prop.format === 'url') return 'link';
  return 'text';
}

// Convierte un JSON Schema (objeto con `properties`, o array cuyo `items` lo sea) + uiSchema en
// definición de columnas. uiSchema por campo: { 'ui:widget': <type de columna>, 'ui:options': {...props de columna} }.
// `ui:widget: 'input'` / `'select'` hacen editable la celda; un enum con 'ui:widget': 'select' toma sus options del schema.
export function columnsFromSchema(schema, uiSchema = {}) {
  const objectSchema = schema?.type === 'array' ? schema.items : schema;
  const properties = objectSchema?.properties || {};
  const order = uiSchema['ui:order'];
  const keys = Array.isArray(order)
    ? [...order.filter((k) => k in properties), ...Object.keys(properties).filter((k) => !order.includes(k))]
    : Object.keys(properties);

  return keys.map((key) => {
    const prop = properties[key];
    const ui = uiSchema[key] || {};
    const type = ui['ui:widget'] || inferColumnType(prop);
    const enumLabels = Array.isArray(prop.enum)
      ? Object.fromEntries(prop.enum.map((v, i) => [v, prop.enumNames?.[i] ?? v]))
      : undefined;
    const column = { key, label: prop.title ?? key, type, ...(type === 'number' ? { align: 'right' } : {}) };
    if (type === 'input' && (prop.type === 'number' || prop.type === 'integer')) column.inputType = 'number';
    if (type === 'select' && Array.isArray(prop.enum)) {
      column.options = prop.enum.map((v, i) => ({ value: v, label: prop.enumNames?.[i] ?? String(v) }));
    } else if (enumLabels) {
      column.render = (row) => enumLabels[row[key]] ?? row[key];
    }
    return { ...column, ...ui['ui:options'] };
  });
}
