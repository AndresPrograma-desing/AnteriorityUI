// Datos de ejemplo para las stories/demos de «Planilla desde JSON» (xlsxData + xlsxSchema).
const STATUS = ['todo', 'progress', 'review', 'done'];
const OWNERS = ['Ana Gómez', 'Luis Pérez', 'Marta Ruiz', 'Carlos Díaz'];

export const sampleSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'titulo', 'estado'],
    properties: {
      id: { type: 'integer', title: 'ID', minimum: 1 },
      titulo: { type: 'string', title: 'Título', minLength: 3, maxLength: 60 },
      estado: { type: 'string', title: 'Estado', enum: STATUS },
      responsable: { type: 'string', title: 'Responsable', pattern: '^[\\p{L} ]+$' },
      horas: { type: 'number', title: 'Horas', minimum: 0, maximum: 200 },
      vence: { type: 'string', format: 'date', title: 'Vence' },
      actualizado: { type: 'string', format: 'date-time', title: 'Actualizado' },
      urgente: { type: 'boolean', title: 'Urgente' },
      contacto: { type: 'string', format: 'email', title: 'Contacto' },
    },
  },
};

const pad = (n) => String(n).padStart(2, '0');
const isoDay = (offset) => {
  const d = new Date(Date.now() + offset * 86400000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const sampleData = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  titulo: `Tarea número ${i + 1}`,
  estado: STATUS[i % STATUS.length],
  responsable: OWNERS[i % OWNERS.length],
  horas: Math.round((((i * 7) % 40) + 2) * 10) / 10,
  vence: isoDay((i % 14) - 3),
  actualizado: `${isoDay(-(i % 5))}T${pad(8 + (i % 9))}:${pad((i * 11) % 60)}:00`,
  urgente: i % 5 === 0,
  contacto: `${OWNERS[i % OWNERS.length].split(' ')[0].toLowerCase()}@ejemplo.com`,
}));
