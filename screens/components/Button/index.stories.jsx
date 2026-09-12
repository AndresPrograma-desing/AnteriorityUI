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
