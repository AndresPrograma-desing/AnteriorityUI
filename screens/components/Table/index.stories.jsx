import React, { useState } from 'react';
import Table from './index';
import { Info, RefreshCw } from 'lucide-react';

export default {
  title: 'Components/Table',
  component: Table,
  argTypes: { variant: { control: 'inline-radio', options: ['A', 'B', 'results'] } },
};

const data = [
  { id: 1, name: 'Firulais', species: 'Perro', status: 'Activo' },
  { id: 2, name: 'Michi', species: 'Gato', status: 'Inactivo' },
  { id: 3, name: 'Piolin', species: 'Ave', status: 'Activo' },
];

// Las columnas aceptan header/accessor (estilo TableA) o label/key (estilo TableB), en cualquier variante.
const columnsA = [
  { header: 'Nombre', accessor: 'name' },
  { header: 'Especie', accessor: 'species' },
  { header: 'Estado', accessor: 'status' },
];

const columnsB = [
  { key: 'name', label: 'Nombre' },
  { key: 'species', label: 'Especie' },
  { key: 'status', label: 'Estado', type: 'badge', badgeType: (row) => (row.status === 'Activo' ? 'success' : 'warning') },
  {
    key: 'actions',
    label: 'Acciones',
    type: 'actions',
    align: 'right',
    actions: [{ label: 'Editar', onClick: (row) => console.log('edit', row) }],
  },
];

export const VarianteA = {
  args: { variant: 'A', columns: columnsA, data, keyExtractor: (row) => row.id },
};

export const VarianteB = {
  args: { variant: 'B', columns: columnsB, data },
};

const resultsSchema = {
  type: 'array', items: { type: 'object', properties: {
    muestra: { type: 'string', title: 'Muestra analizada' },
    pureza: { type: 'number', title: 'Pureza' },
    ph: { type: 'number', title: 'Nivel de pH' },
    concentracion: { type: 'number', title: 'Concentración' },
    estado: { type: 'string', title: 'Evaluación' },
  } },
};
const resultsUiSchema = {
  muestra: { 'ui:options': { secondaryKey: 'codigo', action: { icon: Info, label: 'Ver muestra', onClick: (row) => console.log('Muestra', row) } } },
  pureza: { 'ui:options': { formatValue: (value) => `${value}%`, cellColor: (row) => row.pureza < 90 ? '#b45309' : '#047857' } },
  ph: { 'ui:options': { formatValue: (value) => Number(value).toFixed(1) } },
  concentracion: { 'ui:options': { formatValue: (value) => `${value} mg/L`, action: { icon: RefreshCw, label: 'Repetir medición', onClick: (row) => console.log('Repetir', row) } } },
  estado: { 'ui:options': { cellBgColor: (row) => row.estado === 'Revisar' ? '#fff7e9' : '#edfaf4', cellColor: (row) => row.estado === 'Revisar' ? '#9a5b12' : '#087551' } },
};

export const ResultadosDesdeSchema = {
  args: {
    variant: 'results', schema: resultsSchema, uiSchema: resultsUiSchema,
    data: [
      { id: 1, muestra: 'Agua de entrada', codigo: 'LAB-042', pureza: 98.6, ph: 7.2, concentracion: 12.4, estado: 'Óptimo' },
      { id: 2, muestra: 'Filtro de carbono', codigo: 'LAB-043', pureza: 87.1, ph: 6.4, concentracion: 24.8, estado: 'Revisar' },
      { id: 3, muestra: 'Agua tratada', codigo: 'LAB-044', pureza: 99.2, ph: 7.0, concentracion: 4.1, estado: 'Óptimo' },
    ],
    summary: { muestra: 'Resumen del lote', pureza: 94.9, ph: 6.9, concentracion: 13.8, estado: '3 muestras' },
  },
};

// Estado de carga de la variante results, con el mismo esquema y colores por defecto.
export const ResultadosCargando = {
  args: {
    variant: 'results', schema: resultsSchema, uiSchema: resultsUiSchema,
    loading: true, skeletonRows: 4,
  },
};

export const ResultadosPersonalizadosCargando = {
  args: {
    variant: 'results', schema: resultsSchema, uiSchema: resultsUiSchema,
    loading: true, skeletonRows: 3,
    surfaceColor: '#f1f7f6', headerColor: '#ffffff', accentColor: '#168474',
    alternateCellBgColor: '#e8f3f0', summaryBgColor: '#d5ece6',
    summaryTextColor: '#14594f',
    resultsScrollBarProps: { autoHide: false },
    resultsSkeletonProps: { height: '22px', radius: '10px', style: { backgroundColor: '#b4d9cf' } },
  },
};

// Mismas funciones en ambas variantes: filas expandibles y badges también en la A.
export const VarianteAConExpandibleYBadges = {
  args: {
    variant: 'A',
    columns: columnsB.filter((c) => c.type !== 'actions'),
    data,
    expandable: { expandedRowRender: (row) => <div>Detalle de {row.name}</div> },
  },
};

export const ConFiltroYClick = {
  render: (args) => {
    const [filtro, setFiltro] = useState('');
    const rows = filtro ? data.filter((r) => r.status === filtro) : data;
    return (
      <Table
        {...args}
        columns={[
          { header: 'Nombre', accessor: 'name' },
          {
            header: 'Estado',
            accessor: 'status',
            filter: {
              value: filtro,
              onChange: setFiltro,
              options: [
                { value: '', label: 'Todos' },
                { value: 'Activo', label: 'Activos' },
                { value: 'Inactivo', label: 'Inactivos' },
              ],
            },
          },
        ]}
        data={rows}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => console.log('click', row)}
      />
    );
  },
  args: { variant: 'B' },
};

