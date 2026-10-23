import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../../Button/index';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import styles from './index.module.css';
import { getInitial } from '../../utils.js';

function UserFooter({
  user,
  userMenuItems = [],
  userMenuLinks = [],
  userFooterAction,
  effectiveCollapsed,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState(null);
  const userFooterButtonRef = useRef(null);
  const userMenuRef = useRef(null);

  useLayoutEffect(() => {
    if (!isUserMenuOpen || !userFooterButtonRef.current) return;
    const rect = userFooterButtonRef.current.getBoundingClientRect();
    setUserMenuPosition({
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
      width: effectiveCollapsed ? 220 : rect.width,
    });
  }, [isUserMenuOpen, effectiveCollapsed]);

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (userMenuRef.current?.contains(target)) return;
      if (userFooterButtonRef.current?.contains(target)) return;
      setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isUserMenuOpen]);

  if (!user?.email) return null;

  return (
    <div className={styles.userFooter}>
      <button
        type="button"
        ref={userFooterButtonRef}
        className={styles.userFooterButton}
        onClick={() => setIsUserMenuOpen((prev) => !prev)}
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
          className={styles.userMenu}
          style={{ bottom: userMenuPosition.bottom, left: userMenuPosition.left, width: userMenuPosition.width }}
        >
          <div className={styles.userMenuEmail}>{user.email}</div>
          {userMenuItems.map((menuItem) => {
            const Icon = menuItem.icon;
            return (
              <button
                key={menuItem.id ?? menuItem.label}
                type="button"
                className={`${styles.userMenuItem} ${menuItem.variant === 'danger' ? styles.userMenuItemDanger : ''}`}
                onClick={() => {
                  setIsUserMenuOpen(false);
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
                    setIsUserMenuOpen(false);
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
