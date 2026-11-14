// Prefijo del `id` del <form> que el DrawPanel genera solo cuando recibe un `schema` y no se le
// pasó `formId` (el botón confirmar del footer lo usa con el atributo `form` para enviar el
// formulario aunque esté fuera del <form>).
export const DEFAULT_SCHEMA_FORM_ID_PREFIX = 'drawpanel-form-';

// Texto mostrado cuando se pasa `schema` pero no se pudo cargar SchemaForm (típicamente porque el
// proyecto consumidor no instaló la peer dependency opcional @rjsf/core).
export const DEFAULT_SCHEMA_MISSING_LABEL =
  'No se pudo cargar el formulario. Verificá que @rjsf/core esté instalado.';

// Diámetro (px) de los círculos del Stepper del panel (showStepper): más chicos que los del Stepper
// suelto para que el vertical no quede corto. Se pisa con `stepperProps={{ size }}`.
export const DEFAULT_STEPPER_SIZE = 28;

// Espacio (px) entre pasos del Stepper del panel. Se pisa con `stepperProps={{ stepGap }}`.
export const DEFAULT_STEPPER_GAP = 36;
