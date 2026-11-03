import React, { forwardRef, useRef, useState } from 'react';
import { ChevronDown, Eye, Send } from 'lucide-react';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MultilinePlaceholder from '../Material-UI/Components/MultilinePlaceholder/index';
import ImagePastePreview from '../ImagePastePreview/index';
import MarkdownContent from '../MarkdownContent/index';
import Button from '../Button/index';
import usePasteImage from '../../../common/hooks/usePasteImage';
import ComposerToolbar from './components/ComposerToolbar/index';
import styles from './index.module.css';
import {
  DEFAULT_PLACEHOLDER,
  DEFAULT_ROWS,
  DEFAULT_MAX_ROWS,
  DEFAULT_SEND_LABEL,
  DEFAULT_PREVIEW_LABEL,
  DEFAULT_IMAGE_LABEL,
  DEFAULT_IMAGE_REMOVE_LABEL,
  DEFAULT_EMPTY_PREVIEW_TEXT,
  DEFAULT_SEND_MENU_LABEL,
} from './constants.js';

// Composer de chat: barra superior con botones configurables, textarea con Markdown (vista previa
// con MarkdownContent) y pegado de imágenes. Las imágenes pegadas se muestran ARRIBA del campo.
// `value` es controlado: el consumidor guarda el texto y lo limpia en `onSend` si quiere.
const ChatComposer = forwardRef(({
  value = '',
  onChange,
  onSend,
  placeholder = DEFAULT_PLACEHOLDER,
  rows = DEFAULT_ROWS,
  maxRows = DEFAULT_MAX_ROWS,
  disabled = false,

  toolbar = [],
  markdown = true,
  previewToggle = true,
  defaultPreview = false,
  previewLabel = DEFAULT_PREVIEW_LABEL,
  markdownProps,
  emptyPreviewText = DEFAULT_EMPTY_PREVIEW_TEXT,

  onImagePaste,
  imagePreviewLabel = DEFAULT_IMAGE_LABEL,
  imageRemoveLabel = DEFAULT_IMAGE_REMOVE_LABEL,

  showSend = true,
  sendLabel = DEFAULT_SEND_LABEL,
  sendIcon = Send,
  sendShortcut = 'ctrl+shift+enter',
  footerToolbar = [],
  sendColor,
  sendMenu = [],
  sendMenuLabel = DEFAULT_SEND_MENU_LABEL,
  sendLoading = false,
  // Props extra para el botón de enviar (size, activeColor, etc.). Van antes que disabled/onClick,
  // así el composer siempre controla esas dos.
  sendButtonProps,

  // Props extra para el textarea (variant, size, id, autoFocus, inputProps…). Van antes que
  // value/onChange/onKeyDown, así el composer controla el estado.
  textareaProps,

  bgColor,
  borderColor,
  textColor,
  toolbarBgColor,
  toolbarBorderColor,
  mutedTextColor,
  placeholderColor,
  inputBgColor,
  menuBgColor,
  menuTextColor,
  menuBorderColor,
  menuHoverColor,
  sendMenuIconColor,

  imagePreviewBorderColor,
  imageThumbBorderColor,
  imageLabelBgColor,
  imageLabelTextColor,
  // Props extra para el ImagePastePreview (style, o cualquier prop nueva de ese componente).
  imagePreviewProps,

  // Ancho del composer: por default ocupa todo el contenedor padre.
  width,
  maxWidth,

  className = '',
  style,
}, ref) => {
  const [preview, setPreview] = useState(defaultPreview);
  const [menuOpen, setMenuOpen] = useState(false);
  const sendGroupRef = useRef(null);
  const { onPaste, previews, clearPreview, clearAllPreviews } = usePasteImage({
    onImagePaste,
    disabled: !onImagePaste || disabled,
  });

  const hasText = value.trim().length > 0;
  const canSend = !disabled && (hasText || previews.length > 0);

  const send = () => {
    if (!canSend) return;
    onSend?.(value);
    clearAllPreviews();
  };

  // Atajo de envío: 'ctrl+shift+enter' (default), 'enter' o 'none'. Con Enter solo hay salto de línea.
  const isSendShortcut = (event) => {
    if (event.key !== 'Enter' || event.nativeEvent?.isComposing) return false;
    if (sendShortcut === 'ctrl+shift+enter') return (event.ctrlKey || event.metaKey) && event.shiftKey;
    if (sendShortcut === 'enter') return !event.shiftKey && !event.ctrlKey && !event.metaKey;
    return false;
  };

  const handleKeyDown = (event) => {
    if (!isSendShortcut(event)) return;
    event.preventDefault();
    send();
  };

  // El toggle de vista previa (si hay markdown) va al final de la barra, después de los botones del consumidor.
  const items = [...toolbar];
  if (markdown && previewToggle) {
    items.push({
      type: 'toggle',
      key: '__preview',
      label: previewLabel,
      icon: Eye,
      active: preview,
      onClick: () => setPreview((current) => !current),
    });
  }

  // Solo se emiten los colores que el consumidor define; el resto usa el default del CSS.
  const colorVars = {
    ...(bgColor ? { '--chat-composer-bg': bgColor } : {}),
    ...(borderColor ? { '--chat-composer-border': borderColor } : {}),
    ...(textColor ? { '--chat-composer-text': textColor } : {}),
    ...(mutedTextColor ? { '--chat-composer-muted': mutedTextColor } : {}),
    ...(placeholderColor ? { '--chat-composer-placeholder': placeholderColor } : {}),
    ...(toolbarBgColor ? { '--chat-composer-toolbar-bg': toolbarBgColor } : {}),
    ...(toolbarBorderColor ? { '--chat-composer-toolbar-border': toolbarBorderColor } : {}),
    ...(sendMenuIconColor ? { '--chat-composer-send-icon': sendMenuIconColor } : {}),
    ...(menuHoverColor ? { '--chat-composer-menu-hover': menuHoverColor } : {}),
    ...(menuBgColor ? { '--chat-composer-menu-bg': menuBgColor } : {}),
    ...(menuTextColor ? { '--chat-composer-menu-text': menuTextColor } : {}),
    ...(menuBorderColor ? { '--chat-composer-menu-border': menuBorderColor } : {}),
  };

  const showMarkdownView = markdown && preview;

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      style={{
        ...colorVars,
        ...(width !== undefined ? { width } : {}),
        ...(maxWidth !== undefined ? { maxWidth } : {}),
        ...style,
      }}
    >
      {items.length > 0 && <ComposerToolbar items={items} />}

      <div className={styles.body}>
        {previews.length > 0 && (
          <ImagePastePreview
            previews={previews}
            onRemove={clearPreview}
            label={imagePreviewLabel}
            removeLabel={imageRemoveLabel}
            borderColor={imagePreviewBorderColor}
            thumbBorderColor={imageThumbBorderColor}
            labelBgColor={imageLabelBgColor}
            labelTextColor={imageLabelTextColor}
            className={styles.previews}
            {...imagePreviewProps}
          />
        )}

        {showMarkdownView ? (
          <div className={styles.markdownView}>
            {hasText ? (
              <MarkdownContent {...markdownProps}>{value}</MarkdownContent>
            ) : (
              <span className={styles.emptyPreview}>{emptyPreviewText}</span>
            )}
          </div>
        ) : (
          <MultilinePlaceholder
            {...textareaProps}
            ref={ref}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            onPaste={onPaste}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            maxRows={maxRows}
            disabled={disabled}
            bgColor={inputBgColor ?? 'transparent'}
            showImagePreview={false}
            wrapperClassName={styles.field}
            fullWidth
          />
        )}
      </div>

      {(footerToolbar.length > 0 || showSend) && (
        <div className={styles.footer}>
          {footerToolbar.length > 0 && <ComposerToolbar items={footerToolbar} className={styles.footerTools} />}
          <span className={styles.spacer} />
          {showSend && (
            <div
              className={`${styles.sendGroup} ${sendMenu.length > 0 ? styles.sendGroupWithMenu : ''}`.trim()}
              ref={sendGroupRef}
            >
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
              {sendMenu.length > 0 && (
                <button
                  type="button"
                  className={styles.sendMenuBtn}
                  style={{ background: sendColor ?? Button.COLORS.PRIMARY }}
                  aria-label={sendMenuLabel}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <ChevronDown size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {sendMenu.length > 0 && (
        <Popper open={menuOpen} anchorEl={sendGroupRef.current} placement="top-end" style={{ zIndex: 1400 }}>
          <ClickAwayListener
            onClickAway={(event) => {
              // El click en el chevron ya alterna el menú: no lo cerramos aquí para no reabrirlo.
              if (sendGroupRef.current?.contains(event.target)) return;
              setMenuOpen(false);
            }}
          >
            <div
              className={styles.menu}
              role="menu"
              style={{
                ...(menuBgColor ? { '--chat-composer-menu-bg': menuBgColor } : {}),
                ...(menuTextColor ? { '--chat-composer-menu-text': menuTextColor } : {}),
                ...(menuBorderColor ? { '--chat-composer-menu-border': menuBorderColor } : {}),
              }}
              onKeyDown={(event) => { if (event.key === 'Escape') setMenuOpen(false); }}
            >
              {sendMenu.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key ?? index}
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    disabled={item.disabled}
                    onClick={() => {
                      setMenuOpen(false);
                      item.onClick?.(value);
                    }}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </ClickAwayListener>
        </Popper>
      )}
    </div>
  );
});

ChatComposer.displayName = 'ChatComposer';

export default ChatComposer;
