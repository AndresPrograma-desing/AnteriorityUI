// Tags propios que comparten quienes escriben y quienes renderizan markdown (MarkdownContent,
// MarkdownEditor, EmojiPickerModal, RichChatInput). Viven acá para que la sintaxis tenga una sola definición.

// {icon:Nombre} o {icon:Nombre:color} — Nombre es un ícono de react-icons (ej. SiReact).
// Se exporta el `source` (no un RegExp) porque cada uso necesita flags o anclas distintas
// y un RegExp global compartido arrastraría `lastIndex` entre usos.
export const ICON_TAG_SOURCE = String.raw`\{icon:([A-Za-z][A-Za-z0-9]*)(?::([^}]+))?\}`;

/** RegExp nueva del tag de ícono. Grupos: 1 = nombre, 2 = color (opcional). `flags` p. ej. 'g'. */
export const createIconTagPattern = (flags = '') => new RegExp(ICON_TAG_SOURCE, flags);

/** Tag de ícono listo para insertar en el markdown: `{icon:Nombre}` o `{icon:Nombre:color}`. */
export const buildIconTag = (name, color) => `{icon:${name}${color ? `:${color}` : ''}}`;
