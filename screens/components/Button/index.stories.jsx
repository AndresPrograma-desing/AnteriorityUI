import React from 'react';
import { Star, Trash2, Plus } from 'lucide-react';
import Button, { VARIANTS, SIZES, COLORS } from './index';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = {
  args: {
    variant: VARIANTS.PRIMARY,
    size: SIZES.MEDIUM,
    children: 'Guardar',
    onClick: () => console.log('clicked'),
  },
};

export const Secondary = {
  args: {
    variant: VARIANTS.SECONDARY,
    children: 'Cancelar',
    onClick: () => console.log('clicked'),
  },
};

export const Danger = {
  args: {
    variant: VARIANTS.DANGER,
    icon: Trash2,
    children: 'Eliminar',
    onClick: () => console.log('clicked'),
  },
};

export const WithIcon = {
  args: {
    variant: VARIANTS.OUTLINE,
    icon: Plus,
    children: 'Agregar',
    onClick: () => console.log('clicked'),
  },
};

export const Loading = {
  args: {
    variant: VARIANTS.PRIMARY,
    loading: true,
    children: 'Guardando...',
  },
};

export const Disabled = {
  args: {
    variant: VARIANTS.PRIMARY,
    disabled: true,
    children: 'No disponible',
  },
};

export const CircleWithTooltip = {
  args: {
    variant: VARIANTS.GHOST,
    circle: true,
    icon: Star,
    color: COLORS.GREEN,
    ToolTip: true,
    title: 'Marcar como favorito',
    onClick: () => console.log('clicked'),
  },
};

export const TransparentOnColoredBackground = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, background: '#0d1b4c', borderRadius: 8, width: 320 }}>
      <span style={{ color: '#aab3d6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
        Default (currentColor)
      </span>
      <Button color="transparent" fullWidth style={{ color: '#e6e8ec', justifyContent: 'flex-start' }}>
        Inicio
      </Button>
      <Button color="transparent" active fullWidth style={{ color: '#e6e8ec', justifyContent: 'flex-start' }}>
        Documentos (activo)
      </Button>

      <span style={{ color: '#aab3d6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginTop: 8 }}>
        hoverColor / activeColor explícitos
      </span>
      <Button
        color="transparent"
        active
        fullWidth
        hoverColor="rgba(13, 82, 248, 0.12)"
        activeColor="rgba(13, 82, 248, 0.25)"
        style={{ color: '#e6e8ec', justifyContent: 'flex-start' }}
      >
        Equipos (activo, color custom)
      </Button>
    </div>
  ),
};