export const Cargando = { args: { variant: 'A', columns: columnsA, loading: true } };
export const Vacia = { args: { variant: 'B', columns: columnsA, data: [] } };

// Tabla dinámica: las columnas salen de un JSON Schema (+ uiSchema opcional). El `type` se deduce
// del schema (boolean → switch, format date → date, format uri → link, number → número alineado)
// y se puede forzar con 'ui:widget'. Los handlers y demás props de columna van en 'ui:options'.
const personasSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      nombre: { type: 'string', title: 'Nombre' },
      apellido: { type: 'string', title: 'Apellido' },
      sitio: { type: 'string', format: 'uri', title: 'Sitio web' },
      nacimiento: { type: 'string', format: 'date', title: 'Nacimiento' },
      puntos: { type: 'integer', title: 'Puntos' },
      plan: { type: 'string', title: 'Plan', enum: ['free', 'pro'], enumNames: ['Gratis', 'Pro'] },
      activo: { type: 'boolean', title: 'Activo' },
      verificado: { type: 'boolean', title: 'Verificado' },
      ver: { type: 'string', title: 'Acciones' },
    },
  },
};

export const TablaDinamicaDesdeSchema = {
  render: (args) => {
    const [rows, setRows] = useState([
      { id: 1, nombre: 'Ana Gómez', sitio: 'https://ana.dev', nacimiento: '1994-03-12', puntos: 1250, plan: 'pro', activo: true, verificado: true },
      { id: 2, nombre: 'Luis Pérez', sitio: 'https://luis.io', nacimiento: '1988-11-02', puntos: 430, plan: 'free', activo: false, verificado: false },
    ]);
    const setField = (key) => (row, next) =>
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [key]: next } : r)));

    const uiSchema = {
      nombre: { 'ui:widget': 'input', 'ui:options': { onChange: setField('nombre') } },
      puntos: { 'ui:widget': 'input', 'ui:options': { onChange: setField('puntos'), width: '120px' } },
      plan: { 'ui:widget': 'select', 'ui:options': { onChange: setField('plan') } },
      activo: { 'ui:options': { onChange: setField('activo'), align: 'center' } },
      verificado: { 'ui:widget': 'checkbox', 'ui:options': { onChange: setField('verificado'), align: 'center' } },
      ver: {
        'ui:widget': 'button',
        'ui:options': { label: 'Ver ficha', onClick: (row) => alert(`Ficha de ${row.nombre}`), align: 'right' },
      },
    };

    return <Table {...args} schema={personasSchema} uiSchema={uiSchema} data={rows} keyExtractor={(r) => r.id} />;
  },
  args: { variant: 'B' },
};

// Lo mismo con columnas explícitas (sin schema): cada `type` con sus props.
export const ColumnasConTiposDeCampo = {
  args: {
    variant: 'A',
    keyExtractor: (r) => r.id,
    data: [{ id: 1, titulo: 'Informe Q3', url: 'https://example.com', fecha: '2026-10-30T14:30:00', publicado: true, aprobado: false }],
    columns: [
      { key: 'titulo', label: 'Título' },
      { key: 'url', label: 'Enlace', type: 'link', text: 'Abrir' },
      { key: 'fecha', label: 'Fecha', type: 'date', format: 'datetime' },
      { key: 'publicado', label: 'Publicado', type: 'switch', onChange: (row, next) => console.log('publicado', row.id, next) },
      { key: 'aprobado', label: 'Aprobado', type: 'checkbox', onChange: (row, next) => console.log('aprobado', row.id, next) },
      { key: 'x', type: 'button', label: 'Editar', onClick: (row) => console.log('editar', row) },
    ],
  },
};

// Variante B completa desde schema: badge, columna de acciones (varias) y filas expandibles.
// `expandable` es una prop de la tabla (no de una columna), así que va aparte del schema.
const mascotasSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      nombre: { type: 'string', title: 'Nombre' },
      especie: { type: 'string', title: 'Especie' },
      estado: { type: 'string', title: 'Estado', enum: ['activo', 'inactivo'], enumNames: ['Activo', 'Inactivo'] },
      ingreso: { type: 'string', format: 'date', title: 'Ingreso' },
      acciones: { type: 'string', title: 'Acciones' },
    },
  },
};

const mascotasUiSchema = {
  estado: { 'ui:widget': 'badge', 'ui:options': { badgeType: (row) => (row.estado === 'activo' ? 'success' : 'warning') } },
  acciones: {
    'ui:widget': 'actions',
    'ui:options': {
      align: 'right',
      actions: [
        { label: 'Editar', onClick: (row) => console.log('editar', row) },
        { label: 'Eliminar', onClick: (row) => console.log('eliminar', row), disabled: (row) => row.estado === 'activo' },
      ],
    },
  },
};

export const VarianteBDesdeSchema = {
  args: {
    variant: 'B',
    schema: mascotasSchema,
    uiSchema: mascotasUiSchema,
    keyExtractor: (r) => r.id,
    data: [
      { id: 1, nombre: 'Firulais', especie: 'Perro', estado: 'activo', ingreso: '2025-01-15' },
      { id: 2, nombre: 'Michi', especie: 'Gato', estado: 'inactivo', ingreso: '2025-06-03' },
    ],
    expandable: { expandedRowRender: (row) => <div>Historial clínico de {row.nombre}</div> },
  },
};
