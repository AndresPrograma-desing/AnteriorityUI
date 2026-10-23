import React from 'react';
import styles from './index.module.css';

function ResizeHandle({ isDragging, onMouseDown, onDoubleClick, title }) {
  return (
    <div
      className={`${styles.resizeHandle} ${isDragging ? styles.resizeHandleDragging : ''}`}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      title={title}
    >
      <div className={styles.gripPill} />
    </div>
  );
}

export default ResizeHandle;
