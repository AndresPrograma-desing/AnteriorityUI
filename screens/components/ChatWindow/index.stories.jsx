import React from 'react';
import ChatWindow from './Index';

export default {
  title: 'Components/ChatWindow',
  component: ChatWindow,
};

const currentUser = { id: 'user-1' };

const selectedContact = {
  id: 'contact-1',
  name: 'María González',
  avatarUrl: '',
  raw: { email: 'maria@example.com' },
};

const messages = [
  { id: 1, from: 'contact-1', content: 'Hola, ¿cómo estás?', createdAt: new Date().toISOString() },
  { id: 2, from: 'user-1', content: 'Todo bien, ¿y vos? **Gracias por escribir**', createdAt: new Date().toISOString() },
  { id: 3, from: 'contact-1', content: 'Podés revisar esto: $Sitio|https://example.com$', createdAt: new Date().toISOString() },
];

export const Default = {
  args: {
    messages,
    currentUser,
    selectedContact,
    onSend: (text) => console.log('send', text),
  },
};

export const Typing = {
  args: {
    messages,
    currentUser,
    selectedContact,
    isTyping: true,
    onSend: (text) => console.log('send', text),
  },
};

export const LoadingThread = {
  args: {
    messages: [],
    currentUser,
    selectedContact,
    isLoading: true,
    onSend: (text) => console.log('send', text),
  },
};

export const MobileView = {
  args: {
    messages,
    currentUser,
    selectedContact,
    isMobile: true,
    handleBackToList: () => console.log('back to list'),
    onSend: (text) => console.log('send', text),
  },
};
