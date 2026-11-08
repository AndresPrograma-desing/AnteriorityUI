// Presets para la story «Editor» de planilla desde JSON: cada uno con su esquema y sus datos, en JSON puro.
import { sampleData, sampleSchema } from './jsonSample.js';

export const presets = [
  {
    id: 'tareas',
    label: 'Tareas (esquema completo)',
    schema: sampleSchema,
    data: sampleData.slice(0, 8),
  },
  {
    id: 'clientes',
    label: 'Clientes (email, patrón, requerido)',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        required: ['nombre', 'email'],
        properties: {
          nombre: { type: 'string', title: 'Nombre', minLength: 2, 'x-message': 'El nombre necesita al menos 2 letras' },
          email: { type: 'string', format: 'email', title: 'Correo' },
          telefono: { type: 'string', title: 'Teléfono', pattern: '^[0-9+() -]{6,20}$' },
          plan: { type: 'string', title: 'Plan', enum: ['free', 'pro', 'enterprise'] },
          alta: { type: 'string', format: 'date', title: 'Fecha de alta' },
          activo: { type: 'boolean', title: 'Activo' },
        },
      },
    },
    data: [
      { nombre: 'Ana Gómez', email: 'ana@correo.com', telefono: '+54 11 5555-1234', plan: 'pro', alta: '2025-03-12', activo: true },
      { nombre: 'Luis Pérez', email: 'luis@correo.com', telefono: '011 4444-9876', plan: 'free', alta: '2025-11-02', activo: false },
      { nombre: 'Marta Ruiz', email: 'marta@correo.com', telefono: '+34 600 123 456', plan: 'enterprise', alta: '2024-07-30', activo: true },
    ],
  },
  {
    id: 'productos',
    label: 'Productos (números y rangos)',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        required: ['sku'],
        properties: {
          sku: { type: 'string', title: 'SKU', pattern: '^[A-Z]{3}-[0-9]{3}$', 'x-message': 'SKU con formato ABC-123' },
          descripcion: { type: 'string', title: 'Descripción', maxLength: 40 },
          precio: { type: 'number', title: 'Precio', minimum: 0 },
          stock: { type: 'integer', title: 'Stock', minimum: 0, maximum: 10000 },
          descuento: { type: 'number', title: 'Descuento (%)', minimum: 0, maximum: 100 },
          vence: { type: 'string', format: 'date-time', title: 'Vence' },
        },
      },
    },
    data: [
      { sku: 'ABC-001', descripcion: 'Teclado mecánico', precio: 89.9, stock: 120, descuento: 10, vence: '2027-01-31T00:00:00' },
      { sku: 'ABC-002', descripcion: 'Mouse inalámbrico', precio: 34.5, stock: 300, descuento: 0, vence: '2027-03-15T12:30:00' },
      { sku: 'XYZ-777', descripcion: 'Monitor 27 pulgadas', precio: 319, stock: 18, descuento: 5, vence: '2028-06-01T00:00:00' },
    ],
  },
  {
    id: 'sin-esquema',
    label: 'Sin esquema (columnas desde las claves)',
    schema: null,
    data: [
      { ciudad: 'Buenos Aires', habitantes: 3120612, fundada: '1580-06-11', capital: true },
      { ciudad: 'Córdoba', habitantes: 1391000, fundada: '1573-07-06', capital: false },
      { ciudad: 'Rosario', habitantes: 1193605, fundada: '1725-10-07', capital: false },
    ],
  },
];
