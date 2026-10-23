import { IMAGE_TOKEN_PREFIX, MAX_EDITOR_HEIGHT, MIN_EDITOR_HEIGHT } from './constants.js';

// Todas las funciones de este archivo son puras: reciben el texto completo y una
// posición/selección, y devuelven el texto resultante más dónde debería quedar la nueva
// selección — nunca tocan el DOM (focus/selectionRange) ni disparan onChange. Eso queda
// del lado del componente (index.jsx), que es quien tiene el textareaRef.

/**
 * Envuelve el texto seleccionado (o `defaultText` si no hay selección) entre `before` y
 * `after`. Usado por bold/italic/código/link/color/tabla.
 */
export function buildWrappedInsertion(value, selectionStart, selectionEnd, before, after = '', defaultText = '') {
  const selectedText = value.substring(selectionStart, selectionEnd);
  const textToInsert = selectedText || defaultText;

  const newContent =
    value.substring(0, selectionStart) + before + textToInsert + after + value.substring(selectionEnd);

  const newSelectionStart = selectionStart + before.length;
  const newSelectionEnd = newSelectionStart + textToInsert.length;

  return { newContent, newSelectionStart, newSelectionEnd };
}

/**
 * Inserta `text` tal cual en la posición del cursor (sin before/after), dejando el
 * cursor al final de lo insertado. Usado por el token `[imagen:id]` al pegar.
 */
export function buildPlainInsertion(value, selectionStart, selectionEnd, text) {
  const newContent = value.substring(0, selectionStart) + text + value.substring(selectionEnd);
  const newSelectionStart = selectionStart + text.length;
  return { newContent, newSelectionStart, newSelectionEnd: newSelectionStart };
}

/**
 * Antepone `prefix` a cada línea seleccionada (o a la línea actual si no hay selección
 * multilínea). Usado por títulos (#, ##, ###), listas (-, 1.) y cita (>).
 */
export function buildLinePrefixInsertion(value, selectionStart, selectionEnd, prefix) {
  const lastNewline = value.lastIndexOf('\n', selectionStart - 1);
  const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

  const selectedLines = value.substring(lineStart, selectionEnd).split('\n');
  const prefixedLines = selectedLines.map((line) => `${prefix}${line}`).join('\n');

  const newContent = value.substring(0, lineStart) + prefixedLines + value.substring(selectionEnd);

  return {
    newContent,
    newSelectionStart: lineStart + prefix.length,
    newSelectionEnd: lineStart + prefixedLines.length,
  };
}

const BULLET_LINE_PATTERN = /^(\s*)-\s+/;
const ORDERED_LINE_PATTERN = /^(\s*)(\d+)\.\s+/;

/**
 * Decide qué pasa al presionar Enter dentro de una lista (continuar la lista con el
 * siguiente marcador, o cortarla si la línea actual está vacía). Devuelve `null` si la
 * línea actual no es parte de una lista (el caller debe dejar que Enter actúe normal).
 */
export function buildListContinuation(value, cursorPosition) {
  const lastNewline = value.lastIndexOf('\n', cursorPosition - 1);
  const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
  const currentLine = value.substring(lineStart, cursorPosition);

  const bulletMatch = currentLine.match(BULLET_LINE_PATTERN);
  const orderedMatch = currentLine.match(ORDERED_LINE_PATTERN);

  if (bulletMatch) {
    if (currentLine.trim() === '-') {
      const newContent = value.substring(0, lineStart) + value.substring(cursorPosition);
      return { newContent, newCursorPosition: lineStart };
    }
    const newText = `\n${bulletMatch[1]}- `;
    const newContent = value.substring(0, cursorPosition) + newText + value.substring(cursorPosition);
    return { newContent, newCursorPosition: cursorPosition + newText.length };
  }

  if (orderedMatch) {
    const num = parseInt(orderedMatch[2], 10);
    if (currentLine.trim() === `${num}.`) {
      const newContent = value.substring(0, lineStart) + value.substring(cursorPosition);
      return { newContent, newCursorPosition: lineStart };
    }
    const newText = `\n${orderedMatch[1]}${num + 1}. `;
    const newContent = value.substring(0, cursorPosition) + newText + value.substring(cursorPosition);
    return { newContent, newCursorPosition: cursorPosition + newText.length };
  }

  return null;
}

/** Plantilla de tabla GFM de ejemplo con los encabezados/filas que se le pasen. */
export function buildTableTemplate([col1, col2, col3], [row1, row2, row3]) {
  return `\n| ${col1} | ${col2} | ${col3} |\n| --- | --- | --- |\n| ${row1} | ${row2} | ${row3} |\n`;
}

/** Alterna entre el alto "colapsado" y "expandido" al hacer doble click en el resize handle. */
export function getDoubleClickHeight(currentHeight, collapsedHeight, expandedHeight, expandThreshold) {
  return currentHeight > expandThreshold ? collapsedHeight : expandedHeight;
}

/** Clampea el alto del editor mientras se arrastra el resize handle. */
export function clampEditorHeight(height) {
  return Math.max(MIN_EDITOR_HEIGHT, Math.min(MAX_EDITOR_HEIGHT, height));
}

/** Id corto y suficientemente único para el token [imagen:id] de una imagen pegada. */
export function generateImageId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function buildImageToken(id) {
  return `[${IMAGE_TOKEN_PREFIX}:${id}]`;
}

/**
 * Reemplaza el token [imagen:id] por `![](url)` en `value`. Puro: no asume que el token
 * siga en la posición donde se insertó (el usuario pudo haber seguido escribiendo entre
 * que se pegó la imagen y que resolvió la subida).
 */
export function replaceImageTokenInValue(value, id, url) {
  const token = buildImageToken(id);
  if (!value.includes(token)) return value;
  return value.replace(token, `![](${url})`);
}
