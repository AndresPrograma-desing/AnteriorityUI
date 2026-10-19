import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import styles from './index.module.css';

import Input from '../Input/index';
import Checks from '../Checks/index';
import Swich from '../Swich/index';
import Selector from '../Material-UI/Components/Selector/index';
import CalendarPicker from '../CalendarPicker/index';
import ImagePastePreview from '../ImagePastePreview/index';
import Button from '../Button/index';
import { FormTextArea } from '../FormControls/index';
import { RadioGroup, Radio } from '../Radio/index';
import ColorPicker from '../ColorPicker/index';
import Slider from '../Slider/index';

// Widgets de rjsf: cada uno traduce la interfaz (value, onChange, label, ...)
// que rjsf les pasa a la interfaz de los componentes ya existentes de la librería,
// para que un <SchemaForm /> se vea igual que cualquier otro formulario de AnteriorityUI.

export function TextWidget({ id, value, required, disabled, readonly, label, placeholder, rawErrors, onChange, schema, options }) {
  // rjsf resuelve EmailWidget/URLWidget/PasswordWidget por 'format' con prioridad
  // sobre el widget de 'type', así que sin este mapeo esos campos caen al widget
  // nativo de rjsf (sin label ni estilo) en vez de a Input. Ver registro de widgets
  // más abajo: EmailWidget/URLWidget/PasswordWidget también apuntan a TextWidget.
  const htmlType = options?.inputType || (schema?.format === 'email' ? 'email' : schema?.format === 'uri' ? 'url' : 'text');
  return (
    <Input
      id={id}
      type={htmlType}
      label={label}
      value={value ?? ''}
      required={required}
      disabled={disabled || readonly}
      placeholder={placeholder}
      error={rawErrors && rawErrors.length > 0 ? rawErrors[0] : undefined}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
    />
  );
}

export function PasswordWidget(props) {
  return <TextWidget {...props} options={{ ...props.options, inputType: 'password' }} />;
}

export function NumberWidget({ id, value, required, disabled, readonly, label, placeholder, rawErrors, onChange }) {
  return (
    <Input
      id={id}
      numeric
      label={label}
      value={value ?? ''}
      required={required}
      disabled={disabled || readonly}
      placeholder={placeholder}
      error={rawErrors && rawErrors.length > 0 ? rawErrors[0] : undefined}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === '' ? undefined : Number(raw));
      }}
    />
  );
}

export function TextareaWidget({ id, value, required, disabled, readonly, label, placeholder, onChange }) {
  return (
    <FormTextArea
      id={id}
      label={label}
      value={value ?? ''}
      required={required}
      disabled={disabled || readonly}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
    />
  );
}

// Checks tacha el label al marcarlo (pensado para listas de permisos/to-do), lo
// cual se ve mal en un campo booleano suelto de formulario ("Cuenta activa").
// Por eso el widget registrado como "CheckboxWidget" (el que rjsf usa por default
// para todo boolean) es en realidad un Swich; quien quiera el look de checkbox
// tachable lo pide explícito con 'ui:widget': 'ChecksWidget'.
export function SwitchWidget({ value, disabled, readonly, onChange }) {
  return (
    <Swich
      value={!!value}
      disabled={disabled || readonly}
      onChange={(next) => onChange(next)}
    />
  );
}

export function ChecksWidget({ id, value, disabled, readonly, label, onChange }) {
  return (
    <Checks
      id={id}
      label={label}
      checked={!!value}
      disabled={disabled || readonly}
      onChange={() => onChange(!value)}
    />
  );
}

export function SelectWidget({ id, value, disabled, readonly, label, placeholder, options, onChange }) {
  const enumOptions = (options?.enumOptions || []).map((opt) => ({ label: opt.label, value: opt.value }));
  return (
    <Selector
      id={id}
      label={label}
      placeholder={placeholder}
      value={value}
      options={enumOptions}
      disabled={disabled || readonly}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
    />
  );
}

