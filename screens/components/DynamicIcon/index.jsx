import { useIcon } from '../../../common/icons/useIcon.js';
import { DEFAULT_SIZE, ICON_NAME_PATTERN } from './constants.js';
import styles from './index.module.css';

// Renderiza el valor que devuelve EmojiPicker: un nombre de ícono de react-icons (de cualquiera
// de los 31 packs, cargados bajo demanda) o un emoji, que se muestra como texto.
export default function DynamicIcon({ name, color, size = DEFAULT_SIZE, className = '', style, title }) {
  const isName = typeof name === 'string' && ICON_NAME_PATTERN.test(name);
  const Icon = useIcon(isName ? name : null);

  if (!name) return null;

  if (!isName) {
    return (
      <span
        className={`${styles.emoji} ${className}`.trim()}
        style={{ fontSize: size, ...style }}
        role={title ? 'img' : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        {name}
      </span>
    );
  }

  // Mientras carga el pack (o si el nombre no existe) no se renderiza nada.
  if (!Icon) return null;

  return (
    <Icon
      size={size}
      color={color || undefined}
      className={`${styles.icon} ${className}`.trim()}
      style={style}
      title={title}
      aria-hidden={title ? undefined : true}
    />
  );
}

export { DynamicIcon };
