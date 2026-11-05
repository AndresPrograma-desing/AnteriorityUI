import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../Button/index';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import styles from './index.module.css';
import { getInitial } from '../../utils.js';

// Duración de la animación de salida (debe coincidir con userMenuOut en index.module.css).
const CLOSE_ANIMATION_MS = 160;
const USER_MENU_WIDTH = 240;
const USER_MENU_GAP = 10;

function UserFooter({
  user,
  userMenuItems = [],
  userMenuLinks = [],
  userFooterAction,
  effectiveCollapsed,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState(null);
  const userFooterButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const closeTimerRef = useRef(null);

  const closeUserMenu = () => {
    if (!isUserMenuOpen || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  };

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  // El menú sale al costado de la sidebar (no encima del botón), alineado con la base del botón.
  useLayoutEffect(() => {
    if (!isUserMenuOpen || !userFooterButtonRef.current) return;
    const buttonRect = userFooterButtonRef.current.getBoundingClientRect();
    const sidebarRect = userFooterButtonRef.current.closest('aside')?.getBoundingClientRect() ?? buttonRect;
    setUserMenuPosition({
      bottom: window.innerHeight - buttonRect.bottom,
      left: sidebarRect.right + USER_MENU_GAP,
    });
  }, [isUserMenuOpen, effectiveCollapsed]);

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (userMenuRef.current?.contains(target)) return;
      if (userFooterButtonRef.current?.contains(target)) return;
      closeUserMenu();
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  });

  if (!user?.email) return null;

  const toggleUserMenu = () => {
    if (isUserMenuOpen) {
      closeUserMenu();
    } else {
      setIsUserMenuOpen(true);
    }
  };

  return (
    <div className={styles.userFooter}>
      <button
        type="button"
        ref={userFooterButtonRef}
        className={styles.userFooterButton}
        aria-haspopup="menu"
        aria-expanded={isUserMenuOpen}
        onClick={toggleUserMenu}
      >
        <span className={styles.avatar}>{getInitial(user.email)}</span>
        {!effectiveCollapsed && <span className={styles.userEmail}>{user.email}</span>}
      </button>

      {userFooterAction && !effectiveCollapsed && (
        <Button
          circle
          size="small"
          variant={Button.VARIANTS.GHOST}
          className={styles.userFooterActionBtn}
          color="transparent"
          onClick={(event) => {
            event.stopPropagation();
            userFooterAction.onClick && userFooterAction.onClick();
          }}
        >
          <ModalTooltip
            text={userFooterAction.tooltip}
            position={userFooterAction.tooltipPosition ?? 'top'}
            style={{ width: '100%', height: '100%', justifyContent: 'center' }}
          >
            <userFooterAction.icon size={16} />
          </ModalTooltip>
        </Button>
      )}

      {isUserMenuOpen && userMenuPosition && createPortal(
        <div
          ref={userMenuRef}
          role="menu"
          className={`${styles.userMenu} ${isClosing ? styles.userMenuClosing : ''}`}
          style={{ bottom: userMenuPosition.bottom, left: userMenuPosition.left, width: USER_MENU_WIDTH }}
        >
          <div className={styles.userMenuEmail}>{user.email}</div>
          {userMenuItems.map((menuItem) => {
            const Icon = menuItem.icon;
            return (
              <button
                key={menuItem.id ?? menuItem.label}
                type="button"
                role="menuitem"
                className={`${styles.userMenuItem} ${menuItem.variant === 'danger' ? styles.userMenuItemDanger : ''}`}
                onClick={() => {
                  closeUserMenu();
                  menuItem.onClick && menuItem.onClick();
                }}
              >
                {Icon && <Icon size={16} />}
                <span>{menuItem.label}</span>
              </button>
            );
          })}

          {userMenuLinks.length > 0 && (
            <div className={styles.userMenuLinks}>
              {userMenuLinks.map((link) => (
                <a
                  key={link.id ?? link.label}
                  href={link.link}
                  target={link.target ?? '_blank'}
                  rel="noopener noreferrer"
                  className={styles.userMenuLinkItem}
                  onClick={() => {
                    closeUserMenu();
                    link.onClick && link.onClick();
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

export default UserFooter;
