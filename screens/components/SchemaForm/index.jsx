import React from 'react';
import Form from '@rjsf/core';
import ajv8Validator from '@rjsf/validator-ajv8';

import Button from '../Button/index';
import styles from './index.module.css';
import { SCHEMA_FORM_WIDGETS } from './widgets';
import { SCHEMA_FORM_TEMPLATES } from './templates';
import { DEFAULT_SUBMIT_TEXT } from './constants.js';

// Renderiza un formulario completo a partir de un JSON Schema (+ uiSchema opcional),
// usando los componentes ya existentes de AnteriorityUI (Input, Checks, Swich,
// Selector, CalendarPicker, FormTextArea) como widgets de cada tipo de campo.
//
// Pensado para usarse como children de cualquier contenedor (ej. DrawPanel): el
// contenedor no sabe ni le importa que adentro hay un SchemaForm, solo le pasa
// el schema que corresponda a ese caso (login, alta de usuario, etc.).
//
// Requiere @rjsf/core como peer dependency del consumidor. El validador (ajv8) ya
// viene empaquetado con anteriority-ui y se usa por default; pasar "validator" solo
// hace falta para forzar otra versión/implementación.
const SchemaForm = ({
  schema,
  uiSchema,
  formData,
  validator = ajv8Validator,
  widgets,
  fields,
  templates,
  formId,
  onChange,
  onSubmit,
  onError,
  showSubmitButton = true,
  submitText = DEFAULT_SUBMIT_TEXT,
  disabled = false,
  readonly = false,
  className = '',
  style,
  children,
}) => {
  return (
    <Form
      id={formId}
      className={`${styles.form} ${className}`.trim()}
      style={style}
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validator={validator}
      widgets={{ ...SCHEMA_FORM_WIDGETS, ...widgets }}
      fields={fields}
      templates={{ ...SCHEMA_FORM_TEMPLATES, ...templates }}
      disabled={disabled}
      readonly={readonly}
      onChange={(e) => onChange?.(e.formData, e)}
      onSubmit={(e) => onSubmit?.(e.formData, e)}
      onError={onError}
    >
      {children ?? (showSubmitButton && (
        <Button type="submit" variant="primary" color={Button.COLORS.PRIMARY} fullWidth>
          {submitText}
        </Button>
      ))}
    </Form>
  );
};

export default SchemaForm;
