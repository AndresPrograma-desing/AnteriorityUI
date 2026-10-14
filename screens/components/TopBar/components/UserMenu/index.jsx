import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import UserAvatar from '../../../Profile/Avatar/index';
import styles from '../../index.module.css';
import { DEFAULT_USER_MENU_LABEL } from '../../constants.js';

function UserMenu({ user, userMenuItems = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (!isOpen || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
        });
    }, [isOpen]);

    React.useEffect(() => {
        if (!isOpen) return undefined;
        const handlePointerDown = (event) => {
            if (menuRef.current?.contains(event.target)) return;
            if (buttonRef.current?.contains(event.target)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [isOpen]);

    if (!user) return null;

    return (
        <div className={styles.userSection}>
            <button
                type="button"
                ref={buttonRef}
                className={styles.userButton}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={DEFAULT_USER_MENU_LABEL}
            >
                <UserAvatar src={user.avatarUrl} name={user.name || user.email} size={28} />
            </button>

            {isOpen && menuPosition && createPortal(
                <div
                    ref={menuRef}
                    className={styles.userMenu}
                    style={{ top: menuPosition.top, right: menuPosition.right }}
                >
                    {(user.name || user.email) && (
                        <div className={styles.userMenuHeader}>
                            {user.name && <div className={styles.userMenuName}>{user.name}</div>}
                            {user.email && <div className={styles.userMenuEmail}>{user.email}</div>}
                        </div>
                    )}
                    {userMenuItems.map((menuItem) => {
                        const MenuIcon = menuItem.icon;
                        return (
                            <button
                                key={menuItem.id ?? menuItem.label}
                                type="button"
                                className={`${styles.userMenuItem} ${menuItem.variant === 'danger' ? styles.userMenuItemDanger : ''}`}
                                onClick={() => {
                                    setIsOpen(false);
                                    menuItem.onClick && menuItem.onClick();
                                }}
                            >
                                {MenuIcon && <MenuIcon size={16} />}
                                <span>{menuItem.label}</span>
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
}

export default UserMenu;
