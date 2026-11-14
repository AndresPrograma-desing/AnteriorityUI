// ---------------------------------------------------------------------------
// Qué JSON espera el Container
//
//   {
//     "steps": [                       // → Stepper (showStepper se activa solo si hay steps)
//       {
//         "label": "Titular",          // texto del paso (obligatorio)
//         "description": "…",          // opcional (orientation vertical)
//         "error": false,              // opcional: marca el paso con error
//         "disabled": false,           // opcional
//         "schema": { … },             // JSON Schema del formulario de ESE paso
//         "uiSchema": { … }            // uiSchema (rjsf) de ese paso
//       }
//     ],
//     "schema": { … },                 // formulario único (si no hay steps, o en vez del de cada paso)
//     "uiSchema": { … }                // uiSchema del `schema` único / fallback de los pasos sin uiSchema
//   }
//
// uiSchema útil:  "ui:options": { "columns": 2, "columnFlow": "column" | "row" }  → columnas
//                 campo: { "ui:options": { "colSpan": "full" } }                   → ancho completo
//                 campo: { "ui:widget": "textarea" }, { "ui:options": { "variant": "outlined" } }
// ---------------------------------------------------------------------------

export const WIZARD_PRESET = {
  steps: [
    {
      label: 'Titular',
      schema: {
        type: 'object',
        required: ['nombre', 'email'],
        properties: {
          nombre: { type: 'string', title: 'Nombre o razón social' },
          documento: { type: 'string', title: 'Documento' },
          email: { type: 'string', title: 'Email de contacto', format: 'email' },
          telefono: { type: 'string', title: 'Teléfono' },
        },
      },
      uiSchema: { 'ui:options': { columns: 2 } },
    },
    {
      label: 'Ubicación',
      schema: {
        type: 'object',
        required: ['direccion', 'ciudad'],
        properties: {
          direccion: { type: 'string', title: 'Dirección de la instalación' },
          ciudad: { type: 'string', title: 'Ciudad' },
          codigoPostal: { type: 'string', title: 'Código postal' },
        },
      },
      uiSchema: { 'ui:options': { columns: 2 }, direccion: { 'ui:options': { colSpan: 'full' } } },
    },
    {
      label: 'Servicio',
      schema: {
        type: 'object',
        required: ['tipo'],
        properties: {
          tipo: { type: 'string', title: 'Tipo de conexión', enum: ['Residencial', 'Comercial', 'Industrial'] },
          potencia: { type: 'number', title: 'Potencia (kW)', minimum: 1 },
          urgente: { type: 'boolean', title: 'Instalación urgente' },
        },
      },
    },
    {
      label: 'Confirmar',
      schema: {
        type: 'object',
        properties: {
          notas: { type: 'string', title: 'Notas para el técnico' },
          acepta: { type: 'boolean', title: 'Confirmo que los datos son correctos' },
        },
      },
      uiSchema: { notas: { 'ui:widget': 'textarea' } },
    },
  ],
};

export const FORM_PRESET = {
  schema: {
    type: 'object',
    required: ['nombre', 'apellido', 'email'],
    properties: {
      nombre: { type: 'string', title: 'Nombre' },
      apellido: { type: 'string', title: 'Apellido' },
      email: { type: 'string', title: 'Email', format: 'email' },
      telefono: { type: 'string', title: 'Teléfono' },
      ciudad: { type: 'string', title: 'Ciudad' },
      codigoPostal: { type: 'string', title: 'Código postal' },
      mensaje: { type: 'string', title: 'Mensaje' },
    },
  },
  uiSchema: {
    'ui:options': { columns: 2, columnFlow: 'row' },
    mensaje: { 'ui:widget': 'textarea', 'ui:options': { colSpan: 'full' } },
  },
};

export const PRESETS = {
  'Wizard: Stepper + un schema por paso': WIZARD_PRESET,
  'Solo formulario (sin Stepper)': FORM_PRESET,
};

