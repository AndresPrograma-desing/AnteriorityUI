import React, { useState } from 'react';
import TableB from './index';

export default {
  title: 'Components/TableB',
  component: TableB,
};

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'species', label: 'Especie' },
  { key: 'status', label: 'Estado', type: 'badge', badgeType: (row) => (row.status === 'Activo' ? 'success' : 'warning') },
  {
    key: 'actions',
    label: 'Acciones',
    type: 'actions',
    align: 'right',
    actions: [
      { label: 'Editar', onClick: (row) => console.log('edit', row) },
      { label: 'Eliminar', onClick: (row) => console.log('delete', row) },
    ],
  },
];

const data = [
  { id: 1, name: 'Firulais', species: 'Perro', status: 'Activo' },
  { id: 2, name: 'Michi', species: 'Gato', status: 'Inactivo' },
  { id: 3, name: 'Piolin', species: 'Ave', status: 'Activo' },
];

export const Default = {
  args: {
    columns,
    data,
    rowKey: 'id',
  },
};

export const Expandable = {
  args: {
    columns,
    data,
    rowKey: 'id',
    expandable: {
      rowExpandable: () => true,
      expandedRowRender: (row) => (
        <div style={{ padding: '8px 0' }}>
          <p style={{ margin: 0 }}>Detalles adicionales para {row.name}</p>
        </div>
      ),
    },
  },
};

export const Loading = {
  args: {
    columns,
    data: [],
    skeletonRows: 4,
    loading: true,
  },
};

export const ErrorState = {
  args: {
    columns,
    data: [],
    error: 'Error al cargar la información',
  },
};

export const Empty = {
  args: {
    columns,
    data: [],
    emptyMessage: 'No hay mascotas registradas',
  },
};

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'Activo', label: 'Activo' },
  { value: 'Inactivo', label: 'Inactivo' },
];

export const WithColumnFilter = {
  render: () => {
    const [statusFilter, setStatusFilter] = useState('');

    const filterableColumns = [
      { key: 'name', label: 'Nombre' },
      { key: 'species', label: 'Especie' },
      {
        key: 'status',
        label: 'Estado',
        type: 'badge',
        badgeType: (row) => (row.status === 'Activo' ? 'success' : 'warning'),
        filter: {
          options: STATUS_FILTER_OPTIONS,
          value: statusFilter,
          onChange: setStatusFilter,
        },
      },
    ];

    const filteredData = statusFilter ? data.filter((row) => row.status === statusFilter) : data;

    return <TableB columns={filterableColumns} data={filteredData} rowKey="id" />;
  },
};
