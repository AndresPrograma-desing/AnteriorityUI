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

export function ObjectFieldTemplate({ title, description, properties }) {
  return (
    <fieldset className={styles.fieldset}>
      {title && <legend className={styles.legend}>{title}</legend>}
      {description && <p className={styles.fieldDescription}>{description}</p>}
      <div className={styles.fieldsGrid}>
        {properties.map((prop) => (
          <div key={prop.name} className={styles.gridItem}>
            {prop.content}
          </div>
        ))}
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
