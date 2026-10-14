import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './index.module.css';

function NavDropdown({ open, top, onClose, children, bgColor, textColor, borderColor }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const handlePointerDown = (event) => {
            if (panelRef.current?.contains(event.target)) return;
            onClose && onClose();
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose && onClose();
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    const themeVars = {
        ...(bgColor ? { '--nav-dropdown-bg': bgColor } : {}),
        ...(textColor ? { '--nav-dropdown-text': textColor } : {}),
        ...(borderColor ? { '--nav-dropdown-border': borderColor } : {}),
    };

    return createPortal(
        <div
            ref={panelRef}
            className={styles.panel}
            style={{ top, ...themeVars }}
        >
            {children}
        </div>,
        document.body
    );
}

export default NavDropdown;
