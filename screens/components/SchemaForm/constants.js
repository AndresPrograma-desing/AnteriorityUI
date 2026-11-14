export const DEFAULT_SUBMIT_TEXT = 'Enviar';

// Ancho del propio formulario (px) por debajo del cual `ui:options.columns` colapsa a una columna.
// Debe coincidir con el @container de index.module.css.
export const COLUMNS_COLLAPSE_WIDTH = 520;

// Mensajes de validación por defecto (clave = keyword de ajv, o `format:<nombre>` para formatos).
// Se pueden sobrescribir por prop `errorMessages` de SchemaForm.
export const ERROR_MESSAGES = {
  required: 'Este campo es obligatorio',
  type: ({ type }) => (type === 'number' || type === 'integer' ? 'Ingresá un número válido' : 'El valor no es válido'),
  'format:email': 'Ingresá un correo válido, por ejemplo nombre@dominio.com',
  'format:uri': 'Ingresá una URL válida, por ejemplo https://ejemplo.com',
  'format:date': 'Ingresá una fecha válida',
  format: ({ format }) => `El formato ${format} no es válido`,
  minimum: ({ limit }) => `El valor mínimo es ${limit}`,
  maximum: ({ limit }) => `El valor máximo es ${limit}`,
  exclusiveMinimum: ({ limit }) => `El valor debe ser mayor a ${limit}`,
  exclusiveMaximum: ({ limit }) => `El valor debe ser menor a ${limit}`,
  multipleOf: ({ multipleOf }) => `El valor debe ser múltiplo de ${multipleOf}`,
  minLength: ({ limit }) => `Debe tener al menos ${limit} caracteres`,
  maxLength: ({ limit }) => `Debe tener como máximo ${limit} caracteres`,
  pattern: 'El formato ingresado no es válido',
  enum: 'Elegí una de las opciones disponibles',
  minItems: ({ limit }) => `Elegí al menos ${limit} opción(es)`,
  maxItems: ({ limit }) => `Elegí como máximo ${limit} opción(es)`,
};

// AudioWidget: en un formulario, "Enviar" (default del AudioRecorder) se confundiría con el submit
// del formulario, así que el botón de confirmar la grabación dice "Guardar audio".
export const DEFAULT_AUDIO_SAVE_LABEL = 'Guardar audio';
export const DEFAULT_AUDIO_REMOVE_LABEL = 'Eliminar audio';

// Claves de `ui:options` que AudioWidget reenvía al AudioRecorder (límite, bitrate, labels y
// colores). El resto de las options de rjsf (enumOptions, etc.) no se reenvía.
export const AUDIO_RECORDER_OPTION_KEYS = [
  'maxDurationSeconds',
  'audioBitsPerSecond',
  'recordLabel',
  'stopLabel',
  'discardLabel',
  'sendLabel',
  'sendingLabel',
  'bgColor',
  'borderColor',
  'textColor',
  'accentColor',
  'recordingColor',
  'errorColor',
  'iconBgColor',
  'senderName',
  'senderAvatar',
  'avatarBgColor',
  'avatarTextColor',
];
