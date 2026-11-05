import React, { useState } from 'react';
import { Gem } from 'lucide-react';
import Carousel from './index';
import Button from '../Button/index';
import Input from '../Input/index';
import Checks from '../Checks/index';
import CardV1 from '../CardV1/index';

export default {
  title: 'Components/Carousel',
  component: Carousel,
};

const mixedSlides = [
  { id: 'img', src: 'https://picsum.photos/seed/anteriority-1/1200/600', alt: 'Paisaje', caption: 'Imagen con caption' },
  {
    id: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://picsum.photos/seed/anteriority-2/1200/600',
    caption: 'Video (se pausa al salir del slide)',
  },
  {
    id: 'text',
    title: 'Texto plano',
    content: 'Un slide de texto simple. Sirve para anuncios o mensajes cortos.',
    type: 'text',
  },
  {
    id: 'md',
    title: 'Markdown',
    content: [
      'Soporta **negritas**, *itálica*, listas y links:',
      '',
      '- Primer punto',
      '- Segundo punto con [un link](https://example.com)',
      '',
      '`código inline` y bloques de código.',
    ].join('\n'),
  },
];

export const Default = {
  args: {
    slides: mixedSlides,
    height: 320,
  },
};

export const AutoPlayFade = {
  args: {
    slides: mixedSlides.filter((s) => s.type !== 'video'),
    autoPlay: true,
    interval: 3500,
    transition: 'fade',
    transitionDuration: 600,
    height: 280,
  },
};

export const ZoomTransition = {
  args: {
    slides: mixedSlides.filter((s) => s.type !== 'video'),
    transition: 'zoom',
    transitionDuration: 500,
    height: 280,
  },
};

export const NoLoopNoArrowsDotsOnly = {
  args: {
    slides: mixedSlides,
    loop: false,
    showArrows: false,
    height: 260,
  },
};

export const CustomRender = {
  args: {
    height: 220,
    slides: [
      {
        id: 'custom-1',
        render: ({ active }) => (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: '#1e293b', color: '#f8fafc' }}>
            <strong style={{ fontSize: '1.4rem' }}>{active ? 'Slide con render propio (activo)' : 'Inactivo'}</strong>
          </div>
        ),
      },
      {
        id: 'custom-2',
        render: () => (
          <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: '#0f766e', color: '#fff' }}>
            <span>Cualquier React node</span>
          </div>
        ),
      },
    ],
  },
};

export const CustomColors = {
  args: {
    slides: mixedSlides.filter((s) => s.type !== 'video'),
    height: 300,
    bgColor: '#0f172a',
    textColor: '#e2e8f0',
    captionBgColor: 'rgba(15, 23, 42, 0.85)',
    captionTextColor: '#f1f5f9',
    arrowColor: '#38bdf8',
    arrowBgColor: 'rgba(15, 23, 42, 0.7)',
    dotColor: 'rgba(56, 189, 248, 0.35)',
    dotActiveColor: '#38bdf8',
  },
};

// Solo slides de texto (plain): título + párrafo, 5 capas.
const textOnlySlides = [
  { id: 't1', type: 'text', title: 'Bienvenido', content: 'Este carrusel muestra únicamente textos, sin imágenes ni videos.' },
  { id: 't2', type: 'text', title: 'Transiciones', content: 'Deslizá con las flechas, los puntos, el teclado o con swipe.' },
  { id: 't3', type: 'text', title: 'Responsive', content: 'El alto se ajusta con la prop height y el ancho sigue al contenedor.' },
  { id: 't4', type: 'text', title: 'Colores', content: 'Fondo, texto, flechas y puntos se configuran por props.' },
  { id: 't5', type: 'text', title: 'Fin', content: 'Al llegar al último, el carrusel continúa con el primero.' },
];

export const TextOnly = {
  args: {
    slides: textOnlySlides,
    height: 220,
    autoPlay: true,
    interval: 4000,
  },
};

// Slides con componentes de React de la librería: cards, inputs, botones, checks.
// Ojo: el teclado (← →) y el swipe siguen activos mientras se escribe en el input.
const ReactSlidesDemo = (args) => {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const slides = [
    {
      id: 'card',
      render: () => (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box' }}>
          <CardV1 primaryText="Plan Pro" secondaryText="Acceso completo a todas las funciones." footerIcon={Gem}>
            <Button size="small">Elegir plan</Button>
          </CardV1>
        </div>
      ),
    },
    {
      id: 'form',
      render: () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: 24, boxSizing: 'border-box', maxWidth: 420 }}>
          <Input label="Email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Checks label="Acepto los términos" checked={accepted} onChange={() => setAccepted((v) => !v)} />
          <Button disabled={!email || !accepted}>Suscribirme</Button>
        </div>
      ),
    },
    {
      id: 'actions',
      render: () => (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Button>Primario</Button>
          <Button variant={Button.VARIANTS.OUTLINE}>Outline</Button>
          <Button variant={Button.VARIANTS.DANGER}>Eliminar</Button>
        </div>
      ),
    },
  ];
  return <Carousel {...args} slides={slides} />;
};

export const WithReactComponents = {
  render: (args) => <ReactSlidesDemo {...args} />,
  args: {
    height: 320,
    showArrows: true,
    showDots: true,
  },
};

// Sin fondo azul: bgColor="transparent" quita el fondo default del carrusel y de los slides.
// Como el texto default es claro, aquí también se pasa textColor oscuro.
export const TransparentBackground = {
  args: {
    slides: textOnlySlides,
    height: 220,
    bgColor: 'transparent',
    textColor: '#1e293b',
    captionTextColor: '#1e293b',
    arrowColor: '#1e293b',
    arrowBgColor: 'rgba(15, 23, 42, 0.08)',
    dotColor: 'rgba(30, 41, 59, 0.3)',
    dotActiveColor: '#1e293b',
    focusColor: '#2563eb',
  },
};
