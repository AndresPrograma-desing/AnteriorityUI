import { useMemo, useState } from 'react';
import * as ai from '../Icons/ai/index';
import * as bi from '../Icons/bi/index';
import * as bs from '../Icons/bs/index';
import * as cg from '../Icons/cg/index';
import * as ci from '../Icons/ci/index';
import * as di from '../Icons/di/index';
import * as fa from '../Icons/fa/index';
import * as fa6 from '../Icons/fa6/index';
import * as fc from '../Icons/fc/index';
import * as fi from '../Icons/fi/index';
import * as gi from '../Icons/gi/index';
import * as go from '../Icons/go/index';
import * as gr from '../Icons/gr/index';
import * as hi from '../Icons/hi/index';
import * as hi2 from '../Icons/hi2/index';
import * as im from '../Icons/im/index';
import * as io from '../Icons/io/index';
import * as io5 from '../Icons/io5/index';
import * as lia from '../Icons/lia/index';
import * as lu from '../Icons/lu/index';
import * as md from '../Icons/md/index';
import * as pi from '../Icons/pi/index';
import * as ri from '../Icons/ri/index';
import * as rx from '../Icons/rx/index';
import * as si from '../Icons/si/index';
import * as sl from '../Icons/sl/index';
import * as tb from '../Icons/tb/index';
import * as tfi from '../Icons/tfi/index';
import * as ti from '../Icons/ti/index';
import * as vsc from '../Icons/vsc/index';
import * as wi from '../Icons/wi/index';
import CopyText from '../CopyText/index';
import Selector from '../Material-UI/Components/Selector/index';
import Search from '../Material-UI/Components/Search/index';
import styles from './index.module.css';
import { MAX_RESULTS } from './constants';

const PACKS = { ai, bi, bs, cg, ci, di, fa, fa6, fc, fi, gi, go, gr, hi, hi2, im, io, io5, lia, lu, md, pi, ri, rx, si, sl, tb, tfi, ti, vsc, wi };
const PACK_NAMES = Object.keys(PACKS).sort();

const IconCatalog = ({ defaultPack = 'si' }) => {
  const [pack, setPack] = useState(defaultPack);
  const [query, setQuery] = useState('');

  const names = useMemo(() => {
    const mod = PACKS[pack];
    if (!mod) return [];
    const allNames = Object.keys(mod).sort();
    const q = query.trim().toLowerCase();
    return q ? allNames.filter((name) => name.toLowerCase().includes(q)) : allNames;
  }, [pack, query]);

  const mod = PACKS[pack];
  const visibleNames = names.slice(0, MAX_RESULTS);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Selector
          label="Pack"
          value={pack}
          onChange={(e) => setPack(e.target.value)}
          options={PACK_NAMES.map((p) => ({ value: p, label: p }))}
          disableClearable
          fullWidth={false}
        />
        <Search
          freeSolo
          options={[]}
          value={query}
          onChange={setQuery}
          label="Buscar"
          placeholder="Buscar ícono por nombre..."
        />
      </div>

      <p className={styles.counter}>
        {names.length} resultado{names.length === 1 ? '' : 's'} en el pack "{pack}"
        {names.length > MAX_RESULTS ? ` (mostrando los primeros ${MAX_RESULTS})` : ''}
      </p>

      <div className={styles.grid}>
        {visibleNames.map((name) => {
          const Icon = mod[name];
          return (
            <div key={name} className={styles.iconCard}>
              <Icon size={32} />
              <div className={styles.copyWrapper}>
                <CopyText text={name} />
              </div>
            </div>
          );
        })}
      </div>

      {names.length === 0 && <p className={styles.empty}>No se encontraron íconos que coincidan con "{query}".</p>}
    </div>
  );
};

export default IconCatalog;
export { IconCatalog };
