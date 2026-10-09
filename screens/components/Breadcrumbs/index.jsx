import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Home, MoreHorizontal } from 'lucide-react';
import MenuPopover from '../Material-UI/Components/MenuPopover/index';
import styles from './index.module.css';

/**
 * Generic breadcrumb trail. `items` is the full path in order — the last
 * entry is always rendered as the current page (plain bold text, not a
 * link), regardless of whether it has an `onClick`; every earlier entry
 * with an `onClick` renders as a clickable crumb.
 *
 * Each item may carry its own `icon` (a component, e.g. a lucide-react
 * icon); when omitted, the first item falls back to the default Home icon
 * (unchanged behavior). When `maxItems` is set and the trail is longer than
 * that, the middle crumbs collapse behind a "…" button that opens a menu
 * with the hidden entries.
 *
 * Crumbs animate in with a small staggered fade (via --crumb-index) so the
 * trail feels alive when it changes — e.g. drilling into a session — rather
 * than an instant text swap. Respects prefers-reduced-motion.
 *
 * `separator` is the character rendered between crumbs (e.g. '/', '-', '>');
 * defaults to '/'.
 */
export const Breadcrumbs = ({
  items = [],
  className = '',
  iconColor,
  linkColor,
  separator = '/',
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  menuBgColor = '#1b1f27',
  menuTextColor = '#e6e8ec',
}) => {
  if (!items.length) return null;

  const collapsed = maxItems != null && items.length > maxItems;
  const hiddenStart = itemsBeforeCollapse;
  const hiddenEnd = items.length - itemsAfterCollapse;
  const hiddenItems = collapsed ? items.slice(hiddenStart, hiddenEnd) : [];

  return (
    <nav
      aria-label="breadcrumb"
      className={`${styles.breadcrumbs} ${className}`}
      style={{
        ...(iconColor ? { '--crumb-icon-color': iconColor } : {}),
        ...(linkColor ? { '--crumb-link-color': linkColor } : {}),
      }}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          if (collapsed && index > hiddenStart && index < hiddenEnd) return null;

          if (collapsed && index === hiddenStart) {
            return (
              <li key="breadcrumbs-overflow" className={styles.item} style={{ '--crumb-index': index }}>
                <span className={styles.overflowTrigger}>
                  <MenuPopover
                    item={{ label: 'Más', icon: MoreHorizontal }}
                    isCollapsed
                    renderIcon={(Icon) => (Icon ? <Icon size={14} className={styles.crumbIcon} /> : null)}
                    triggerProps={{ circle: true, size: 'small' }}
                    bgColor={menuBgColor}
                    textColor={menuTextColor}
                  >
                    {({ handleClose }) =>
                      hiddenItems.map((hiddenItem, hiddenIndex) => {
                        const HiddenIcon = hiddenItem.icon;
                        return (
                          <MenuItem
                            key={hiddenItem.id ?? hiddenItem.label ?? hiddenIndex}
                            onClick={() => {
                              hiddenItem.onClick?.();
                              handleClose();
                            }}
                            sx={{ fontSize: '0.9rem', gap: '8px' }}
                          >
                            {HiddenIcon && <HiddenIcon size={14} />}
                            {hiddenItem.label}
                          </MenuItem>
                        );
                      })
                    }
                  </MenuPopover>
                </span>

                <span className={styles.separator} aria-hidden="true">{separator}</span>
              </li>
            );
          }

          const isLast = index === items.length - 1;
          const ItemIcon = item.icon ?? (index === 0 ? Home : null);

          return (
            <li
              key={item.id ?? item.label ?? index}
              className={styles.item}
              style={{ '--crumb-index': index }}
            >
              {ItemIcon && <ItemIcon size={14} className={styles.crumbIcon} aria-hidden="true" />}

              {!isLast && item.onClick ? (
                <button type="button" className={styles.link} onClick={item.onClick}>
                  <span className={styles.linkLabel}>{item.label}</span>
                </button>
              ) : (
                <span
                  className={`${styles.crumbText} ${isLast ? styles.current : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && <span className={styles.separator} aria-hidden="true">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
