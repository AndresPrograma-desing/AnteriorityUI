import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from '../../../Button/index';
import { CLOSE_STYLE } from '../../constants';
import styles from './index.module.css';

// Modal centrado con backdrop, cierre por Esc / clic en el fondo y bloqueo del scroll del body.
// Se renderiza en un portal, por lo que las variables de color se aplican en el propio overlay
// (las custom properties del trigger no heredan hacia un portal en <body>).
const PickerModal = ({ title, closeLabel, onClose, rootClassName, colorVars, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // Un popover con su propio role="dialog" (ej. el ColorPicker) maneja su Escape.
      const dialog = e.target.closest?.('[role="dialog"]');
      if (dialog && dialog !== modalRef.current) return;
      onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`${styles.overlay} ${rootClassName}`}
      style={colorVars}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <Button variant="ghost" circle size="small" icon={X} onClick={onClose} aria-label={closeLabel} style={CLOSE_STYLE} />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default PickerModal;
