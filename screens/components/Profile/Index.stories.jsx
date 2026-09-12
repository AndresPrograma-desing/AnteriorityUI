import React from 'react';
import UserProfileHeader from './Index';

export default {
  title: 'Components/Profile',
  component: UserProfileHeader,
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--sidebar-bg, #0f172a)', padding: '16px', display: 'inline-block' }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    username: 'Ana Gomez',
    avatarUrl: '',
    onEditClick: () => console.log('edit clicked'),
  },
};

export const WithAvatarImage = {
  args: {
    username: 'Luis Perez',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
    onEditClick: () => console.log('edit clicked'),
  },
};

export const LongUsername = {
  args: {
    username: 'Maria Fernanda Rodriguez Castillo',
    avatarUrl: '',
    onEditClick: () => console.log('edit clicked'),
  },
};
