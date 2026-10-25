import { visit } from 'unist-util-visit';

// {copy}...{/copy} soporta dos formas:
// - Inline (una línea, sin salto de línea ni fence): se resuelve como antes, via el
//   truco de link markdown con protocolo custom "copy:" (ver index.jsx, createLinkRenderer).
// - Bloque (contiene saltos de línea y/o ```fences```, ej. una sección completa con
//   headings + código + texto): no puede resolverse como link inline (CommonMark no
//   permite nodos de bloque dentro del texto de un link), así que se resuelve acá con
//   un plugin remark real que envuelve los nodos del AST entre marcadores en un
//   contenedor <div data-copy-block id>, manteniendo el markdown interno con su
//   render normal (headings, code fences, etc. siguen funcionando).
const COPY_BLOCK_PATTERN = /\{copy\}([\s\S]*?)\{\/copy\}/g;
const COPY_START_PREFIX = '{{copy-block-start:';
const COPY_END_MARKER = '{{copy-block-end}}';

const isBlockContent = (text) => text.includes('\n') || text.includes('```');

// Reemplaza cada {copy}...{/copy} que sea contenido de bloque por marcadores de párrafo
// standalone, y devuelve el markdown resultante + un mapa id -> texto crudo original
// (para el botón de copiar, que copia el markdown fuente tal cual se escribió).
export function extractCopyBlocks(markdown) {
  const blocks = {};
  if (typeof markdown !== 'string' || !markdown.includes('{copy}')) {
    return { markdown, blocks };
  }

  let id = 0;
  const result = markdown.replace(COPY_BLOCK_PATTERN, (match, inner) => {
    if (!isBlockContent(inner)) return match; // inline: lo resuelve preprocessCopyTags

    const blockId = `cb${id++}`;
    blocks[blockId] = inner.trim();
    return `\n\n${COPY_START_PREFIX}${blockId}}}\n\n${inner}\n\n${COPY_END_MARKER}\n\n`;
  });

  return { markdown: result, blocks };
}

// Plugin remark: busca los párrafos marcadores (ya parseados como texto plano, ya que
// no son sintaxis markdown real) y envuelve los nodos hermanos entre start/end en un
// nodo contenedor mdast custom, con data.hName para que se renderice como
// <div data-copy-block="id"> vía mdast-util-to-hast.
export function remarkCopyBlocks() {
  return (tree) => {
    const startPattern = new RegExp(`^${COPY_START_PREFIX.replace(/[{}]/g, '\\$&')}([a-z0-9]+)\\}\\}$`);

    visit(tree, 'root', (root) => {
      const children = root.children;
      const nextChildren = [];
      let i = 0;

      while (i < children.length) {
        const node = children[i];
        const text = node.type === 'paragraph' ? node.children?.map((c) => c.value || '').join('') : null;
        const startMatch = text && startPattern.exec(text);

        if (startMatch) {
          const blockId = startMatch[1];
          const inner = [];
          i += 1;

          while (i < children.length) {
            const current = children[i];
            const currentText =
              current.type === 'paragraph' ? current.children?.map((c) => c.value || '').join('') : null;
            if (currentText === COPY_END_MARKER) {
              i += 1;
              break;
            }
            inner.push(current);
            i += 1;
          }

          nextChildren.push({
            type: 'copyBlock',
            data: {
              hName: 'div',
              hProperties: { 'data-copy-block': blockId },
            },
            children: inner,
          });
          continue;
        }

        nextChildren.push(node);
        i += 1;
      }

      root.children = nextChildren;
    });
  };
}
