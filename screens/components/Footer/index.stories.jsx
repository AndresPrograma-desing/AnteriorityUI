import React from 'react';
import { Save, X, Trash2 } from 'lucide-react';
import Footer from './index';
import Button from '../Button/index';

export default {
  title: 'Components/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
};

// Barra inferior con texto a la izquierda y acciones a la derecha.
export const Basico = {
  args: {
    left: '3 cambios sin guardar',
    actions: [
      { key: 'cancel', label: 'Cancelar', icon: X, onClick: () => console.log('cancelar') },
      { key: 'save', label: 'Guardar', icon: Save, onClick: () => console.log('guardar') },
    ],
  },
};

// Zonas personalizadas: botones propios en cada lado y un texto al centro.
export const ZonasPersonalizadas = {
  render: () => (
    <Footer
      left={<Button variant="outline" size="small">Volver</Button>}
      center="Paso 2 de 4"
      right={
        <>
          <Button variant="danger" size="small" icon={Trash2}>Eliminar</Button>
          <Button size="small">Continuar</Button>
        </>
      }
    />
  ),
};

// Barra gruesa y oscura, con colores propios y pegada abajo (sticky dentro de un contenedor con scroll).
export const GruesaOscura = {
  args: {
    height: 88,
    bgColor: '#0f172a',
    textColor: '#e2e8f0',
    borderColor: '#334155',
    left: 'Borrador guardado hace 2 min',
    actions: [
      { key: 'discard', label: 'Descartar', onClick: () => console.log('descartar') },
      { key: 'publish', label: 'Publicar', onClick: () => console.log('publicar') },
    ],
  },
};

// Colores propios: fondo, texto, borde y acento (para la acción principal).
export const ColoresPropios = {
  args: {
    bgColor: '#eef2ff',
    textColor: '#312e81',
    borderColor: '#c7d2fe',
    accentColor: '#4f46e5',
    left: 'Cambios listos para publicar',
    actions: [
      { key: 'cancel', label: 'Cancelar', onClick: () => console.log('cancelar') },
      { key: 'publish', label: 'Publicar', variant: 'primary', icon: Save, onClick: () => console.log('publicar') },
    ],
  },
};

// Props reenviadas a los hijos: textProps → Text (variante, íconos/emojis), actionProps → todos los Button.
export const PropsReenviadas = {
  args: {
    left: '{icon:SiReact:#61dafb} Compilado con éxito',
    textProps: { variant: 'caption' },
    actionProps: { variant: 'ghost' },
    actions: [
      { key: 'logs', label: 'Ver logs', onClick: () => console.log('logs') },
      { key: 'deploy', label: 'Desplegar', variant: 'primary', onClick: () => console.log('deploy') },
    ],
  },
};

// Sin contenido propio: solo la línea separadora y un texto centrado.
export const SoloCentro = {
  args: {
    center: '© AnteriorityUI',
    height: 48,
  },
};
