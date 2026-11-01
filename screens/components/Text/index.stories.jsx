import React from 'react';
import Text from './index';

export default {
  title: 'Components/Text',
  component: Text,
};

export const Heading1 = {
  args: {
    variant: 'h1',
    children: 'Título principal',
  },
};

export const CustomColorAndAlign = {
  args: {
    variant: 'h2',
    children: 'Título centrado en color personalizado',
    color: '#2563eb',
    align: 'center',
  },
};

export const RiseAndFadeAnimation = {
  args: {
    variant: 'h1',
    children: 'Palabra que sube y desaparece',
    animate: 'rise-and-fade',
    riseDelay: 500,
    riseDuration: 1200,
    color: '#8b5cf6',
    align: 'center',
  },
};

export const FadeInAnimation = {
  args: {
    variant: 'h1',
    children: 'Apareciendo suavemente con Fade In completo',
    animate: 'fade-in',
    duration: 1000,
    color: '#0d52f8',
  },
};

export const FadeOutAnimation = {
  args: {
    variant: 'h2',
    children: 'Desapareciendo suavemente con Fade Out completo',
    animate: 'fade-out',
    duration: 1200,
    color: '#ef4444',
  },
};

export const LetterFadeIn = {
  args: {
    variant: 'h1',
    children: 'Texto que va apareciendo de transparente a visible letra por letra...',
    animate: 'letter-fade-in',
    duration: 1500,
    color: '#0284c7',
  },
};

export const LetterFadeOut = {
  args: {
    variant: 'h2',
    children: 'Texto que va desapareciendo letra por letra de atrás hacia adelante...',
    animate: 'letter-fade-out',
    duration: 1500,
    color: '#d97706',
  },
};

export const FastTyping = {
  args: {
    variant: 'body',
    children: 'Escribiendo texto rápido a 30ms por letra...',
    animate: 'typing',
    typingSpeed: 30,
    color: '#16a34a',
  },
};

export const WithIcon = {
  args: { variant: 'h2', children: 'Título con ícono', icon: 'SiReact', iconColor: '#06b6d4' },
};

export const WithEmoji = {
  args: { variant: 'h2', children: 'Título con emoji', icon: '🚀' },
};

export const IconAtEnd = {
  args: { children: 'Ícono al final', icon: 'FaHeart', iconColor: '#e11d48', iconPosition: 'end' },
};

export const InlineIconsAndEmojis = {
  args: {
    children: 'Hecho con {icon:SiReact:#06b6d4} React y {icon:FaHeart:#e11d48} mucho cariño 🚀🎉',
  },
};

export const InlineIconsTyping = {
  args: {
    animate: 'typing',
    typingSpeed: 60,
    children: 'Escribiendo con {icon:SiReact:#06b6d4} íconos y emojis 👨‍👩‍👧 incluidos',
  },
};

export const Markdown = {
  args: {
    markdown: true,
    children: [
      '## Markdown con {icon:SiMarkdown} íconos',
      '',
      'Texto **en negrita**, _cursiva_ y {color:#2563eb}color{/color} con emojis 🎉 y {icon:FaHeart:#e11d48} íconos.',
      '',
      '- Item con {icon:LuCheck:#16a34a} check',
      '- Otro item ✅',
      '',
      '| Pack | Íconos |',
      '|---|---|',
      '| Simple Icons | {icon:SiGithub} |',
    ].join('\n'),
  },
};

export const MarkdownWithIconProp = {
  args: { markdown: true, icon: '💡', children: 'Un **tip** con el emoji elegido en `EmojiPicker`.' },
};
