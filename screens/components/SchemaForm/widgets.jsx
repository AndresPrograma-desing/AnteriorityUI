import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import styles from './index.module.css';
import {
  DEFAULT_AUDIO_SAVE_LABEL,
  DEFAULT_AUDIO_REMOVE_LABEL,
  AUDIO_RECORDER_OPTION_KEYS,
} from './constants.js';

import { numericPropsFromSchema } from './utils.js';
import Input from '../Input/index';
import Checks from '../Checks/index';
import Swich from '../Swich/index';
import Selector from '../Material-UI/Components/Selector/index';
import CalendarPicker from '../CalendarPicker/index';
import ImagePastePreview from '../ImagePastePreview/index';
import Button from '../Button/index';
import Callout from '../Callout/index';
import Badge from '../Badge/index';
import { FormTextArea } from '../FormControls/index';
import { RadioGroup, Radio } from '../Radio/index';
import ColorPicker from '../ColorPicker/index';
import Slider from '../Slider/index';
import MediaViewer from '../MediaViewer/index';
import AudioRecorder from '../MediaViewer/components/AudioRecorder/index';

// Widgets de rjsf: cada uno traduce la interfaz (value, onChange, label, ...)
// que rjsf les pasa a la interfaz de los componentes ya existentes de la librería,
// para que un <SchemaForm /> se vea igual que cualquier otro formulario de AnteriorityUI.

// Variante visual de los campos de texto/número: `'ui:options': { variant: 'underline' }` por campo,
// o `inputVariant` en SchemaForm para todos (llega por formContext). Colores de la línea vía
// `'ui:options': { lineColor, lineFocusColor }`.
const inputStyleProps = (options, formContext) => {
  const variant = options?.variant ?? formContext?.inputVariant;
  return {
    ...(variant && { variant }),
    ...(options?.lineColor && { lineColor: options.lineColor }),
    ...(options?.lineFocusColor && { lineFocusColor: options.lineFocusColor }),
  };
};

