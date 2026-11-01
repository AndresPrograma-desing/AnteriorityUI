import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Smile, Trash2 } from 'lucide-react';
import Button from '../Button/index';
import EmojiPickerModal, { resolveIcon, buildColorVars, resolveLabels } from '../EmojiPickerModal/index';
import { TRIGGER_STYLE, CLEAR_STYLE } from './constants';
import styles from './index.module.css';

// Selector de emoji o ícono con su propio botón disparador (campo de formulario). Los emojis se
// guardan como el carácter ('🚀') y los íconos como su nombre de react-icons ('FaReact'...),
// con color opcional (`color` / `onColorChange`). `onChange(value, { color })`.
// Para abrir el selector desde un botón propio (ej. un chat) usar EmojiPickerModal.
const EmojiPicker = ({
  value = '',
  onChange,
  color = '',
  onColorChange,
  placeholder,
  disabled = false,
  allowClear = true,
  modalTitle,
  locale,
  labels,
  theme = 'light',
  className = '',
  style = {},
  // Colores: el trigger y el modal comparten la misma paleta
  bgColor,
  surfaceColor,
  textColor,
  mutedColor,
  iconColor,
  borderColor,
  accentColor,
  backdropColor,
  dangerColor,
  // Resto de props del modal (allowColor, colorPickerProps, closeOnSelect...)
  ...modalProps
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedColor, setSelectedColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const palette = { bgColor, surfaceColor, textColor, mutedColor, iconColor, borderColor, accentColor, backdropColor, dangerColor };
  const colorVars = useMemo(
    () => buildColorVars({ bgColor, surfaceColor, textColor, mutedColor, iconColor, borderColor, accentColor, backdropColor, dangerColor }),
    [bgColor, surfaceColor, textColor, mutedColor, iconColor, borderColor, accentColor, backdropColor, dangerColor]
  );
  const t = useMemo(() => resolveLabels(locale, labels), [locale, labels]);
  const themeClass = theme === 'dark' ? styles.dark : '';

  const close = useCallback(() => setIsOpen(false), []);

  const SelectedIcon = resolveIcon(selectedValue);

  const handleSelect = (item, meta) => {
    setSelectedValue(item);
    setSelectedColor(meta.color);
    if (onChange) onChange(item, meta);
  };

  const handleColorChange = (next) => {
    setSelectedColor(next);
    if (onColorChange) onColorChange(next);
    if (onChange && SelectedIcon) onChange(selectedValue, { color: next });
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedValue('');
    if (onChange) onChange('', { color: '' });
  };

  const renderSelectedDisplay = () => {
    if (!selectedValue) return <Smile className={styles.placeholderIcon} size={20} />;
    if (SelectedIcon) return <SelectedIcon className={styles.selectedIcon} size={20} color={selectedColor || undefined} />;
    return <span className={styles.selectedEmoji}>{selectedValue}</span>;
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${themeClass} ${disabled ? styles.disabled : ''} ${className}`}
      style={{ ...colorVars, ...style }}
    >
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={TRIGGER_STYLE}
      >
        {renderSelectedDisplay()}
        <span className={selectedValue ? styles.labelActive : styles.labelPlaceholder}>
          {selectedValue ? (SelectedIcon ? selectedValue : t.selected) : placeholder ?? t.placeholder}
        </span>
      </Button>

      {allowClear && selectedValue && !disabled && (
        <Button
          variant="ghost"
          circle
          size="small"
          icon={Trash2}
          onClick={handleClear}
          aria-label={t.clear}
          ToolTip={t.clear}
          style={CLEAR_STYLE}
        />
      )}

      <EmojiPickerModal
        anchorEl={containerRef}
        {...modalProps}
        open={isOpen}
        onClose={close}
        onSelect={handleSelect}
        value={selectedValue}
        color={selectedColor}
        onColorChange={handleColorChange}
        locale={locale}
        labels={labels}
        title={modalTitle}
        theme={theme}
        {...palette}
      />
    </div>
  );
};

export default EmojiPicker;
export { resolveIcon };
