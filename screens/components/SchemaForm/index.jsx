import React, { useState } from 'react';
import Form from '@rjsf/core';
import ajv8Validator from '@rjsf/validator-ajv8';

import Button from '../Button/index';
import styles from './index.module.css';
import { SCHEMA_FORM_WIDGETS } from './widgets';
import { SCHEMA_FORM_TEMPLATES } from './templates';
import { DEFAULT_SUBMIT_TEXT } from './constants.js';
import { buildTransformErrors } from './utils.js';

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
  noHtml5Validate = true,
  errorMessages,
  transformErrors,
  showErrorList = false,
  fieldGap,
  inputVariant,
  className = '',
  style,
  children,
}) => {
  // Los widgets decorativos (NoteWidget/BadgeWidget) condicionan su texto a los datos,
  // pero rjsf no le pasa formData a los widgets: se espeja acá y viaja por formContext.
  const [liveData, setLiveData] = useState(formData);
  const currentData = formData !== undefined ? formData : liveData;
  return (
    <Form
      formContext={{ formData: currentData, inputVariant }}
      noHtml5Validate={noHtml5Validate}
      showErrorList={showErrorList}
      transformErrors={buildTransformErrors(errorMessages, transformErrors)}
      id={formId}
      className={`${styles.form} ${className}`.trim()}
      style={fieldGap ? { '--schemaform-gap': fieldGap, ...style } : style}
      schema={schema}
      uiSchema={uiSchema}
      formData={currentData}
      validator={validator}
      widgets={{ ...SCHEMA_FORM_WIDGETS, ...widgets }}
      fields={fields}
      templates={{ ...SCHEMA_FORM_TEMPLATES, ...templates }}
      disabled={disabled}
      readonly={readonly}
      onChange={(e) => { setLiveData(e.formData); onChange?.(e.formData, e); }}
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
