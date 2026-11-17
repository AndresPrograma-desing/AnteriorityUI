import { defaultUrlTransform } from 'react-markdown';
import { ICON_TAG_SOURCE, buildIconTag } from '../../../common/utils/markdownTags';
import { ZWSP } from './constants.js';

// Conversión markdown <-> DOM para RichChatInput. Solo markdown "de chat": negrita, cursiva,
// tachado, código en línea, enlaces y saltos de línea. Todo es puro (no toca el DOM salvo
// `domToMarkdown`, que solo lo lee).

const SPECIAL = /[\\*_~`[]/g;
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:(?!\d)/i;

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Valida con la MISMA regla con la que `MarkdownContent` saneará el enlace al mostrarlo (el
 * `defaultUrlTransform` de react-markdown: solo http/https/irc/ircs/mailto/xmpp, nunca
 * javascript:/data:), así lo que acepta el editor siempre se renderiza igual después. Una URL sin
 * esquema se completa con https://. Devuelve '' si no es válida.
 */
export function sanitizeUrl(url) {
  const trimmed = String(url ?? '').trim();
  if (!trimmed || /\s/.test(trimmed)) return '';
  const withScheme = HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;
  return defaultUrlTransform(withScheme);
}

const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)/;

const ICON_PATTERN = new RegExp(`^${ICON_TAG_SOURCE}`);
const SAFE_COLOR = /^(#[0-9a-f]{3,8}|[a-z]+)$/i;

/** `<span>` no editable que envuelve el SVG de un ícono; `data-icon`/`data-color` permiten volver a markdown. */
export function buildIconHtml(name, color, svg) {
  const safeColor = color && SAFE_COLOR.test(color) ? color : '';
  return `<span data-icon="${name}"${safeColor ? ` data-color="${safeColor}"` : ''} contenteditable="false">${svg}</span>`;
}

function parseInline(text, renderIcon) {
  let html = '';
  let i = 0;

  const closeOf = (marker, from) => {
    const end = text.indexOf(marker, from);
    return end > from ? end : -1;
  };

  while (i < text.length) {
    const char = text[i];

    if (char === '\\' && i + 1 < text.length) {
      html += escapeHtml(text[i + 1]);
      i += 2;
      continue;
    }

    if (char === '`') {
      const end = closeOf('`', i + 1);
      if (end !== -1) {
        html += `<code>${escapeHtml(text.slice(i + 1, end))}</code>`;
        i = end + 1;
        continue;
      }
    }

    const pairs = [
      ['**', 'b'],
      ['~~', 's'],
      ['*', 'i'],
      ['_', 'i'],
    ];
    const pair = pairs.find(([marker]) => text.startsWith(marker, i));
    if (pair) {
      const [marker, tag] = pair;
      const end = closeOf(marker, i + marker.length);
      if (end !== -1) {
        html += `<${tag}>${parseInline(text.slice(i + marker.length, end), renderIcon)}</${tag}>`;
        i = end + marker.length;
        continue;
      }
    }

    if (char === '{' && renderIcon) {
      const match = text.slice(i).match(ICON_PATTERN);
      const svg = match && renderIcon(match[1], match[2]);
      if (svg) {
        html += buildIconHtml(match[1], match[2], svg);
        i += match[0].length;
        continue;
      }
    }

    if (char === '[') {
      const match = text.slice(i).match(LINK_PATTERN);
      const href = match && sanitizeUrl(match[2]);
      if (match && href) {
        html += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${parseInline(match[1], renderIcon)}</a>`;
        i += match[0].length;
        continue;
      }
    }

    html += escapeHtml(char);
    i += 1;
  }

  return html;
}

/**
 * Markdown inline -> HTML seguro para `innerHTML` del editor. `renderIcon(name, color)` devuelve
 * el SVG (string) de un `{icon:Nombre[:color]}`, o null si no existe; sin él los íconos quedan como texto.
 */
export function markdownToHtml(markdown = '', renderIcon) {
  if (!markdown) return '';
  // Chrome necesita un <br> extra al final para mostrar una línea vacía recién creada.
  const suffix = markdown.endsWith('\n') ? '<br>' : '';
  return markdown.split('\n').map((line) => parseInline(line, renderIcon)).join('<br>') + suffix;
}

const MARKERS = { B: '**', STRONG: '**', I: '_', EM: '_', S: '~~', STRIKE: '~~', DEL: '~~' };

function serializeChildren(node) {
  return Array.from(node.childNodes).map(serializeNode).join('');
}

function serializeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.data.replaceAll(ZWSP, '').replace(SPECIAL, '\\$&');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const tag = node.tagName;
  if (tag === 'BR') return '\n';
  if (node.dataset?.icon) return buildIconTag(node.dataset.icon, node.dataset.color);
  if (tag === 'CODE') return `\`${node.textContent.replaceAll(ZWSP, '').replace(/`/g, "'")}\``;

  const inner = serializeChildren(node);

  if (tag === 'A') {
    const href = sanitizeUrl(node.getAttribute('href'));
    return href && inner.trim() ? `[${inner}](${href})` : inner;
  }

  const marker = MARKERS[tag];
  if (marker) {
    // Los espacios de los bordes quedan fuera de los marcadores: `** a **` no es markdown válido.
    const [, lead, body, trail] = inner.match(/^(\s*)([\s\S]*?)(\s*)$/);
    return body ? `${lead}${marker}${body}${marker}${trail}` : inner;
  }

  // <div>/<p> que el navegador mete al pegar o con Enter: cada bloque es una línea.
  if (tag === 'DIV' || tag === 'P') return `${inner}\n`;

  return inner;
}

/** DOM del editor -> markdown. */
export function domToMarkdown(root) {
  const markdown = serializeChildren(root);
  // El <br> (o <div>) final que agrega el navegador para mostrar la última línea no es contenido.
  const last = root.lastChild?.nodeName;
  return (last === 'BR' || last === 'DIV' || last === 'P') && markdown.endsWith('\n')
    ? markdown.slice(0, -1)
    : markdown;
}

// Atajos de markdown al escribir: al cerrar `**x**`, `*x*`, `_x_`, `~~x~~` o `` `x` `` el
// texto se convierte en su elemento. Cada patrón captura el contenido en el grupo 1; los
// de cursiva exigen que antes del `*`/`_` de apertura no haya otra palabra pegada (snake_case).
const AUTO_FORMATS = [
  { pattern: /\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/, tag: 'b', marker: 2 },
  { pattern: /~~([^~\s](?:[^~]*[^~\s])?)~~$/, tag: 's', marker: 2 },
  { pattern: /`([^`]+)`$/, tag: 'code', marker: 1 },
  { pattern: /(?:^|[^*\w])\*([^*\s](?:[^*]*[^*\s])?)\*$/, tag: 'i', marker: 1 },
  { pattern: /(?:^|[^_\w])_([^_\s](?:[^_]*[^_\s])?)_$/, tag: 'i', marker: 1 },
];

/**
 * Si el texto justo antes del cursor cierra un atajo markdown, devuelve qué reemplazar:
 * `{ tag, content, start }` (start = offset donde empieza el marcador de apertura).
 */
export function matchAutoFormat(textBeforeCaret) {
  for (const { pattern, tag, marker } of AUTO_FORMATS) {
    const match = textBeforeCaret.match(pattern);
    if (!match) continue;
    const content = match[1];
    return { tag, content, start: textBeforeCaret.length - content.length - marker * 2 };
  }
  return null;
}
