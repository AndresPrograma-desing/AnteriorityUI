import { ICON_PACKS, ICON_PACK_NAMES } from '../Icons/registry';
import { ALL_PACKS, LABELS, DEFAULT_LOCALE } from './constants';

// Índice plano de TODOS los íconos de los packs de react-icons, construido una sola vez
// (lazy) porque son decenas de miles de entradas. Los nombres de react-icons llevan el
// prefijo del pack (FaReact, SiDocker, LuHome...), así que el nombre solo identifica el ícono.
let cachedIndex = null;

export function getIconIndex() {
  if (cachedIndex) return cachedIndex;
  const list = [];
  const byName = new Map();
  for (const pack of ICON_PACK_NAMES) {
    const mod = ICON_PACKS[pack];
    for (const name of Object.keys(mod)) {
      const Icon = mod[name];
      if (typeof Icon !== 'function') continue;
      const entry = { pack, name, lower: name.toLowerCase(), Icon };
      list.push(entry);
      if (!byName.has(name)) byName.set(name, entry);
    }
  }
  cachedIndex = { list, byName };
  return cachedIndex;
}

export function resolveIcon(name) {
  if (!name) return null;
  return getIconIndex().byName.get(name)?.Icon ?? null;
}

export function filterIcons(pack, query) {
  const q = query.trim().toLowerCase();
  const { list } = getIconIndex();
  return list.filter((e) => (!pack || pack === ALL_PACKS || e.pack === pack) && (!q || e.lower.includes(q)));
}

// Solo agrega la custom property cuando la prop viene definida (convención de props de color).
export function buildColorVars(colors) {
  const map = {
    '--ep-bg': colors.bgColor,
    '--ep-surface': colors.surfaceColor,
    '--ep-text': colors.textColor,
    '--ep-muted': colors.mutedColor,
    '--ep-icon': colors.iconColor,
    '--ep-border': colors.borderColor,
    '--ep-accent': colors.accentColor,
    '--ep-backdrop': colors.backdropColor,
    '--ep-danger': colors.dangerColor,
  };
  const vars = {};
  for (const [key, value] of Object.entries(map)) {
    if (value) vars[key] = value;
  }
  if (colors.dangerColor) {
    vars['--ep-danger-bg'] = `color-mix(in srgb, ${colors.dangerColor} 15%, transparent)`;
  }
  return vars;
}

export function unifiedToEmoji(unified) {
  return String.fromCodePoint(...unified.split('-').map((hex) => parseInt(hex, 16)));
}

// Devuelve el emoji con el tono pedido si el dataset lo soporta (`v` = variantes), si no el base.
export function emojiWithTone(entry, toneCode) {
  const unified = (toneCode && entry.v?.find((v) => v.includes(toneCode))) || entry.u;
  return unifiedToEmoji(unified);
}

export const emojiName = (entry) => entry.n[entry.n.length - 1];

export const normalizeText = (text) =>
  String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Textos del idioma elegido, con override parcial por `labels` (cada clave pisa la del idioma).
export function resolveLabels(locale, overrides) {
  return { ...(LABELS[locale] || LABELS[DEFAULT_LOCALE]), ...overrides };
}

// Valor elegido -> texto listo para insertar en un mensaje/campo que luego se muestra con
// <Text> o <MarkdownContent>: un emoji se inserta tal cual y un ícono como {icon:Nombre[:color]}.
export function toInlineValue(value, { color } = {}) {
  if (!value) return '';
  if (!resolveIcon(value)) return value;
  return `{icon:${value}${color ? `:${color}` : ''}}`;
}
