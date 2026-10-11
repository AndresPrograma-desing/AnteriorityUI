import React from 'react';
import { User, Shield, Star } from 'lucide-react';
import AvatarChip, { Chip, Avatar, AvatarChipGroup } from './index';

export default {
  title: 'Components/AvatarChip',
  component: AvatarChip,
};

// Historia base solicitada por el usuario (sin MUI, reemplazando Stack por AvatarChipGroup)
export const BaseExample = {
  render: () => (
    <AvatarChipGroup direction="row" spacing={8}>
      <Chip avatar={<Avatar>M</Avatar>} label="Avatar" />
      <Chip
        avatar={<Avatar alt="Natacha" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120" />}
        label="Avatar"
        variant="outlined"
      />
    </AvatarChipGroup>
  ),
};

// Característica especial solicitada: solo el avatar visible que se expande
// a un lado al colocar el puntero (hover) mostrando el nombre
export const ExpandOnHover = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
        Coloca el puntero sobre los avatares para ver cómo se expanden suavemente a un lado:
      </p>

      <AvatarChipGroup direction="row" spacing={12}>
        <AvatarChip
          expandOnHover
          name="Martin"
          label="Martín Gómez"
        />
        <AvatarChip
          expandOnHover
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
          label="Natacha Romanov"
          variant="outlined"
        />
        <AvatarChip
          expandOnHover
          avatar={<Avatar bgColor="#8b5cf6">L</Avatar>}
          label="Lucía Fernández"
        />
        <AvatarChip
          expandOnHover
          icon={Shield}
          label="Administrador"
        />
      </AvatarChipGroup>
    </div>
  ),
};

export const Variants = {
  render: () => (
    <AvatarChipGroup spacing={10}>
      <AvatarChip initial="F" label="Filled (Por defecto)" variant="filled" />
      <AvatarChip initial="O" label="Outlined" variant="outlined" />
    </AvatarChipGroup>
  ),
};

export const Sizes = {
  render: () => (
    <AvatarChipGroup spacing={10} style={{ alignItems: 'center' }}>
      <AvatarChip size="small" initial="S" label="Small (24px)" />
      <AvatarChip size="medium" initial="M" label="Medium (32px)" />
      <AvatarChip size="large" initial="L" label="Large (40px)" />
    </AvatarChipGroup>
  ),
};

export const ClickableAndDeletable = {
  render: () => (
    <AvatarChipGroup spacing={10}>
      <AvatarChip
        initial="C"
        label="Clickeable"
        onClick={() => alert('Chip clickeado')}
      />
      <AvatarChip
        initial="D"
        label="Eliminable"
        onDelete={() => alert('Eliminar clickeado')}
      />
      <AvatarChip
        initial="A"
        label="Clickeable y Eliminable"
        onClick={() => alert('Chip clickeado')}
        onDelete={() => alert('Eliminar clickeado')}
        variant="outlined"
      />
    </AvatarChipGroup>
  ),
};

export const CustomColors = {
  render: () => (
    <AvatarChipGroup spacing={10}>
      <AvatarChip
        initial="V"
        label="Verde Éxito"
        bgColor="#dcfce7"
        textColor="#15803d"
      />
      <AvatarChip
        initial="A"
        label="Azul Suave"
        bgColor="#e0f2fe"
        textColor="#0369a1"
        variant="outlined"
        borderColor="#7dd3fc"
      />
      <AvatarChip
        initial="O"
        label="Oscuro Elegante"
        bgColor="#0f172a"
        textColor="#f8fafc"
      />
    </AvatarChipGroup>
  ),
};
