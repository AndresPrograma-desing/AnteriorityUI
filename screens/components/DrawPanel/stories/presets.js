// ---------------------------------------------------------------------------
// Qué JSON espera el demo del DrawPanel (formulario + seguimiento del envío)
//
//   {
//     "title": "Nueva solicitud",
//     "schema": { ... },              // JSON Schema del formulario (DrawPanel `schema`)
//     "uiSchema": { ... },            // opcional (rjsf)
//     "steps": [                      // etapas del envío -> Stepper vertical (`showStepper`)
//       { "label": "Iniciando envío", "description": "..." }
//     ],
//     "stepMs": 1200,                 // duración simulada de cada etapa (ms)
//     "failAt": [2]                   // índices (0-based) de etapas que fallan la 1ª vez: el
//   }                                 // footer ofrece "Reintentar", que retoma en esa etapa
// ---------------------------------------------------------------------------

export const DEFAULT_JSON_PROGRESS = {
  title: 'Nueva solicitud',
  schema: {
    type: 'object',
    required: ['nombre', 'email'],
    properties: {
      nombre: { type: 'string', title: 'Nombre' },
      email: { type: 'string', title: 'Email', format: 'email' },
      tipo: { type: 'string', title: 'Tipo', enum: ['Residencial', 'Comercial', 'Industrial'] },
    },
  },
  uiSchema: {},
  steps: [
    { label: 'Iniciando envío', description: 'Preparando la solicitud' },
    { label: 'Recolectando datos', description: 'Reuniendo la información del formulario' },
    { label: 'Validando', description: 'Verificando que todo esté correcto' },
    { label: 'Entregado', description: 'La solicitud llegó a destino' },
  ],
  stepMs: 1200,
  failAt: [2],
};
