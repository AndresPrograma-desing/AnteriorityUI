import React, { createElement, forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Bold, Code, Italic, Link as LinkIcon, Send, Smile, Strikethrough } from 'lucide-react';
import Button from '../Button/index';
import { renderToStaticMarkup } from 'react-dom/server';
import EmojiPickerModal, { resolveIcon } from '../EmojiPickerModal/index';
import ScrollBar from '../ScrollBar/index';
import ImagePastePreview from '../ImagePastePreview/index';
import usePasteImage from '../../../common/hooks/usePasteImage';
import ComposerToolbar from '../ChatComposer/components/ComposerToolbar/index';
import styles from './index.module.css';
import {
  DEFAULT_IMAGE_LABEL,
  DEFAULT_IMAGE_REMOVE_LABEL,
  DEFAULT_LABELS,
  DEFAULT_MAX_ROWS,
  DEFAULT_MIN_ROWS,
  DEFAULT_PLACEHOLDER,
  DEFAULT_SEND_LABEL,
  DEFAULT_TOOLS,
  ZWSP,
} from './constants.js';
import { buildIconHtml, domToMarkdown, markdownToHtml, matchAutoFormat, sanitizeUrl } from './utils.js';

const LINE_HEIGHT_EM = 1.5;

// SVG (string) del ícono de react-icons `name`, o null si no existe. Hereda el color del texto salvo que se pase `color`.
const renderIcon = (name, color) => {
  const Icon = resolveIcon(name);
  return Icon ? renderToStaticMarkup(createElement(Icon, { size: '1.2em', color: color || undefined })) : null;
};
const TAG_TOOL = { b: 'bold', i: 'italic', s: 'strike', code: 'code' };
const COMMAND_TOOL = { bold: 'bold', italic: 'italic', strikeThrough: 'strike' };

