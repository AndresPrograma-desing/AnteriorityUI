import React from 'react';
import Avatar from './index';
import { User, Star, Shield } from 'lucide-react';

export default {
  title: 'Components/Avatar',
  component: Avatar,
};

export const WithImage = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    alt: 'Natacha',
    size: 40,
  },
};

export const WithLetters = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Martin Perez" size={40} />
      <Avatar name="Lucia Gomez" size={40} />
      <Avatar name="Carlos Ramirez" size={40} />
      <Avatar size={40}>M</Avatar>
    </div>
  ),
};

export const WithIcons = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar icon={User} size={40} bgColor="#3b82f6" />
      <Avatar icon={Shield} size={40} bgColor="#10b981" />
      <Avatar icon={Star} size={40} bgColor="#f59e0b" />
    </div>
  ),
};

export const Shapes = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar shape="circle" size={40} name="Circle" />
      <Avatar shape="rounded" size={40} name="Rounded" />
      <Avatar shape="square" size={40} name="Square" />
    </div>
  ),
};
