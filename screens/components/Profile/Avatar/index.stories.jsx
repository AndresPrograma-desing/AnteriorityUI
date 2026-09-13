import React from 'react';
import UserAvatar from './index';

export default {
  title: 'Components/Profile/Avatar',
  component: UserAvatar,
};

export const Default = {
  args: {
    name: 'Ana Gomez',
    size: 48,
  },
};

export const WithImage = {
  args: {
    name: 'Luis Perez',
    src: 'https://i.pravatar.cc/100?img=12',
    size: 48,
    viewable: true,
  },
};

export const Editable = {
  args: {
    name: 'Marta Ruiz',
    size: 64,
    editable: true,
    onEditClick: () => console.log('edit avatar clicked'),
  },
};

export const WithStatusDot = {
  args: {
    name: 'Carlos Diaz',
    size: 48,
    isActive: true,
  },
};

export const LoadingState = {
  args: {
    name: 'Ana Gomez',
    size: 48,
    loading: true,
  },
};