// Input de chat con formato en vivo: lo que se escribe se renderiza al instante (negrita,
// cursiva, tachado, código, enlaces) en vez de mostrarse como `**texto**`. Se puede aplicar
// el formato con la barra, con atajos (Ctrl+B/I/E/K, Ctrl+Shift+X) o escribiendo el markdown
// (`**x**`, `*x*`, `~~x~~`, `` `x` ``), que se convierte al cerrarlo.
// `value` es el markdown (controlado) y `onChange(markdown)` / `onSend(markdown)` lo devuelven.
const RichChatInput = forwardRef(({
  value = '',
  onChange,
  onSend,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
  minRows = DEFAULT_MIN_ROWS,
  maxRows = DEFAULT_MAX_ROWS,
  autoFocus = false,

  tools = DEFAULT_TOOLS,
  toolbarPosition = 'top',
  labels = {},

  showSend = true,
  sendLabel = DEFAULT_SEND_LABEL,
  sendIcon = Send,
  sendShortcut = 'enter',
  sendColor,
  sendLoading = false,
  sendButtonProps,
  // Pegado de imágenes (Ctrl+V): sin `onImagePaste` está desactivado. Los chips se muestran arriba del campo.
  onImagePaste,
  imagePreviewLabel = DEFAULT_IMAGE_LABEL,
  imageRemoveLabel = DEFAULT_IMAGE_REMOVE_LABEL,
  imagePreviewProps,
  // Props extra para el EmojiPickerModal (locale, theme, quickEmojis, colores…).
  emojiPickerProps,
  // Botones extra de la barra (mismos items que ChatComposer: icon, button, toggle, custom…).
  extraTools = [],

  bgColor,
  borderColor,
  focusBorderColor,
  textColor,
  placeholderColor,
  toolbarBgColor,
  toolbarBorderColor,
  codeBgColor,
  codeTextColor,
  linkColor,

  width,
  maxWidth,
  className = '',
  style,
}, ref) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const editorRef = useRef(null);
  const lastValueRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const [active, setActive] = useState({});
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const toolbarRef = useRef(null);

  const setRefs = useCallback((node) => {
    editorRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  // Sincroniza el DOM con `value` solo cuando cambia desde afuera (limpiar tras enviar,
  // cargar un borrador…). Si el cambio vino del propio editor no se toca el DOM: reescribirlo
  // mandaría el cursor al inicio.
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastValueRef.current) return;
    // security-ok: markdownToHtml escapa todo el texto (&, <, >, ") y solo emite sus propias etiquetas; los href pasan por sanitizeUrl (solo http/https/mailto).
    editor.innerHTML = markdownToHtml(value, renderIcon);
    lastValueRef.current = value;
    setIsEmpty(!value);
  }, [value]);

  useEffect(() => {
    if (autoFocus) editorRef.current?.focus();
  }, [autoFocus]);

  const has = (tool) => tools.includes(tool);

  const closestIn = (node, selector) => {
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    const found = element?.closest(selector);
    return found && editorRef.current?.contains(found) ? found : null;
  };

  const getRange = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return null;
    const range = selection.getRangeAt(0);
    return editorRef.current?.contains(range.commonAncestorContainer) ? range : null;
  };

  const setCaret = (node, offset) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Deja un punto de escritura justo después de `element` (fuera de él).
  const caretAfter = (element) => {
    const anchor = document.createTextNode(ZWSP);
    element.after(anchor);
    setCaret(anchor, 1);
  };

  const emit = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const markdown = domToMarkdown(editor);
    // Sin contenido real se vacía el DOM: el navegador deja un <br> suelto que rompería el placeholder.
    if (!markdown && editor.firstChild) editor.replaceChildren();
    lastValueRef.current = markdown;
    setIsEmpty(!markdown);
    onChange?.(markdown);
  };

  const refreshActive = useCallback(() => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) return;
    const inside = (selector) => !!closestIn(selection.anchorNode, selector);
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      strike: document.queryCommandState('strikeThrough'),
      code: inside('code'),
      link: inside('a'),
    });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refreshActive);
    return () => document.removeEventListener('selectionchange', refreshActive);
  }, [refreshActive]);

  const applyCommand = (command) => {
    if (disabled || !has(COMMAND_TOOL[command])) return;
    editorRef.current?.focus();
    document.execCommand(command);
    emit();
    refreshActive();
  };

  const toggleCode = () => {
    if (disabled || !has('code')) return;
    const editor = editorRef.current;
    editor?.focus();
    const range = getRange();
    if (!range) return;

    const existing = closestIn(range.startContainer, 'code');
    if (existing && range.collapsed) {
      caretAfter(existing);
    } else if (existing) {
      existing.replaceWith(...existing.childNodes);
    } else {
      const code = document.createElement('code');
      if (range.collapsed) {
        code.textContent = ZWSP;
        range.insertNode(code);
        setCaret(code.firstChild, 1);
      } else {
        code.textContent = range.toString();
        range.deleteContents();
        range.insertNode(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        const selected = document.createRange();
        selected.selectNodeContents(code);
        selection.addRange(selected);
      }
    }
    emit();
    refreshActive();
  };

  const openLink = () => {
    if (disabled || !has('link')) return;
    const range = getRange();
    savedRangeRef.current = range ? range.cloneRange() : null;
    setLinkUrl(closestIn(range?.startContainer, 'a')?.getAttribute('href') ?? '');
    setLinkOpen(true);
  };

  const closeLink = () => {
    setLinkOpen(false);
    editorRef.current?.focus();
    const saved = savedRangeRef.current;
    if (saved) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(saved);
    }
  };

  const applyLink = () => {
    const editor = editorRef.current;
    const saved = savedRangeRef.current;
    const href = sanitizeUrl(linkUrl);
    closeLink();
    if (!editor) return;

    const range = saved ?? document.createRange();
    if (!saved) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    const existing = closestIn(range.startContainer, 'a');

    if (existing) {
      if (href) existing.setAttribute('href', href);
      else existing.replaceWith(...existing.childNodes);
    } else if (href) {
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      if (range.collapsed) {
        anchor.textContent = href;
        range.insertNode(anchor);
      } else {
        anchor.append(range.extractContents());
        range.insertNode(anchor);
      }
      caretAfter(anchor);
    }
    emit();
    refreshActive();
  };

  // El picker le quita el foco al editor, así que se guarda la posición del cursor antes de abrirlo.
  const openEmoji = () => {
    if (disabled || !has('emoji')) return;
    const range = getRange();
    savedRangeRef.current = range ? range.cloneRange() : null;
    setEmojiOpen((open) => !open);
  };

  // Un emoji se inserta tal cual; un ícono como SVG inline (en el markdown queda `{icon:Nombre[:color]}`).
  const insertEmoji = (item, { color } = {}) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const saved = savedRangeRef.current;
    if (saved) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(saved);
    }
    const svg = renderIcon(item, color);
    if (!svg) {
      document.execCommand('insertText', false, item);
      emit();
      return;
    }

    // Se inserta con la API de Range y no con execCommand('insertHTML'): este último descarta o
    // reubica un nodo no editable cuando el campo está vacío (el SVG no aparecía sin texto previo).
    let range = getRange();
    if (!range) {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    const template = document.createElement('template');
    // security-ok: el SVG sale de react-icons (índice propio) y el nombre/color se validan en buildIconHtml.
    template.innerHTML = buildIconHtml(item, color, svg);
    const icon = template.content.firstElementChild;
    range.deleteContents();
    range.insertNode(icon);
    caretAfter(icon);
    emit();
  };

  // Convierte `**x**`, `*x*`, `_x_`, `~~x~~` y `` `x` `` en su elemento al cerrar el marcador.
  const autoFormat = () => {
    const range = getRange();
    const node = range?.startContainer;
    if (!range?.collapsed || node?.nodeType !== Node.TEXT_NODE || closestIn(node, 'code')) return;

    const match = matchAutoFormat(node.data.slice(0, range.startOffset));
    if (!match || !has(TAG_TOOL[match.tag])) return;

    const element = document.createElement(match.tag);
    element.textContent = match.content;
    const replaced = document.createRange();
    replaced.setStart(node, match.start);
    replaced.setEnd(node, range.startOffset);
    replaced.deleteContents();
    replaced.insertNode(element);
    caretAfter(element);
  };

  const handleInput = (event) => {
    if (event.nativeEvent.inputType === 'insertText' && !event.nativeEvent.isComposing) autoFormat();
    emit();
    refreshActive();
  };

  const { onPaste: pasteImage, previews, clearPreview, clearAllPreviews } = usePasteImage({
    onImagePaste,
    disabled: !onImagePaste || disabled,
  });

  const canSend = !disabled && (!isEmpty || previews.length > 0);

  // onSend(markdown, files): `files` son las imágenes pegadas que siguen en los chips.
  const send = () => {
    if (!canSend) return;
    onSend?.(lastValueRef.current ?? '', previews.map((preview) => preview.file));
    clearAllPreviews();
  };

  const isSendShortcut = (event) => {
    if (sendShortcut === 'enter') return !event.shiftKey && !event.ctrlKey && !event.metaKey;
    if (sendShortcut === 'ctrl+enter') return (event.ctrlKey || event.metaKey) && !event.shiftKey;
    if (sendShortcut === 'ctrl+shift+enter') return (event.ctrlKey || event.metaKey) && event.shiftKey;
    return false;
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      if (isSendShortcut(event)) send();
      else document.execCommand('insertLineBreak');
      return;
    }

    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    const shortcuts = {
      b: () => applyCommand('bold'),
      i: () => applyCommand('italic'),
      e: toggleCode,
      k: openLink,
      ...(event.shiftKey ? { x: () => applyCommand('strikeThrough') } : {}),
    };
    if (shortcuts[key]) {
      event.preventDefault();
      shortcuts[key]();
    }
  };

  // Al final de cada enlace el CSS dibuja un ícono de "abrir en otra pestaña" (::after). Un enlace dentro
  // de un campo editable no navega al hacer click (se usa para ubicar el cursor), así que solo el click
  // sobre ese ícono —la franja derecha del último fragmento del enlace— abre la URL.
  const handleClick = (event) => {
    const anchor = event.target.closest?.('a');
    if (!anchor || !editorRef.current?.contains(anchor)) return;
    const rects = anchor.getClientRects();
    const last = rects[rects.length - 1];
    if (!last) return;
    const iconWidth = parseFloat(window.getComputedStyle(anchor).fontSize) * 1.4;
    const onIcon =
      event.clientX >= last.right - iconWidth && event.clientX <= last.right &&
      event.clientY >= last.top && event.clientY <= last.bottom;
    const href = sanitizeUrl(anchor.getAttribute('href'));
    if (!onIcon || !href) return;
    event.preventDefault();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  // Imágenes -> chips. Texto: se toma el texto plano (nunca el HTML ajeno, que metería estilos que
  // el markdown no representa) y se interpreta como markdown, así lo copiado con `**x**` o `código` llega ya formateado.
  const handlePaste = (event) => {
    pasteImage(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    const pasted = event.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n');
    if (!pasted) return;
    // security-ok: markdownToHtml escapa todo el texto y sanea los href (solo http/https/mailto).
    document.execCommand('insertHTML', false, markdownToHtml(pasted, renderIcon));
    emit();
  };

  const toolItems = [
    has('bold') && { key: 'bold', type: 'icon', icon: Bold, tooltip: text.boldTooltip, active: active.bold, onClick: () => applyCommand('bold') },
    has('italic') && { key: 'italic', type: 'icon', icon: Italic, tooltip: text.italicTooltip, active: active.italic, onClick: () => applyCommand('italic') },
    has('strike') && { key: 'strike', type: 'icon', icon: Strikethrough, tooltip: text.strikeTooltip, active: active.strike, onClick: () => applyCommand('strikeThrough') },
    has('code') && { key: 'code', type: 'icon', icon: Code, tooltip: text.codeTooltip, active: active.code, onClick: toggleCode },
    has('link') && { key: 'link', type: 'icon', icon: LinkIcon, tooltip: text.linkTooltip, active: active.link, onClick: openLink },
    has('emoji') && { key: 'emoji', type: 'icon', icon: Smile, tooltip: text.emojiTooltip, active: emojiOpen, onClick: openEmoji },
  ].filter(Boolean).map((item) => ({ ...item, disabled }));

  const items = [...toolItems, ...extraTools];

  const toolbar = items.length > 0 && (
    // mousedown con preventDefault: los botones no le quitan el foco ni la selección al editor.
    <div ref={toolbarRef} onMouseDown={(event) => event.preventDefault()}>
      <ComposerToolbar items={items} className={styles.tools} />
    </div>
  );

  const colorVars = {
    ...(bgColor ? { '--rich-chat-bg': bgColor } : {}),
    ...(borderColor ? { '--rich-chat-border': borderColor } : {}),
    ...(focusBorderColor ? { '--rich-chat-focus-border': focusBorderColor } : {}),
    ...(textColor ? { '--rich-chat-text': textColor } : {}),
    ...(placeholderColor ? { '--rich-chat-placeholder': placeholderColor } : {}),
    ...(toolbarBgColor ? { '--rich-chat-toolbar-bg': toolbarBgColor } : {}),
    ...(toolbarBorderColor ? { '--rich-chat-toolbar-border': toolbarBorderColor } : {}),
    ...(codeBgColor ? { '--rich-chat-code-bg': codeBgColor } : {}),
    ...(codeTextColor ? { '--rich-chat-code-text': codeTextColor } : {}),
    ...(linkColor ? { '--rich-chat-link': linkColor } : {}),
  };

  return (
    <div
      className={`${styles.root} ${disabled ? styles.disabled : ''} ${className}`.trim()}
      style={{
        ...colorVars,
        ...(width !== undefined ? { width } : {}),
        ...(maxWidth !== undefined ? { maxWidth } : {}),
        ...style,
      }}
    >
      {toolbarPosition === 'top' && toolbar && <div className={styles.topBar}>{toolbar}</div>}

      {has('emoji') && (
        <EmojiPickerModal
          {...emojiPickerProps}
          anchorEl={toolbarRef}
          open={emojiOpen}
          onClose={() => setEmojiOpen(false)}
          onSelect={insertEmoji}
        />
      )}

      {linkOpen && (
        <div className={styles.linkRow}>
          <input
            className={styles.linkInput}
            type="url"
            value={linkUrl}
            placeholder={text.linkPlaceholder}
            autoFocus
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') { event.preventDefault(); applyLink(); }
              if (event.key === 'Escape') { event.preventDefault(); closeLink(); }
            }}
          />
          <Button size={Button.SIZES.SMALL} variant={Button.VARIANTS.GHOST} onClick={closeLink}>{text.linkCancelLabel}</Button>
          <Button size={Button.SIZES.SMALL} onClick={applyLink} disabled={!sanitizeUrl(linkUrl) && !active.link}>{text.linkApplyLabel}</Button>
        </div>
      )}

      {previews.length > 0 && (
        <ImagePastePreview
          previews={previews}
          onRemove={clearPreview}
          label={imagePreviewLabel}
          removeLabel={imageRemoveLabel}
          className={styles.previews}
          {...imagePreviewProps}
        />
      )}

      <ScrollBar horizontal={false} maxHeight={`${maxRows * LINE_HEIGHT_EM}em`} className={styles.scroll}>
        <div
          ref={setRefs}
          className={styles.editor}
          style={{ minHeight: `${minRows * LINE_HEIGHT_EM}em` }}
          contentEditable={!disabled}
          role="textbox"
          aria-multiline="true"
          aria-disabled={disabled}
          aria-placeholder={placeholder}
          data-placeholder={placeholder}
          data-empty={isEmpty}
          spellCheck
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onClick={handleClick}
          onDrop={(event) => event.preventDefault()}
        />
      </ScrollBar>

      {(showSend || (toolbarPosition === 'bottom' && toolbar)) && (
        <div className={styles.footer}>
          {toolbarPosition === 'bottom' && toolbar}
          <span className={styles.spacer} />
          {showSend && (
            <Button
              {...sendButtonProps}
              variant={Button.VARIANTS.PRIMARY}
              color={sendColor ?? Button.COLORS.PRIMARY}
              icon={sendIcon}
              loading={sendLoading}
              disabled={!canSend}
              onClick={send}
              ToolTip={sendLabel}
              className={styles.sendBtn}
            />
          )}
        </div>
      )}
    </div>
  );
});

RichChatInput.displayName = 'RichChatInput';

export default RichChatInput;
