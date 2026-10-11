import { useMemo, useState } from 'react';
import { ICON_PACKS, ICON_PACK_NAMES } from './registry';
import { findIcons } from './findIcons';

export default {
  title: 'Components/Icons/Preview (todos los packs)',
};

const IconPreview = ({ pack = 'si', name = 'SiJavascript', size = 96, color = '' }) => {
  const mod = ICON_PACKS[pack];
  const Icon = mod?.[name];
  const suggestions = useMemo(() => {
    if (!mod || Icon) return [];
    const query = name.trim().toLowerCase();
    if (!query) return [];
    return Object.keys(mod)
      .filter((k) => k.toLowerCase().includes(query))
      .slice(0, 10);
  }, [mod, Icon, name]);

  if (!mod) {
    return (
      <p style={{ color: '#ef4444', fontSize: 14 }}>
        Pack <code>{pack}</code> inválido. Packs disponibles: {ICON_PACK_NAMES.join(', ')}.
      </p>
    );
  }

  if (!Icon) {
    return (
      <div style={{ color: '#ef4444', fontSize: 14 }}>
        <p>
          No existe <code>{name}</code> en el pack <code>{pack}</code>.
        </p>
        {suggestions.length > 0 && (
          <p style={{ color: '#64748b' }}>
            ¿Quisiste decir: {suggestions.map((s) => <code key={s} style={{ marginRight: 8 }}>{s}</code>)}?
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <Icon size={Number(size)} color={color || undefined} />
      <code style={{ fontSize: 13 }}>
        import {'{'} {name} {'}'} from 'anteriority-ui/screens/components/Icons/{pack}'
      </code>
    </div>
  );
};

export const Preview = {
  args: {
    pack: 'si',
    name: 'SiJavascript',
    size: 96,
    color: '',
  },
  argTypes: {
    pack: {
      control: 'select',
      options: ICON_PACK_NAMES,
      description: 'Pack de react-icons (carpeta en screens/components/Icons/)',
    },
    name: {
      control: 'text',
      description: 'Nombre EXACTO del export dentro del pack (ej. TbBrandCSharp en el pack tb)',
    },
    size: {
      control: { type: 'number', min: 16, max: 256, step: 8 },
    },
    color: {
      control: 'color',
      description: 'Vacío = color por defecto del ícono',
    },
  },
  render: (args) => <IconPreview {...args} />,
};

export const CSharpExample = {
  render: () => <IconPreview pack="tb" name="TbBrandCSharp" />,
};

const FindIconsDemo = ({ query = 'cs' }) => {
  const [q, setQ] = useState(query);
  const results = useMemo(() => findIcons(q), [q]);

  return (
    <div>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar en todos los packs..."
        style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: '1rem', width: 280 }}
      />
      <p style={{ fontSize: 13, color: '#64748b' }}>{results.length} resultados en los {ICON_PACK_NAMES.length} packs</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {results.slice(0, 100).map(({ pack, name, Icon }) => (
          <div key={`${pack}-${name}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 110 }}>
            <Icon size={28} />
            <span style={{ fontSize: 10, textAlign: 'center' }}>{name}</span>
            <span style={{ fontSize: 9, color: '#94a3b8' }}>pack: {pack}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FindIconsAcrossPacks = {
  render: () => <FindIconsDemo query="cs" />,
};
