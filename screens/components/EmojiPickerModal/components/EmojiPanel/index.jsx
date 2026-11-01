import { useEffect, useMemo, useState } from 'react';
import Search from '../../../Material-UI/Components/Search/index';
import ScrollBar from '../../../ScrollBar/index';
import Button from '../../../Button/index';
import SkinToneSelector from '../SkinToneSelector/index';
import { useLoadMore } from '../../hooks';
import { emojiName, emojiWithTone, normalizeText } from '../../utils';
import {
  EMOJI_CATEGORIES,
  EMOJI_CELL_STYLE,
  EMOJI_COLUMNS,
  EMOJI_LOCALES,
  DEFAULT_LOCALE,
  GRID_HEIGHT,
  categoryTabStyle,
} from '../../constants';
import styles from './index.module.css';

// Emojis a partir del dataset de emoji-picker-react (cargado por idioma bajo demanda), con UI
// propia: buscador, pestañas de categoría, tono de piel y grilla paginada con ScrollBar.
const EmojiPanel = ({ locale = DEFAULT_LOCALE, onSelect, t }) => {
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState(EMOJI_CATEGORIES[0].id);
  const [query, setQuery] = useState('');
  const [tone, setTone] = useState('');
  const [hovered, setHovered] = useState('');

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setFailed(false);
    const load = EMOJI_LOCALES[locale] || EMOJI_LOCALES[DEFAULT_LOCALE];
    load()
      .then((mod) => !cancelled && setData(mod.default))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const isSearching = query.trim().length > 0;

  const results = useMemo(() => {
    if (!data) return [];
    if (!isSearching) return data.emojis[category] || [];
    const q = normalizeText(query.trim());
    return EMOJI_CATEGORIES.flatMap(({ id }) => data.emojis[id] || []).filter((e) =>
      e.n.some((name) => normalizeText(name).includes(q))
    );
  }, [data, category, query, isSearching]);

  const { visible, scrollAreaRef } = useLoadMore(results.length, `${category}|${query}`);

  const infoText =
    hovered ||
    (isSearching
      ? t.resultsCount(results.length)
      : data?.categories[category]?.name || '');

  return (
    <div className={styles.panel}>
      <Search
        freeSolo
        options={[]}
        value={query}
        onChange={setQuery}
        label={t.search}
        placeholder={t.searchEmoji}
        autoFocus
        bgColor="var(--ep-surface, #f8fafc)"
        textColor="var(--ep-text, #1e293b)"
        borderColor="var(--ep-border, #e2e8f0)"
        iconColor="var(--ep-muted, #64748b)"
      />

      <div className={styles.tabs}>
        {EMOJI_CATEGORIES.map(({ id, Icon }) => (
          <Button
            key={id}
            variant="ghost"
            circle
            size="small"
            icon={Icon}
            aria-label={data?.categories[id]?.name || id}
            ToolTip={data?.categories[id]?.name}
            onClick={() => {
              setQuery('');
              setCategory(id);
            }}
            style={categoryTabStyle(!isSearching && category === id)}
          />
        ))}
      </div>

      <div className={styles.infoRow}>
        <span className={styles.counter}>{infoText}</span>
        <SkinToneSelector tone={tone} onChange={setTone} t={t} />
      </div>

      <ScrollBar horizontal={false} reserveTrackSpace maxHeight={GRID_HEIGHT} scrollAreaRef={scrollAreaRef} style={{ height: GRID_HEIGHT }}>
        <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${EMOJI_COLUMNS}, 1fr)` }}>
          {results.slice(0, visible).map((entry) => {
            const emoji = emojiWithTone(entry, tone);
            return (
              <Button
                key={entry.u}
                variant="ghost"
                onClick={() => onSelect(emoji)}
                onMouseEnter={() => setHovered(emojiName(entry))}
                onMouseLeave={() => setHovered('')}
                aria-label={emojiName(entry)}
                style={EMOJI_CELL_STYLE}
              >
                {emoji}
              </Button>
            );
          })}
        </div>
        {!data && !failed && <p className={styles.status}>{t.loading}</p>}
        {failed && <p className={styles.status}>{t.loadError}</p>}
        {data && results.length === 0 && <p className={styles.status}>{t.noResults(query)}</p>}
      </ScrollBar>
    </div>
  );
};

export default EmojiPanel;
