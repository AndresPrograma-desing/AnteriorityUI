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

export const CustomBorder = {
  args: {
    children: <p>Contenedor con borde personalizado.</p>,
    borderColor: 'rgba(15, 23, 42, 0.2)',
  },
};

export const WithBackgroundImage = {
  args: {
    children: <p style={{ color: '#fff' }}>Contenedor con imagen de fondo.</p>,
    bgImage: 'https://picsum.photos/seed/anteriority/1300/700',
    style: { minHeight: '400px' },
  },
};

export const WithBlurredBackground = {
  args: {
    children: <p style={{ color: '#fff' }}>Contenedor con imagen de fondo difuminada.</p>,
    bgImage: 'https://picsum.photos/seed/anteriority/1300/700',
    blurBackground: true,
    style: { minHeight: '400px' },
  },
};

