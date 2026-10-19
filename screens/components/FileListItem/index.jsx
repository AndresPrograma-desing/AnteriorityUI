import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Share2, Download, Trash2 } from 'lucide-react';
import styles from './index.module.css';
import {
  DEFAULT_SELECT_LABEL,
  DEFAULT_SHARE_LABEL,
  DEFAULT_DOWNLOAD_LABEL,
  DEFAULT_DELETE_LABEL,
} from './constants.js';
import { getFileTypeInfo } from '../../../common/icons/fileType.js';

// Fila de lista de archivos: checkbox de selección opcional + ícono cuadrado de color
// según el tipo de archivo (ver common/icons/fileType.js, compartido con MediaViewer) +
// nombre + metadata (tamaño, fecha) + acciones a la derecha (compartir/descargar/eliminar
// por default, o cualquier JSX propio vía `actions`).
const FileListItem = ({
  name,
  url,
  size,
  date,
  selectable = false,
  selected = false,
  onSelectChange,
  selectLabel = DEFAULT_SELECT_LABEL,
  onShare,
  onDownload,
  onDelete,
  shareLabel = DEFAULT_SHARE_LABEL,
  downloadLabel = DEFAULT_DOWNLOAD_LABEL,
  deleteLabel = DEFAULT_DELETE_LABEL,
  actions,
  onClick,
  bgColor,
  borderColor,
  textColor,
  metaColor,
  className = '',
  style,
}) => {
  const { icon: Icon, bgColor: typeColor } = getFileTypeInfo(name || url);

  const colorVars = {
    ...(bgColor ? { '--file-list-item-bg': bgColor } : {}),
    ...(borderColor ? { '--file-list-item-border': borderColor } : {}),
    ...(textColor ? { '--file-list-item-text': textColor } : {}),
    ...(metaColor ? { '--file-list-item-meta': metaColor } : {}),
  };

  const isClickable = Boolean(onClick);
  const hasCustomActions = actions !== undefined;
  const hasDefaultActions = Boolean(onShare || onDownload || onDelete);

  return (
    <div
      className={`${styles.row} ${isClickable ? styles.clickable : ''} ${className}`}
      style={{ ...colorVars, ...style }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {selectable && (
        <Checkbox
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectChange?.(e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          inputProps={{ 'aria-label': selectLabel }}
          className={styles.checkbox}
        />
      )}

      <div className={styles.icon} style={{ backgroundColor: typeColor }}>
        <Icon size={18} />
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>
          {size}
          {size && date ? ' · ' : ''}
          {date}
        </span>
      </div>

      {hasCustomActions ? (
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      ) : (
        hasDefaultActions && (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {onShare && (
              <button type="button" className={styles.actionButton} onClick={onShare} aria-label={shareLabel} title={shareLabel}>
                <Share2 size={16} />
              </button>
            )}
            {onDownload && (
              <button type="button" className={styles.actionButton} onClick={onDownload} aria-label={downloadLabel} title={downloadLabel}>
                <Download size={16} />
              </button>
            )}
            {onDelete && (
              <button type="button" className={`${styles.actionButton} ${styles.deleteButton}`} onClick={onDelete} aria-label={deleteLabel} title={deleteLabel}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FileListItem;
