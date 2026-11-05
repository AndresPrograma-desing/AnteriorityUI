import React, { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MarkdownContent from '../MarkdownContent/index';
import Button from '../Button/index';
import styles from './index.module.css';

// Popover de confirmación flotante, anclado en `position` (coordenadas fixed del viewport).
// `title` y `message` aceptan markdown (negritas, listas, links, etc.). Si `onConfirm` devuelve
// una promesa, el botón de confirmar entra en estado `loading` (spinner de Button) hasta que
// termine; si la promesa falla, el popover queda abierto y el error se loguea en consola.
const ConfirmPopover = forwardRef(function ConfirmPopover({
  open = true,
  position = { top: 0, left: 0 },
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
  confirmIcon,
  cancelIcon,
  buttonSize = 'small',
  onConfirm,
  onCancel,
  bgColor,
  borderColor,
  titleColor,
  textColor,
  confirmBgColor,
  confirmTextColor,
  cancelButtonProps,
  confirmButtonProps,
  className = '',
  style,
}, ref) {
  const [pending, setPending] = useState(false);

  // Escape cancela (salvo mientras una confirmación está en curso).
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !pending) onCancel?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, pending, onCancel]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!onConfirm) return;
    setPending(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const themeVars = {
    ...(bgColor ? { '--confirm-bg': bgColor } : {}),
    ...(borderColor ? { '--confirm-border': borderColor } : {}),
    ...(titleColor ? { '--confirm-title': titleColor } : {}),
    ...(textColor ? { '--confirm-text': textColor } : {}),
  };

  // Colores del botón de confirmar: el fondo va por la prop `color` de Button (color custom) y
  // el texto por `style`, que Button aplica al final de su sx.
  const confirmStyle = confirmTextColor ? { color: confirmTextColor } : undefined;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      className={`${styles.popover} ${className}`.trim()}
      style={{ top: position.top, left: position.left, ...themeVars, ...style }}
    >
      {title && (
        <div className={styles.title}>
          <MarkdownContent>{title}</MarkdownContent>
        </div>
      )}
      {message && (
        <div className={styles.message}>
          <MarkdownContent>{message}</MarkdownContent>
        </div>
      )}
      <div className={styles.actions}>
        <Button
          variant={Button.VARIANTS.OUTLINE}
          size={buttonSize}
          icon={cancelIcon}
          borderColor="var(--confirm-border, var(--sidebar-border, #e2e8f0))"
          style={{ color: 'var(--confirm-title, var(--sidebar-text, #0f172a))' }}
          {...cancelButtonProps}
          disabled={pending || cancelButtonProps?.disabled}
          onClick={() => onCancel?.()}
        >
          {cancelText}
        </Button>
        <Button
          variant={danger ? Button.VARIANTS.DANGER : Button.VARIANTS.PRIMARY}
          size={buttonSize}
          icon={confirmIcon}
          color={confirmBgColor}
          style={confirmStyle}
          {...confirmButtonProps}
          loading={pending}
          disabled={confirmButtonProps?.disabled}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>,
    document.body
  );
});

export default ConfirmPopover;
