import React from 'react';
import styles from './index.module.css';

// Los widgets de SchemaForm (Input, Checks, Selector, CalendarPicker, ...) ya
// muestran su propio label/required/error — el FieldTemplate default de rjsf
// agrega un <label> + bloque de error propio por encima, duplicando todo.
// Este template delega el label en el widget y solo se encarga del layout
// (espaciado entre campos) y de pasar la descripción del schema, si hay.
export function FieldTemplate({ id, children, rawDescription, hidden }) {
  if (hidden) return children;
  return (
    <div className={styles.field} id={`${id}-field`}>
      {children}
      {rawDescription && <p className={styles.fieldDescription}>{rawDescription}</p>}
    </div>
  );
}

// Layout de los campos de un objeto. Por defecto una sola columna (en cascada). Con
// `'ui:options': { columns: N }` en el uiSchema del objeto se reparten en N columnas:
//  - `columnFlow: 'row'` (default): se llena de izquierda a derecha, fila por fila.
//  - `columnFlow: 'column'`: se llena columna por columna (ej. 10 campos en 2 columnas = los
//    primeros 5 a la izquierda y los otros 5 a la derecha).
// Cada campo puede ocupar varias columnas con `'ui:options': { colSpan: N | 'full' }` (solo con
// `columnFlow: 'row'`). Por debajo de COLUMNS_COLLAPSE_WIDTH (ancho del propio formulario, no del
// viewport) vuelve a una sola columna (ver COLUMNS_COLLAPSE_WIDTH en constants.js).
export function ObjectFieldTemplate({ title, description, properties, uiSchema }) {
  const options = uiSchema?.['ui:options'] || {};
  const columns = Math.max(1, Math.floor(Number(options.columns)) || 1);
  const columnFlow = options.columnFlow === 'column' ? 'column' : 'row';
  const visible = properties.filter((prop) => !prop.hidden);
  const rows = Math.ceil(visible.length / columns);

  const gridStyle = columns > 1
    ? { '--schemaform-cols': columns, ...(columnFlow === 'column' ? { '--schemaform-rows': rows } : {}) }
    : undefined;

  const spanOf = (prop) => {
    if (columns === 1 || columnFlow === 'column') return undefined;
    const raw = prop.content?.props?.uiSchema?.['ui:options']?.colSpan;
    if (raw === 'full') return columns;
    const span = Math.floor(Number(raw));
    return span > 1 ? Math.min(span, columns) : undefined;
  };

  return (
    <fieldset className={styles.fieldset}>
      {title && <legend className={styles.legend}>{title}</legend>}
      {description && <p className={styles.fieldDescription}>{description}</p>}
      <div className={styles.fieldsWrap}>
        <div
          className={styles.fieldsGrid}
          data-columns={columns > 1 ? columns : undefined}
          data-flow={columns > 1 ? columnFlow : undefined}
          style={gridStyle}
        >
          {properties.map((prop) => {
            const span = spanOf(prop);
            return (
              <div
                key={prop.name}
                className={styles.gridItem}
                style={span ? { '--schemaform-span': span } : undefined}
              >
                {prop.content}
              </div>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}

// SchemaForm ya renderiza su propio botón de submit (o lo que venga en `children`)
// dentro del <Form>; sin este override, rjsf agrega ADEMÁS su SubmitButton default
// (botón Bootstrap sin estilo, "btn btn-info") al final, duplicando el submit.
function NullSubmitButton() {
  return null;
}

export const SCHEMA_FORM_TEMPLATES = {
  FieldTemplate,
  ObjectFieldTemplate,
  ButtonTemplates: {
    SubmitButton: NullSubmitButton,
  },
};
