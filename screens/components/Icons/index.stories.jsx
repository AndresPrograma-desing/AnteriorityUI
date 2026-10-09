import { useMemo, useState } from 'react';
import * as ai from './ai/index';
import * as bi from './bi/index';
import * as bs from './bs/index';
import * as cg from './cg/index';
import * as ci from './ci/index';
import * as di from './di/index';
import * as fa from './fa/index';
import * as fa6 from './fa6/index';
import * as fc from './fc/index';
import * as fi from './fi/index';
import * as gi from './gi/index';
import * as go from './go/index';
import * as gr from './gr/index';
import * as hi from './hi/index';
import * as hi2 from './hi2/index';
import * as im from './im/index';
import * as io from './io/index';
import * as io5 from './io5/index';
import * as lia from './lia/index';
import * as lu from './lu/index';
import * as md from './md/index';
import * as pi from './pi/index';
import * as ri from './ri/index';
import * as rx from './rx/index';
import * as si from './si/index';
import * as sl from './sl/index';
import * as tb from './tb/index';
import * as tfi from './tfi/index';
import * as ti from './ti/index';
import * as vsc from './vsc/index';
import * as wi from './wi/index';

const PACKS = { ai, bi, bs, cg, ci, di, fa, fa6, fc, fi, gi, go, gr, hi, hi2, im, io, io5, lia, lu, md, pi, ri, rx, si, sl, tb, tfi, ti, vsc, wi };
const PACK_NAMES = Object.keys(PACKS).sort();

export default {
  title: 'Components/Icons/Preview (todos los packs)',
};

const IconPreview = ({ pack = 'si', name = 'SiJavascript', size = 96, color = '' }) => {
  const mod = PACKS[pack];
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
        Pack <code>{pack}</code> inválido. Packs disponibles: {PACK_NAMES.join(', ')}.
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
      options: PACK_NAMES,
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
