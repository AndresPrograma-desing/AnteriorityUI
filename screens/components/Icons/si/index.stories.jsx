import { useState } from 'react';
import * as SiIcons from './index';

export default {
  title: 'Components/Icons/si (Simple Icons)',
};

const ICON_NAMES = Object.keys(SiIcons).sort();

const IconGrid = ({ filter = '' }) => {
  const query = filter.trim().toLowerCase();
  const names = query ? ICON_NAMES.filter((name) => name.toLowerCase().includes(query)) : ICON_NAMES;

  return (
    <div>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: '1rem' }}>
        {names.length} de {ICON_NAMES.length} íconos
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {names.slice(0, 300).map((name) => {
          const Icon = SiIcons[name];
          return (
            <div
              key={name}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: 96 }}
            >
              <Icon size={28} />
              <span style={{ fontSize: 10, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
      {names.length > 300 && (
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: '1rem' }}>
          Mostrando los primeros 300 resultados — refiná la búsqueda para ver otros.
        </p>
      )}
    </div>
  );
};

const SingleIconPreview = ({ name = 'SiJavascript', size = 96, color = '' }) => {
  const Icon = SiIcons[name];

  if (!Icon) {
    return (
      <p style={{ color: '#ef4444', fontSize: 14 }}>
        No existe un ícono llamado <code>{name}</code> en el pack <code>si</code>. Revisá el nombre exacto en la
        story "Catalog" o en el buscador oficial de react-icons.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <Icon size={Number(size)} color={color || undefined} />
      <code style={{ fontSize: 13 }}>{name}</code>
    </div>
  );
};

export const Preview = {
  args: {
    name: 'SiJavascript',
    size: 96,
    color: '',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Nombre EXACTO del export (ej. SiJavascript, SiReact, SiDocker)',
    },
    size: {
      control: { type: 'number', min: 16, max: 256, step: 8 },
    },
    color: {
      control: 'color',
      description: 'Vacío = color de marca oficial',
    },
  },
  render: (args) => <SingleIconPreview {...args} />,
};

export const Catalog = {
  args: {
    filter: '',
  },
  argTypes: {
    filter: {
      control: 'text',
      description: "Filtra por nombre de ícono (ej. 'java', 'docker', 'yaml')",
    },
  },
  render: (args) => <IconGrid {...args} />,
};

export const JavascriptAndFriends = {
  render: () => <IconGrid filter="java" />,
};

export const Docker = {
  render: () => <IconGrid filter="docker" />,
};