export function TextWidget({ id, value, required, disabled, readonly, label, placeholder, rawErrors, onChange, schema, options, formContext }) {
  // rjsf resuelve EmailWidget/URLWidget/PasswordWidget por 'format' con prioridad
  // sobre el widget de 'type', así que sin este mapeo esos campos caen al widget
  // nativo de rjsf (sin label ni estilo) en vez de a Input. Ver registro de widgets
  // más abajo: EmailWidget/URLWidget/PasswordWidget también apuntan a TextWidget.
  const htmlType = options?.inputType || (schema?.format === 'email' ? 'email' : schema?.format === 'uri' ? 'url' : 'text');
  return (
    <Input
      id={id}
      type={htmlType}
      {...inputStyleProps(options, formContext)}
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

export function NumberWidget({ id, value, required, disabled, readonly, label, placeholder, rawErrors, onChange, schema, options, formContext }) {
  return (
    <Input
      id={id}
      numeric
      {...numericPropsFromSchema(schema)}
      {...inputStyleProps(options, formContext)}
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

export function TextareaWidget({ id, value, required, disabled, readonly, label, placeholder, onChange, options, formContext }) {
  return (
    <FormTextArea
      id={id}
      {...inputStyleProps(options, formContext)}
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
export function SwitchWidget({ id, value, disabled, readonly, label, options, onChange }) {
  const switchEl = (
    <Swich
      value={!!value}
      showIcons
      disabled={disabled || readonly}
      onChange={(next) => onChange(next)}
      activeColor={options?.activeColor}
      inactiveColor={options?.inactiveColor}
    />
  );
  // Sin 'ui:options.labelPosition' el switch va solo (look original). Con 'top' | 'right' | 'left'
  // se muestra el título del campo (o options.text) en esa posición.
  const position = options?.labelPosition;
  const text = options?.text ?? label;
  if (!position || !text) return switchEl;
  const isColumn = position === 'top';
  return (
    <div
      className={styles.switchRow}
      style={{
        flexDirection: isColumn ? 'column' : position === 'left' ? 'row-reverse' : 'row',
        alignItems: isColumn ? 'flex-start' : 'center',
        justifyContent: position === 'left' ? 'flex-end' : undefined,
        ...(options?.textColor ? { '--schemaform-switch-text': options.textColor } : {}),
      }}
    >
      <label htmlFor={id} className={styles.switchLabel}>{text}</label>
      {switchEl}
    </div>
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

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Widget para grabar audio desde el micrófono: se pide con 'ui:widget': 'AudioWidget' sobre un
// schema { type: 'string', format: 'data-url' } (un audio) o un array de esos (varios, con
// 'ui:options': { multiple: true }). Igual que FileWidget, el valor guardado es un data-URL en
// base64 (ej. `data:audio/webm;base64,...`), no un File ni un Blob, así que RenderJsonSchema lo
// muestra directo con el reproductor de audio. Reusa el AudioRecorder de MediaViewer: graba,
// permite escuchar antes de confirmar y recién al "Guardar audio" se escribe el valor; lo ya
// guardado se muestra con el reproductor y un botón para eliminarlo.
//
// Las opciones del grabador (límite de duración, bitrate, labels y colores) se pasan vía
// 'ui:options' con los mismos nombres que sus props (ver AUDIO_RECORDER_OPTION_KEYS).
export function AudioWidget({ id, value, multiple, disabled, readonly, label, onChange, options }) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  const locked = disabled || readonly;
  const canRecord = !locked && (multiple || values.length === 0);

  const recorderProps = {};
  AUDIO_RECORDER_OPTION_KEYS.forEach((key) => {
    if (options?.[key] !== undefined) recorderProps[key] = options[key];
  });

  const handleSend = async ({ file }) => {
    const dataURL = await readFileAsDataURL(file);
    onChange(multiple ? values.concat(dataURL) : dataURL);
  };

  const removeAt = (index) => {
    if (multiple) {
      onChange(values.filter((_, i) => i !== index));
    } else {
      onChange(undefined);
    }
  };

  return (
    <div id={id} className={styles.audioWidget}>
      {label && <p className={styles.checkboxesLabel}>{label}</p>}

      {values.map((dataURL, index) => (
        <div key={`${id || 'audio'}-${index}`} className={styles.audioItem}>
          <MediaViewer
            url={dataURL}
            type="audio"
            className={styles.audioPlayer}
            bgColor={options?.bgColor}
            borderColor={options?.borderColor}
            textColor={options?.textColor}
            audioAccentColor={options?.accentColor}
            audioControlsColor={options?.textColor}
            audioIconBgColor={options?.iconBgColor}
            senderName={options?.senderName}
            senderAvatar={options?.senderAvatar}
            avatarBgColor={options?.avatarBgColor}
            avatarTextColor={options?.avatarTextColor}
          />
          {!locked && (
            <Button
              type="button"
              variant="ghost"
              size="small"
              icon={Trash2}
              onClick={() => removeAt(index)}
            >
              {options?.removeLabel || DEFAULT_AUDIO_REMOVE_LABEL}
            </Button>
          )}
        </div>
      ))}

      {canRecord && (
        <AudioRecorder
          sendLabel={DEFAULT_AUDIO_SAVE_LABEL}
          {...recorderProps}
          onSend={handleSend}
        />
      )}
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
// La prop de color (options.color, el mismo nombre que acepta <RadioGroup>/<Radio> de MUI:
// 'primary'|'secondary'|etc., no un hex libre) se pasa vía ui:options en el uiSchema del
// consumidor, igual que bgColor/textColor/etc. en ColorWidget. RadioGroup ya propaga su prop
// color a cada <Radio> hijo automáticamente, así que alcanza con pasarla una sola vez acá.
export function RadioWidget({ id, value, disabled, readonly, label, options, onChange }) {
  const enumOptions = options?.enumOptions || [];
  return (
    <RadioGroup
      label={label}
      name={id}
      value={value ?? ''}
      disabled={disabled || readonly}
      color={options?.color}
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
// Las props de color del popover (bgColor/textColor/borderColor/accentColor) se pasan vía
// ui:options en el uiSchema del consumidor, igual que options.inputType en TextWidget o
// options.accept en FileWidget — necesarias porque el <ColorPicker> no tiene aquí ningún
// prop directo donde el consumidor del formulario pueda tematizarlo.
export function ColorWidget({ label, value, disabled, readonly, onChange, options }) {
  return (
    <ColorPicker
      label={label}
      value={value || undefined}
      disabled={disabled || readonly}
      onChange={(next) => onChange(next || undefined)}
      bgColor={options?.bgColor}
      textColor={options?.textColor}
      borderColor={options?.borderColor}
      accentColor={options?.accentColor}
    />
  );
}

// Pisa el RangeWidget nativo de rjsf (number/integer + 'ui:widget': 'range')
// con el Slider de la librería. min/max/step vienen del propio schema
// (minimum/maximum/multipleOf), igual que en el range input nativo de rjsf.
// options.accentColor (el mismo nombre que acepta <Slider>) se pasa vía ui:options en el
// uiSchema del consumidor, igual que en ColorWidget/RadioWidget.
export function RangeWidget({ id, value, disabled, readonly, schema, options, onChange }) {
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
      accentColor={options?.accentColor}
      onChange={(next) => onChange(next)}
    />
  );
}

// Campos decorativos: no guardan valor ni validan, solo muestran un aviso entre campos.
// `text`/`title` pueden ser string o (formData) => string; `when` (formData) => boolean
// permite mostrarlo solo si se cumple una condición sobre los datos del formulario.
// formData llega por registry.formContext (SchemaForm lo mantiene actualizado).
function resolveNoteOption(option, formData) {
  return typeof option === 'function' ? option(formData) : option;
}

export function NoteWidget({ label, options, formContext }) {
  const formData = formContext?.formData ?? {};
  if (options?.when && !options.when(formData)) return null;
  const text = resolveNoteOption(options?.text, formData);
  const title = resolveNoteOption(options?.title, formData) ?? label;
  return (
    <Callout
      variant={options?.variant}
      title={title}
      icon={options?.icon}
      bgColor={options?.bgColor}
      textColor={options?.textColor}
      iconColor={options?.iconColor}
      borderColor={options?.borderColor}
    >
      {text}
    </Callout>
  );
}

export function BadgeWidget({ label, options, formContext }) {
  const formData = formContext?.formData ?? {};
  if (options?.when && !options.when(formData)) return null;
  const text = resolveNoteOption(options?.text, formData) ?? label;
  return (
    <Badge
      icon={options?.icon}
      label={resolveNoteOption(options?.badgeLabel, formData)}
      value={text}
      iconColor={options?.iconColor}
      bgColor={options?.bgColor}
      borderColor={options?.borderColor}
      labelColor={options?.labelColor}
      valueColor={options?.valueColor}
      style={{ alignSelf: 'flex-start', width: 'fit-content' }}
    />
  );
}

export const SCHEMA_FORM_WIDGETS = {
  NoteWidget,
  BadgeWidget,
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
  AudioWidget,
  RadioWidget,
  ColorWidget,
  RangeWidget,
  // rjsf resuelve estos por 'format' (prioridad sobre 'type') a sus propios
  // widgets nativos sin estilo — se pisan para que también usen Input.
  EmailWidget: TextWidget,
  URLWidget: TextWidget,
  PasswordWidget,
};
