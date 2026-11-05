import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, Pin, PinOff, Users, Loader2 } from 'lucide-react';
import styles from './index.module.css';
import { TEXTS } from '../../constants.js';
import ConfirmPopover from '../../../ConfirmPopover/index';

const CONFIRM_GAP = 8;

// Menú contextual de un item. Las acciones destructivas (eliminar / salir) abren primero un
// ConfirmPopover junto a la opción; mientras el handler (si devuelve una promesa) está corriendo,
// la opción muestra un spinner y queda deshabilitada.
function ItemContextMenu({ contextMenu, contextMenuRef, onClose, onItemEdit, onItemDelete, onItemPin, onItemCollaborators }) {
  const [pendingKey, setPendingKey] = useState(null);
  const [confirm, setConfirm] = useState(null); // { mode, item, top, left }
  const confirmRef = useRef(null);
  const deleteBtnRef = useRef(null);

  // Al abrir otro menú (otro click derecho) se descarta cualquier confirmación previa.
  useEffect(() => {
    setConfirm(null);
    setPendingKey(null);
  }, [contextMenu]);

  // Click fuera del menu o del popover de confirmación lo cierra.
  useEffect(() => {
    if (!contextMenu) return undefined;
    const handlePointerDown = (event) => {
      if (contextMenuRef?.current?.contains(event.target)) return;
      if (confirmRef.current?.contains(event.target)) return;
      onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || confirm) return; // Escape con confirmación abierta lo maneja el popover
      onClose();
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu, contextMenuRef, onClose, confirm]);

  if (!contextMenu) return null;

  const isLeave = contextMenu.item.isOwner === false;

  // Ejecuta una acción; si el handler devuelve una promesa, el spinner se muestra hasta que termine.
  const runAction = async (key, fn) => {
    setPendingKey(key);
    try {
      await fn();
      onClose();
    } catch (error) {
      setPendingKey(null);
      console.error(error);
    }
  };

  const openDeleteConfirm = () => {
    const menuRect = contextMenuRef?.current?.getBoundingClientRect();
    const btnRect = deleteBtnRef.current?.getBoundingClientRect();
    if (!menuRect || !btnRect) return;
    setConfirm({
      mode: isLeave ? 'leave' : 'delete',
      item: contextMenu.item,
      top: btnRect.top - 6,
      left: menuRect.right + CONFIRM_GAP,
    });
  };

  const rowContent = (key, Icon, label) => (
    <>
      {pendingKey === key ? <Loader2 size={14} className={styles.spin} /> : <Icon size={14} />}
      <span>{label}</span>
    </>
  );

  return createPortal(
    <>
      <div
        ref={contextMenuRef}
        className={styles.contextMenu}
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        {onItemEdit && contextMenu.item.isOwner !== false && (
          <button
            type="button"
            className={styles.contextMenuItem}
            disabled={pendingKey !== null}
            onClick={() => runAction('edit', () => onItemEdit(contextMenu.item))}
          >
            {rowContent('edit', Pencil, TEXTS.editItem)}
          </button>
        )}
        {onItemCollaborators && contextMenu.item.isOwner !== false && contextMenu.item.isShared && (
          <button
            type="button"
            className={styles.contextMenuItem}
            disabled={pendingKey !== null}
            onClick={() => runAction('collaborators', () => onItemCollaborators(contextMenu.item))}
          >
            {rowContent('collaborators', Users, TEXTS.collaboratorsItem)}
          </button>
        )}
        {onItemPin && (
          <button
            type="button"
            className={styles.contextMenuItem}
            disabled={pendingKey !== null}
            onClick={() => runAction('pin', () => onItemPin(contextMenu.item))}
          >
            {rowContent('pin', contextMenu.item.pinned ? PinOff : Pin, contextMenu.item.pinned ? TEXTS.unpinItem : TEXTS.pinItem)}
          </button>
        )}
        {onItemDelete && (
          <button
            ref={deleteBtnRef}
            type="button"
            className={`${styles.contextMenuItem} ${styles.contextMenuItemDanger} ${confirm?.mode ? styles.contextMenuItemActive : ''}`}
            disabled={pendingKey !== null}
            onClick={openDeleteConfirm}
          >
            {rowContent('delete', Trash2, isLeave ? TEXTS.leaveItem : TEXTS.deleteItem)}
          </button>
        )}
      </div>

      {confirm && (
        <ConfirmPopover
          ref={confirmRef}
          position={{ top: confirm.top, left: confirm.left }}
          danger
          title={confirm.mode === 'leave' ? TEXTS.leaveConfirmTitle : TEXTS.deleteConfirmTitle}
          message={confirm.mode === 'leave' ? TEXTS.leaveConfirmMessage : TEXTS.deleteConfirmMessage}
          cancelText={TEXTS.cancelAction}
          confirmText={confirm.mode === 'leave' ? TEXTS.confirmLeave : TEXTS.confirmDelete}
          onCancel={() => setConfirm(null)}
          onConfirm={() => runAction('delete', () => onItemDelete(confirm.item))}
        />
      )}
    </>,
    document.body
  );
}

export default ItemContextMenu;
