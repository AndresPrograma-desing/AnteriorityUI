import { Smile, PawPrint, Utensils, Plane, Trophy, Lightbulb, Hash, Flag } from 'lucide-react';

export const DEFAULT_COLORS_LIGHT = {
  bg: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  muted: '#64748b',
  icon: '#334155',
  border: '#e2e8f0',
  accent: '#2563eb',
  backdrop: 'rgba(15, 23, 42, 0.5)',
};

export const DEFAULT_COLORS_DARK = {
  bg: '#1e293b',
  surface: '#0f172a',
  text: '#f1f5f9',
  muted: '#94a3b8',
  icon: '#cbd5e1',
  border: '#334155',
  accent: '#60a5fa',
  backdrop: 'rgba(0, 0, 0, 0.65)',
};

export const TABS = ['emoji', 'icons'];

export const ALL_PACKS = 'all';
export const ICON_PAGE_SIZE = 120;
export const ICON_SIZE = 22;
export const GRID_HEIGHT = 300;
export const EMOJI_COLUMNS = 8;
export const DEFAULT_LOCALE = 'es';
export const MODAL_WIDTH = 440;

// Estilos (sx) para el Button de la librería: colores vía las variables --ep-* para que
// las props de color los pisen sin CSS externo.
export const CLOSE_STYLE = {
  color: 'var(--ep-muted, #64748b)',
  '&:hover': {
    backgroundColor: 'var(--ep-border, #e2e8f0)',
    color: 'var(--ep-text, #1e293b)',
  },
};

export const tabStyle = (active) => ({
  flex: 1,
  borderRadius: 0,
  backgroundColor: 'transparent',
  color: active ? 'var(--ep-accent, #2563eb)' : 'var(--ep-muted, #64748b)',
  borderBottom: `2px solid ${active ? 'var(--ep-accent, #2563eb)' : 'transparent'}`,
  '&:hover': { backgroundColor: 'transparent', color: 'var(--ep-text, #1e293b)' },
});

export const ICON_CELL_STYLE = (selected) => ({
  minWidth: 0,
  height: '42px',
  padding: 0,
  borderRadius: '8px',
  color: selected ? 'var(--ep-accent, #2563eb)' : 'var(--ep-icon, #334155)',
  backgroundColor: 'var(--ep-surface, #f8fafc)',
  border: `1px solid ${selected ? 'var(--ep-accent, #2563eb)' : 'var(--ep-border, #e2e8f0)'}`,
  '&:hover': {
    backgroundColor: 'var(--ep-surface, #f8fafc)',
    borderColor: 'var(--ep-accent, #2563eb)',
    color: 'var(--ep-accent, #2563eb)',
  },
});

// Datasets de emoji-picker-react cargados bajo demanda (cada uno pesa cientos de KB).
// Imports literales para que el bundler pueda resolverlos; para sumar un idioma, agregar su línea.
export const EMOJI_LOCALES = {
  es: () => import('emoji-picker-react/data/emojis-es'),
  en: () => import('emoji-picker-react/data/emojis-en'),
};

export const EMOJI_CATEGORIES = [
  { id: 'smileys_people', Icon: Smile },
  { id: 'animals_nature', Icon: PawPrint },
  { id: 'food_drink', Icon: Utensils },
  { id: 'travel_places', Icon: Plane },
  { id: 'activities', Icon: Trophy },
  { id: 'objects', Icon: Lightbulb },
  { id: 'symbols', Icon: Hash },
  { id: 'flags', Icon: Flag },
];

// code '' = tono por defecto (amarillo); el resto son los modificadores Fitzpatrick de Unicode.
export const SKIN_TONES = [
  { code: '', color: '#FFCC4D' },
  { code: '1f3fb', color: '#F7DECE' },
  { code: '1f3fc', color: '#F3D2A2' },
  { code: '1f3fd', color: '#D5AB88' },
  { code: '1f3fe', color: '#AF7E57' },
  { code: '1f3ff', color: '#7C533E' },
];

export const EMOJI_CELL_STYLE = {
  minWidth: 0,
  height: '40px',
  padding: 0,
  fontSize: '1.4rem',
  lineHeight: 1,
  borderRadius: '8px',
  color: 'var(--ep-text, #1e293b)',
  '&:hover': { backgroundColor: 'var(--ep-surface, #f8fafc)' },
};

export const categoryTabStyle = (active) => ({
  minWidth: 0,
  padding: '6px',
  borderRadius: '8px',
  color: active ? 'var(--ep-accent, #2563eb)' : 'var(--ep-muted, #64748b)',
  backgroundColor: active ? 'var(--ep-surface, #f8fafc)' : 'transparent',
  '&:hover': { backgroundColor: 'var(--ep-surface, #f8fafc)', color: 'var(--ep-accent, #2563eb)' },
});

