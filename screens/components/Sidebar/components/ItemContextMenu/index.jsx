import React from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, Pin, PinOff, Users } from 'lucide-react';
import styles from './index.module.css';
import { TEXTS } from '../../constants.js';

function ItemContextMenu({ contextMenu, contextMenuRef, onClose, onItemEdit, onItemDelete, onItemPin, onItemCollaborators }) {
  if (!contextMenu) return null;

  return createPortal(
    <div
      ref={contextMenuRef}
      className={styles.contextMenu}
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      {onItemEdit && contextMenu.item.isOwner !== false && (
        <button
          type="button"
          className={styles.contextMenuItem}
          onClick={() => {
            onItemEdit(contextMenu.item);
            onClose();
          }}
        >
          <Pencil size={14} />
          <span>{TEXTS.editItem}</span>
        </button>
      )}
      {onItemCollaborators && contextMenu.item.isOwner !== false && contextMenu.item.isShared && (
        <button
          type="button"
          className={styles.contextMenuItem}
          onClick={() => {
            onItemCollaborators(contextMenu.item);
            onClose();
          }}
        >
          <Users size={14} />
          <span>{TEXTS.collaboratorsItem}</span>
        </button>
      )}
      {onItemPin && (
        <button
          type="button"
          className={styles.contextMenuItem}
          onClick={() => {
            onItemPin(contextMenu.item);
            onClose();
          }}
        >
          {contextMenu.item.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          <span>{contextMenu.item.pinned ? TEXTS.unpinItem : TEXTS.pinItem}</span>
        </button>
      )}
      {onItemDelete && (
        <button
          type="button"
          className={`${styles.contextMenuItem} ${styles.contextMenuItemDanger}`}
          onClick={() => {
            onItemDelete(contextMenu.item);
            onClose();
          }}
        >
          <Trash2 size={14} />
          <span>{contextMenu.item.isOwner === false ? TEXTS.leaveItem : TEXTS.deleteItem}</span>
        </button>
      )}
    </div>,
    document.body
  );
}

export default ItemContextMenu;
