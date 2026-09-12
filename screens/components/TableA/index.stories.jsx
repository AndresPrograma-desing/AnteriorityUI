import React, { useState } from 'react';
import TableA from './index';
import { CheckCircle, XCircle } from 'lucide-react';

export default {
  title: 'Components/TableA',
  component: TableA,
};

const columns = [
  { header: 'Nombre', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Estado',
    accessor: 'active',
    align: 'center',
    width: '120px',
    render: (row) =>
      row.active ? (
        <CheckCircle size={18} color="var(--button-green, #16a34a)" />
      ) : (
        <XCircle size={18} color="var(--color-danger, #ef4444)" />
      ),
  },
];

const data = [
  { id: 1, name: 'Ana Gomez', email: 'ana@correo.com', active: true },
  { id: 2, name: 'Luis Perez', email: 'luis@correo.com', active: false },
  { id: 3, name: 'Marta Ruiz', email: 'marta@correo.com', active: true },
];

export const Default = {
  args: {
    columns,
    data,
    keyExtractor: (row) => row.id,
  },
};

export const Loading = {
  args: {
    columns,
    data: [],
    keyExtractor: (row) => row.id,
    loading: true,
    skeletonRows: 4,
  },
};

export const ErrorState = {
  args: {
    columns,
    data: [],
    keyExtractor: (row) => row.id,
    error: 'No se pudieron cargar los datos.',
    onRetry: () => console.log('retry clicked'),
  },
};

export const Empty = {
  args: {
    columns,
    data: [],
    keyExtractor: (row) => row.id,
    emptyMessage: 'No hay usuarios registrados',
  },
};

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

export const WithColumnFilter = {
  render: () => {
    const [statusFilter, setStatusFilter] = useState('');

    const filterableColumns = [
      { header: 'Nombre', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      {
        header: 'Estado',
        accessor: 'active',
        align: 'center',
        width: '150px',
        filter: {
          options: STATUS_FILTER_OPTIONS,
          value: statusFilter,
          onChange: setStatusFilter,
        },
        render: (row) =>
          row.active ? (
            <CheckCircle size={18} color="var(--button-green, #16a34a)" />
          ) : (
            <XCircle size={18} color="var(--color-danger, #ef4444)" />
          ),
      },
    ];

    const filteredData = data.filter((row) => {
      if (statusFilter === 'active') return row.active;
      if (statusFilter === 'inactive') return !row.active;
      return true;
    });

    return (
      <TableA
        columns={filterableColumns}
        data={filteredData}
        keyExtractor={(row) => row.id}
      />
    );
  },
};
