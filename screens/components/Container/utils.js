// Campos de `values` que pertenecen al `schema` (solo propiedades de primer nivel). Se usa para
// entregarle al consumidor, en `onFormSubmit`, solo los datos del paso que se acaba de enviar
// aunque `formData` acumule los de pasos anteriores. Sin `schema.properties` devuelve `values`.
export const pickSchemaFields = (schema, values) => {
  const keys = schema?.properties ? Object.keys(schema.properties) : null;
  if (!keys || !values || typeof values !== 'object') return values;
  return Object.fromEntries(keys.filter((key) => key in values).map((key) => [key, values[key]]));
};