export const toneSwatchStyle = (color, selected) => ({
  minWidth: 0,
  width: '22px',
  height: '22px',
  padding: 0,
  backgroundColor: color,
  border: '1px solid var(--ep-border, #e2e8f0)',
  boxShadow: selected ? '0 0 0 2px var(--ep-bg, #ffffff), 0 0 0 4px var(--ep-accent, #2563eb)' : 'none',
  '&:hover': { backgroundColor: color, filter: 'brightness(0.95)' },
});

export const RESET_STYLE = {
  flexShrink: 0,
  padding: '2px 8px',
  fontSize: '0.75rem',
  color: 'var(--ep-muted, #64748b)',
  '&:hover': { color: 'var(--ep-danger, #ef4444)' },
};

// Textos de la UI por idioma. `locale` también elige el dataset de emojis (nombres/búsqueda).
export const LABELS = {
  es: {
    placeholder: 'Seleccionar ícono o emoji',
    modalTitle: 'Selector de Elementos',
    selected: 'Seleccionado',
    clear: 'Quitar selección',
    close: 'Cerrar',
    more: 'Más emojis',
    recent: 'Usados recientemente',
    tabs: { emoji: 'Emojis', icons: 'Íconos' },
    search: 'Buscar',
    searchEmoji: 'Buscar emoji...',
    searchIcon: 'react, home, docker...',
    pack: 'Pack',
    allPacks: 'Todos',
    skinTone: 'Tono de piel',
    skinTones: ['Tono por defecto', 'Tono claro', 'Tono medio claro', 'Tono medio', 'Tono medio oscuro', 'Tono oscuro'],
    iconColor: 'Color del ícono',
    noColor: 'Sin color',
    loading: 'Cargando emojis...',
    loadError: 'No se pudieron cargar los emojis.',
    iconsCount: (n) => `${n.toLocaleString()} ícono${n === 1 ? '' : 's'}`,
    resultsCount: (n) => `${n.toLocaleString()} resultado${n === 1 ? '' : 's'}`,
    noResults: (q) => `Sin resultados para "${q}".`,
    colorPicker: {
      saturation: 'Saturación y brillo',
      hue: 'Matiz',
      invalidHex: 'Color hexadecimal inválido',
      invalidRgb: 'Valores RGB inválidos (0-255)',
      invalidHsl: 'Valores HSL inválidos (H 0-360, S/L 0-100)',
      channels: { r: 'R', g: 'G', b: 'B', h: 'H', s: 'S', l: 'L' },
    },
  },
  en: {
    placeholder: 'Select an icon or emoji',
    modalTitle: 'Element picker',
    selected: 'Selected',
    clear: 'Clear selection',
    close: 'Close',
    more: 'More emojis',
    recent: 'Recently used',
    tabs: { emoji: 'Emojis', icons: 'Icons' },
    search: 'Search',
    searchEmoji: 'Search emoji...',
    searchIcon: 'react, home, docker...',
    pack: 'Pack',
    allPacks: 'All',
    skinTone: 'Skin tone',
    skinTones: ['Default tone', 'Light tone', 'Medium-light tone', 'Medium tone', 'Medium-dark tone', 'Dark tone'],
    iconColor: 'Icon color',
    noColor: 'No color',
    loading: 'Loading emojis...',
    loadError: 'Could not load emojis.',
    iconsCount: (n) => `${n.toLocaleString()} icon${n === 1 ? '' : 's'}`,
    resultsCount: (n) => `${n.toLocaleString()} result${n === 1 ? '' : 's'}`,
    noResults: (q) => `No results for "${q}".`,
    colorPicker: {
      saturation: 'Saturation and brightness',
      hue: 'Hue',
      invalidHex: 'Invalid hex color',
      invalidRgb: 'Invalid RGB values (0-255)',
      invalidHsl: 'Invalid HSL values (H 0-360, S/L 0-100)',
      channels: { r: 'R', g: 'G', b: 'B', h: 'H', s: 'S', l: 'L' },
    },
  },
};

// Franja compacta (estilo Slack): últimos usados + botón para expandir al selector completo.
export const DEFAULT_QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🙏', '👀', '🔥', '✅'];
export const DEFAULT_RECENT_LIMIT = 8;
export const RECENTS_STORAGE_KEY = 'anteriority-ui:emoji-recents';
export const QUICK_ICON_SIZE = '1.35rem';
export const QUICK_BAR_MARGIN = 8;
export const DEFAULT_INITIAL_VIEW = 'compact';

export const QUICK_CELL_STYLE = {
  minWidth: 0,
  width: '38px',
  height: '38px',
  padding: 0,
  color: 'var(--ep-icon, #334155)',
  '&:hover': { backgroundColor: 'var(--ep-surface, #f1f5f9)' },
};

export const EXPAND_STYLE = {
  minWidth: 0,
  width: '32px',
  height: '32px',
  flexShrink: 0,
  color: 'var(--ep-muted, #64748b)',
  borderColor: 'var(--ep-border, #e2e8f0)',
  '&:hover': {
    color: 'var(--ep-accent, #2563eb)',
    borderColor: 'var(--ep-accent, #2563eb)',
    backgroundColor: 'transparent',
  },
};
