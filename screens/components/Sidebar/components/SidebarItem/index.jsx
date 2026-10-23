import React from 'react';
import { ChevronDown, GripVertical, Pin } from 'lucide-react';
import Button from '../../../Button/index';
import styles from './index.module.css';
import { getBadgeClass } from '../../utils.js';

function renderLeftContent(item, styles) {
  const Icon = item.icon;
  if (Icon) {
    if (typeof Icon === 'function' || typeof Icon === 'object') {
      return <span className={styles.icon}><Icon size={18} /></span>;
    }
    return <span className={styles.icon}>{Icon}</span>;
  }
  return null;
}

function SidebarItem({
  item,
  activeId,
  effectiveCollapsed,
  canReorder,
  isExpanded,
  isDragging,
  isDragOver,
  onToggleExpanded,
  onSelect,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}) {
  const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
  const isActive = !hasSubItems && activeId === item.id;

  return (
    <div className={styles.itemWithSubItems}>
      <Button
        fullWidth
        color="transparent"
        active={isActive}
        draggable={canReorder}
        onDragStart={canReorder ? (event) => onDragStart(event, item) : undefined}
        onDragOver={canReorder ? (event) => onDragOver(event, item) : undefined}
        onDragLeave={canReorder ? () => onDragLeave(item) : undefined}
        onDrop={canReorder ? (event) => onDrop(event, item) : undefined}
        onDragEnd={canReorder ? onDragEnd : undefined}
        onClick={() => (hasSubItems ? onToggleExpanded(item.id) : onSelect(item))}
        onContextMenu={(event) => onContextMenu(event, item)}
        className={`${styles.sidebarItemBtn} ${isActive ? styles.activeBtn : ''} ${isDragging ? styles.dragging : ''} ${isDragOver ? styles.dragOver : ''}`}
        ToolTip={effectiveCollapsed ? item.label : undefined}
      >
        <div className={styles.btnLayout}>
          <div className={styles.leftPart}>
            {canReorder && !effectiveCollapsed && (
              <span className={styles.dragHandle}><GripVertical size={14} /></span>
            )}
            {renderLeftContent(item, styles)}
            {!effectiveCollapsed && <span className={styles.label}>{item.label}</span>}
            {!effectiveCollapsed && item.pinned && (
              <Pin size={12} className={styles.pinnedIcon} />
            )}
          </div>

          {!effectiveCollapsed && item.badge && (
            <span className={`${styles.badge} ${getBadgeClass(styles, item.badgeType)}`}>
              {item.badge}
            </span>
          )}

          {!effectiveCollapsed && hasSubItems && (
            <ChevronDown size={14} className={`${styles.expandChevron} ${isExpanded ? styles.expandChevronOpen : ''}`} />
          )}
        </div>
      </Button>

      {hasSubItems && !effectiveCollapsed && (
        <div className={`${styles.subItemListWrapper} ${isExpanded ? styles.subItemListWrapperOpen : ''}`}>
          <div className={styles.subItemList}>
            {item.subItems.map((subItem) => {
              const isSubActive = activeId === subItem.id;
              return (
                <Button
                  key={subItem.id}
                  fullWidth
                  color="transparent"
                  active={isSubActive}
                  onClick={() => onSelect(subItem)}
                  className={`${styles.sidebarItemBtn} ${styles.subItemBtn} ${isSubActive ? styles.activeBtn : ''}`}
                >
                  <div className={styles.btnLayout}>
                    <div className={styles.leftPart}>
                      {renderLeftContent(subItem, styles)}
                      <span className={styles.label}>{subItem.label}</span>
                    </div>

                    {subItem.badge && (
                      <span className={`${styles.badge} ${getBadgeClass(styles, subItem.badgeType)}`}>
                        {subItem.badge}
                      </span>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarItem;
