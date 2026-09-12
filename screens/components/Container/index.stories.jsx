import React from 'react';
import Container from './index';

export default {
  title: 'Components/Container',
  component: Container,
};

export const Default = {
  args: {
    children: <p>Contenido de ejemplo dentro del contenedor.</p>,
  },
};

export const WithPagination = {
  args: {
    children: <p>Lista de resultados paginados.</p>,
    showPagination: true,
    paginationCount: 50,
    paginationPage: 1,
    pageSize: 10,
    onPaginationChange: (page) => console.log('page changed', page),
    onPageSizeChange: (size) => console.log('page size changed', size),
  },
};

export const CustomClassName = {
  args: {
    children: <p>Contenedor con clase personalizada.</p>,
    className: 'custom-container',
  },
};
