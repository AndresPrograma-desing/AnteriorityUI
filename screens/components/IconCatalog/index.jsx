import { useMemo, useState } from 'react';
import { ICON_PACKS, ICON_PACK_NAMES } from '../Icons/registry';
import { findIcons } from '../Icons/findIcons';
import CopyText from '../CopyText/index';
import Selector from '../Material-UI/Components/Selector/index';
import Search from '../Material-UI/Components/Search/index';
import styles from './index.module.css';
import { MAX_RESULTS } from './constants';

const ALL_PACKS_OPTION = { value: '', label: 'Todos los packs' };

const IconCatalog = ({ defaultPack = 'si' }) => {
  const [pack, setPack] = useState(defaultPack);
  const [query, setQuery] = useState('');

  // Sin búsqueda: se navega el pack elegido completo. Con búsqueda: se busca en TODOS
  // los packs a la vez (findIcons), y el pack elegido pasa a ser un filtro opcional
  // sobre esos resultados en vez del punto de partida.
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      const mod = ICON_PACKS[pack];
      if (!mod) return [];
      return Object.keys(mod)
        .sort()
        .map((name) => ({ pack, name, Icon: mod[name] }));
    }
    const matches = findIcons(q);
    return pack ? matches.filter((r) => r.pack === pack) : matches;
  }, [pack, query]);

  const visibleResults = results.slice(0, MAX_RESULTS);
  const isSearching = query.trim().length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Selector
          label="Pack"
          value={pack}
          onChange={(e) => setPack(e.target.value)}
          options={isSearching ? [ALL_PACKS_OPTION, ...ICON_PACK_NAMES.map((p) => ({ value: p, label: p }))] : ICON_PACK_NAMES.map((p) => ({ value: p, label: p }))}
          disableClearable={!isSearching}
          fullWidth={false}
        />
        <Search
          freeSolo
          options={[]}
          value={query}
          onChange={setQuery}
          label="Buscar"
          placeholder="Buscar ícono en todos los packs..."
        />
      </div>

      <p className={styles.counter}>
        {results.length} resultado{results.length === 1 ? '' : 's'}
        {isSearching ? (pack ? ` en el pack "${pack}"` : ' en todos los packs') : ` en el pack "${pack}"`}
        {results.length > MAX_RESULTS ? ` (mostrando los primeros ${MAX_RESULTS})` : ''}
      </p>

      <div className={styles.grid}>
        {visibleResults.map(({ pack: resultPack, name, Icon }) => (
          <div key={`${resultPack}-${name}`} className={styles.iconCard}>
            <Icon size={32} />
            <div className={styles.copyWrapper}>
              <CopyText text={name} />
            </div>
            {isSearching && <span className={styles.packBadge}>{resultPack}</span>}
          </div>
        ))}
      </div>

      {results.length === 0 && <p className={styles.empty}>No se encontraron íconos que coincidan con "{query}".</p>}
    </div>
  );
};

export default IconCatalog;
export { IconCatalog };