export function CheckboxesWidget({ id, value, disabled, readonly, label, options, onChange }) {
  const enumOptions = options?.enumOptions || [];
  const selected = Array.isArray(value) ? value : [];

  const toggle = (optValue) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  };

  return (
    <div>
      {label && <p className={styles.checkboxesLabel}>{label}</p>}
      {enumOptions.map((opt) => (
        <Checks
          key={String(opt.value)}
          id={id ? `${id}_${opt.value}` : undefined}
          label={opt.label}
          checked={selected.includes(opt.value)}
          disabled={disabled || readonly}
          onChange={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
}

// Widget de rjsf para schema { type: 'string', format: 'data-url' } (archivos/
// imágenes): rjsf lee el File elegido y entrega el value como data-URL (string,
// o array de data-URLs si multiple). Reusa ImagePastePreview (el mismo chip que
// usan PasteImageField/MultilinePlaceholder) para mostrar lo ya cargado, adaptando
// el data-URL al formato { id, url } que ese componente espera.
export function FileWidget({ id, value, multiple, disabled, readonly, label, onChange, options }) {
  const inputRef = useRef(null);
  const accept = options?.accept ? String(options.accept) : undefined;
  const values = Array.isArray(value) ? value : value ? [value] : [];
  const previews = values
    .filter(Boolean)
    .map((dataURL, index) => ({ id: `${id || 'file'}-${index}`, url: dataURL }));

  const readFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
            reader.readAsDataURL(file);
          })
      )
    ).then((dataURLs) => {
      const next = dataURLs.filter(Boolean);
      if (multiple) {
        onChange(values.concat(next));
      } else {
        onChange(next[0]);
      }
    });
  };

  const removeAt = (index) => {
    if (multiple) {
      onChange(values.filter((_, i) => i !== index));
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      {label && <p className={styles.checkboxesLabel}>{label}</p>}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || readonly}
        onChange={(e) => readFiles(e.target.files)}
        className={styles.hiddenFileInput}
      />
      <Button
        type="button"
        variant="outline"
        icon={Upload}
        disabled={disabled || readonly}
        onClick={() => inputRef.current?.click()}
      >
        Subir archivo
      </Button>
      <ImagePastePreview
        previews={previews}
        onRemove={(previewId) => removeAt(previews.findIndex((p) => p.id === previewId))}
        label="Archivo cargado"
      />
    </div>
  );
}

export function DateWidget({ label, value, required, disabled, readonly, onChange }) {
  return (
    <CalendarPicker
      label={label}
      value={value ?? ''}
      required={required}
      disabled={disabled || readonly}
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  );
}

// rjsf resuelve RadioWidget para enum + 'ui:widget': 'radio' (igual que rjsf
// nativo). enumOptions viene en options, igual que en SelectWidget.
export function RadioWidget({ id, value, disabled, readonly, label, options, onChange }) {
  const enumOptions = options?.enumOptions || [];
  return (
    <RadioGroup
      label={label}
      name={id}
      value={value ?? ''}
      disabled={disabled || readonly}
      onChange={(e) => onChange(e.target.value === '' ? undefined : e.target.value)}
    >
      {enumOptions.map((opt) => (
        <Radio key={String(opt.value)} value={opt.value} label={opt.label} />
      ))}
    </RadioGroup>
  );
}

// Widget para schema { type: 'string', format: 'color' } (convención estándar
// de rjsf para selectores de color). A diferencia de CalendarPicker, el
// onChange de ColorPicker entrega el hex ya desenvuelto (no un evento).
export function ColorWidget({ label, value, disabled, readonly, onChange }) {
  return (
    <ColorPicker
      label={label}
      value={value || undefined}
      disabled={disabled || readonly}
      onChange={(next) => onChange(next || undefined)}
    />
  );
}

// Pisa el RangeWidget nativo de rjsf (number/integer + 'ui:widget': 'range')
// con el Slider de la librería. min/max/step vienen del propio schema
// (minimum/maximum/multipleOf), igual que en el range input nativo de rjsf.
export function RangeWidget({ id, value, disabled, readonly, schema, onChange }) {
  const min = schema?.minimum ?? 0;
  const max = schema?.maximum ?? 100;
  const step = schema?.multipleOf ?? 1;
  return (
    <Slider
      aria-label={id}
      value={value ?? min}
      min={min}
      max={max}
      step={step}
      disabled={disabled || readonly}
      showPercentage
      onChange={(next) => onChange(next)}
    />
  );
}

export const SCHEMA_FORM_WIDGETS = {
  TextWidget,
  NumberWidget,
  TextareaWidget,
  CheckboxWidget: SwitchWidget,
  ChecksWidget,
  SelectWidget,
  DateWidget,
  SwitchWidget,
  CheckboxesWidget,
  FileWidget,
  RadioWidget,
  ColorWidget,
  RangeWidget,
  // rjsf resuelve estos por 'format' (prioridad sobre 'type') a sus propios
  // widgets nativos sin estilo — se pisan para que también usen Input.
  EmailWidget: TextWidget,
  URLWidget: TextWidget,
  PasswordWidget,
};
