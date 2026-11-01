import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '../Button/index';
import { PickerModal, IconPanel, EmojiPanel, QuickBar } from './components/index';
import { useRecents } from './hooks';
import { resolveIcon, buildColorVars, resolveLabels, toInlineValue } from './utils';
import {
  TABS,
  DEFAULT_LOCALE,
  DEFAULT_COLORS_LIGHT,
  DEFAULT_COLORS_DARK,
  DEFAULT_QUICK_EMOJIS,
  DEFAULT_RECENT_LIMIT,
  DEFAULT_INITIAL_VIEW,
  RECENTS_STORAGE_KEY,
  tabStyle,
} from './constants';
import styles from './index.module.css';

// Modal selector de emoji o ícono SIN botón propio: se abre/cierra desde afuera con `open` /
// `onClose`, así se puede disparar desde cualquier botón (ej. el de un chat). Al elegir llama
// `onSelect(value, { color })`: un emoji llega como el carácter ('🚀') y un ícono como su nombre
// de react-icons ('SiReact'), con el color elegido en `color` ('' si no hay o es un emoji).
// Abre primero una franja compacta con los últimos usados (`initialView="compact"`) y un botón
// que expande al selector completo; con `initialView="full"` abre directo el selector completo.
const EmojiPickerModal = ({
  open = false,
  onClose,
  onSelect,
  closeOnSelect = true,
  value = '',
  color = '',
  onColorChange,
  allowColor = true,
  colorPickerProps,
  initialView = DEFAULT_INITIAL_VIEW,
  anchorEl,
  quickEmojis = DEFAULT_QUICK_EMOJIS,
  recentLimit = DEFAULT_RECENT_LIMIT,
  recentsStorageKey = RECENTS_STORAGE_KEY,
  locale = DEFAULT_LOCALE,
  labels,
  title,
  theme = 'light',
  bgColor,
  surfaceColor,
  textColor,
  mutedColor,
  iconColor,
  borderColor,
  accentColor,
  backdropColor,
  dangerColor,
}) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [pickedColor, setPickedColor] = useState(color);
  const [expanded, setExpanded] = useState(initialView === 'full');
  const { recents, addRecent } = useRecents(recentsStorageKey, recentLimit);

  // Cada vez que se abre vuelve a la vista inicial (franja compacta o selector completo)
  useEffect(() => {
    if (open) setExpanded(initialView === 'full');
  }, [open, initialView]);

  useEffect(() => {
    setPickedColor(color);
  }, [color]);

  const t = useMemo(() => resolveLabels(locale, labels), [locale, labels]);

  const colorVars = useMemo(
    () => buildColorVars({ bgColor, surfaceColor, textColor, mutedColor, iconColor, borderColor, accentColor, backdropColor, dangerColor }),
    [bgColor, surfaceColor, textColor, mutedColor, iconColor, borderColor, accentColor, backdropColor, dangerColor]
  );
  const themeClass = theme === 'dark' ? styles.dark : '';

  // El popover del ColorPicker vive en un portal fuera del modal, así que no hereda las
  // variables --ep-*: se le pasan los colores ya resueltos (prop o default del tema).
  const palette = useMemo(() => {
    const base = theme === 'dark' ? DEFAULT_COLORS_DARK : DEFAULT_COLORS_LIGHT;
    return {
      bgColor: bgColor ?? base.bg,
      textColor: textColor ?? base.text,
      borderColor: borderColor ?? base.border,
      accentColor: accentColor ?? base.accent,
    };
  }, [theme, bgColor, textColor, borderColor, accentColor]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const commit = (item, itemColor) => {
    addRecent(item, itemColor);
    if (onSelect) onSelect(item, { color: itemColor });
    if (closeOnSelect) handleClose();
  };

  const handleSelect = (item) => commit(item, resolveIcon(item) ? pickedColor : '');

  // Franja: primero los usados recientemente, completada con los sugeridos hasta `recentLimit`
  const quickItems = useMemo(() => {
    const suggested = quickEmojis.filter((e) => !recents.some((r) => r.value === e)).map((e) => ({ value: e, color: '' }));
    return [...recents, ...suggested].slice(0, recentLimit);
  }, [recents, quickEmojis, recentLimit]);

  const handleColorChange = (next) => {
    setPickedColor(next);
    if (onColorChange) onColorChange(next);
  };

  if (!open) return null;

  if (!expanded) {
    return (
      <QuickBar
        items={quickItems}
        onPick={commit}
        onExpand={() => setExpanded(true)}
        onClose={handleClose}
        anchorEl={anchorEl}
        rootClassName={`${styles.modalRoot} ${themeClass}`}
        colorVars={colorVars}
        t={t}
      />
    );
  }

  return (
    <PickerModal
      title={title ?? t.modalTitle}
      closeLabel={t.close}
      onClose={handleClose}
      rootClassName={`${styles.modalRoot} ${themeClass}`}
      colorVars={colorVars}
    >
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <Button
            key={tab}
            variant="tab"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            style={tabStyle(activeTab === tab)}
          >
            {t.tabs[tab]}
          </Button>
        ))}
      </div>

      {activeTab === 'emoji' ? (
        <EmojiPanel locale={locale} onSelect={handleSelect} t={t} />
      ) : (
        <IconPanel
          selectedName={value}
          onSelect={handleSelect}
          t={t}
          color={pickedColor}
          onColorChange={handleColorChange}
          allowColor={allowColor}
          colorPickerProps={colorPickerProps}
          palette={palette}
        />
      )}
    </PickerModal>
  );
};

export default EmojiPickerModal;
export { resolveIcon, resolveLabels, buildColorVars, toInlineValue };
