// Sintaxis inline para meter un ícono dentro de un texto: {icon:SiReact} o {icon:SiReact:#06b6d4}
// (mismo estilo que {color:X}texto{/color} de MarkdownContent). El color es cualquier color CSS.
const ICON_TOKEN_SOURCE = '\\{icon:([A-Za-z][A-Za-z0-9]*)(?::([^}]+))?\\}';

export const ICON_TOKEN_PATTERN = ICON_TOKEN_SOURCE;

export const hasIconTokens = (text) => typeof text === 'string' && text.includes('{icon:');

// Parte `text` en segmentos [{ text }, { icon, color }, ...] respetando el orden original.
export function splitIconTokens(text) {
  if (!hasIconTokens(text)) return [{ text }];
  const parts = [];
  const pattern = new RegExp(ICON_TOKEN_SOURCE, 'g');
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) });
    parts.push({ icon: match[1], color: match[2]?.trim() || undefined });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
