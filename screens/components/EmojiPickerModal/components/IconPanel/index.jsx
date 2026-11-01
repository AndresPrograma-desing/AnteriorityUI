import { useMemo, useState } from 'react';
import Search from '../../../Material-UI/Components/Search/index';
import Selector from '../../../Material-UI/Components/Selector/index';
import { ICON_PACK_NAMES } from '../../../Icons/registry';
import { filterIcons } from '../../utils';
import Button from '../../../Button/index';
import ColorPicker from '../../../ColorPicker/index';
import ScrollBar from '../../../ScrollBar/index';
import { useLoadMore } from '../../hooks';
import { ALL_PACKS, ICON_SIZE, ICON_CELL_STYLE, GRID_HEIGHT, RESET_STYLE } from '../../constants';
import styles from './index.module.css';

// Búsqueda + filtro por pack + grilla paginada (scroll infinito) sobre los 31 packs de react-icons.
const IconPanel = ({ selectedName, onSelect, t, color, onColorChange, allowColor, palette, colorPickerProps }) => {
  const packOptions = useMemo(
    () => [{ value: ALL_PACKS, label: t.allPacks }, ...ICON_PACK_NAMES.map((p) => ({ value: p, label: p.toUpperCase() }))],
    [t.allPacks]
  );

  const [query, setQuery] = useState('');
  const [pack, setPack] = useState(ALL_PACKS);
  const [hovered, setHovered] = useState('');

  const results = useMemo(() => filterIcons(pack, query), [pack, query]);

  const { visible, scrollAreaRef } = useLoadMore(results.length, `${pack}|${query}`);

  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search
            freeSolo
            options={[]}
            value={query}
            onChange={setQuery}
            label={t.search}
            placeholder={t.searchIcon}
            autoFocus
            bgColor="var(--ep-surface, #f8fafc)"
            textColor="var(--ep-text, #1e293b)"
            borderColor="var(--ep-border, #e2e8f0)"
            iconColor="var(--ep-muted, #64748b)"
          />
        </div>
        <Selector
          id="emoji-picker-pack"
          label={t.pack}
          value={pack}
          onChange={(e) => setPack(e.target.value)}
          options={packOptions}
          disableClearable
          fullWidth={false}
          style={{ width: 140 }}
        />
      </div>

      {allowColor && (
        <div className={styles.colorRow}>
          <span className={styles.colorLabel}>{t.iconColor}</span>
          <ColorPicker
            value={color || undefined}
            onChange={onColorChange}
            ariaLabel={t.iconColor}
            labels={t.colorPicker}
            bgColor={palette.bgColor}
            textColor={palette.textColor}
            borderColor={palette.borderColor}
            accentColor={palette.accentColor}
            {...colorPickerProps}
          />
          {color && (
            <Button variant="ghost" size="small" onClick={() => onColorChange('')} style={RESET_STYLE}>
              {t.noColor}
            </Button>
          )}
        </div>
      )}

      <p className={styles.counter}>
        {hovered || t.iconsCount(results.length)}
      </p>

      <ScrollBar horizontal={false} reserveTrackSpace maxHeight={GRID_HEIGHT} scrollAreaRef={scrollAreaRef} style={{ height: GRID_HEIGHT }}>
        <div className={styles.grid}>
        {results.slice(0, visible).map(({ pack: p, name, Icon }) => (
          <Button
            key={`${p}-${name}`}
            variant="ghost"
            onClick={() => onSelect(name)}
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered('')}
            aria-label={name}
            style={ICON_CELL_STYLE(name === selectedName)}
          >
            <Icon size={ICON_SIZE} color={color || undefined} />
          </Button>
        ))}
        </div>
      </ScrollBar>

      {results.length === 0 && <p className={styles.empty}>{t.noResults(query)}</p>}
    </div>
  );
};

export default IconPanel;
