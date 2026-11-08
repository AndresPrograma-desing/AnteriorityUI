import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';
import styles from './index.module.css';
import { DEFAULT_DROP_LABEL, DEFAULT_DROP_ACTIVE_LABEL } from './constants.js';
import { matchesAccept, isEditableTarget } from './utils.js';

// Zona para recibir un archivo por arrastre, pegado (Ctrl/Cmd+V) o click (selector del sistema).
// Sin `children` se muestra como tarjeta vacía; con `children` los envuelve y al arrastrar un archivo
// encima muestra un overlay para reemplazarlo. El pegado escucha a nivel ventana (ignorando campos
// editables, donde Ctrl+V debe seguir pegando texto) — pasar pasteEnabled={false} para desactivarlo.
const FileDropZone = ({
  children,
  onFile,
  onReject,
  accept,
  disabled = false,
  pasteEnabled = true,
  label = DEFAULT_DROP_LABEL,
  activeLabel = DEFAULT_DROP_ACTIVE_LABEL,
  extra,
  bgColor,
  borderColor,
  textColor,
  accentColor,
  className = '',
  style,
}) => {
  const inputRef = useRef(null);
  const depthRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const accepted = useCallback(
    (file) => {
      if (matchesAccept(file, accept)) return true;
      onReject?.(file);
      return false;
    },
    [accept, onReject],
  );

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList && fileList[0];
      if (file && accepted(file)) onFile(file);
    },
    [accepted, onFile],
  );

  useEffect(() => {
    if (disabled || !pasteEnabled) return undefined;
    const onPaste = (event) => {
      if (isEditableTarget(event.target)) return;
      const files = event.clipboardData?.files;
      if (files && files.length) {
        event.preventDefault();
        handleFiles(files);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [disabled, pasteEnabled, handleFiles]);

  const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes('Files');

  const handleDragEnter = (event) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    depthRef.current += 1;
    setDragging(true);
  };
  const handleDragOver = (event) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };
  const handleDragLeave = (event) => {
    if (disabled || !hasFiles(event)) return;
    depthRef.current = Math.max(0, depthRef.current - 1);
    if (depthRef.current === 0) setDragging(false);
  };
  const handleDrop = (event) => {
    if (disabled || !hasFiles(event)) return;
    event.preventDefault();
    depthRef.current = 0;
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const cssVars = {
    ...(bgColor !== undefined && { '--fdz-bg': bgColor }),
    ...(borderColor !== undefined && { '--fdz-border': borderColor }),
    ...(textColor !== undefined && { '--fdz-text': textColor }),
    ...(accentColor !== undefined && { '--fdz-accent': accentColor }),
    ...style,
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      className={styles.input}
      tabIndex={-1}
      onChange={(event) => {
        handleFiles(event.target.files);
        event.target.value = ''; // permite volver a elegir el mismo archivo
      }}
    />
  );

  const dragProps = {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  if (children) {
    return (
      <div className={`${styles.wrapper} ${className}`} style={cssVars} {...dragProps}>
        {children}
        {input}
        {dragging && (
          <div className={styles.overlay}>
            <Upload size={22} />
            <span>{activeLabel}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.zoneActive : ''} ${disabled ? styles.zoneDisabled : ''} ${className}`}
      style={cssVars}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPicker();
        }
      }}
      {...dragProps}
    >
      <Upload size={26} />
      <span className={styles.label}>{dragging ? activeLabel : label}</span>
      {extra && (
        // Acciones propias dentro de la zona (ej. "crear planilla"): no deben abrir el selector de archivos.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
          {extra}
        </div>
      )}
      {input}
    </div>
  );
};

export default FileDropZone;
