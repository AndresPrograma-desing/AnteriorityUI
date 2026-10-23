import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '../Button/index';
import KeyboardShortcut from '../KeyboardShortcut/index';
import { SidebarItem, SidebarSkeleton, FilterPopover, UserFooter, ItemContextMenu } from './components/index.js';
import styles from './index.module.css';
import { TEXTS, DEFAULT_METHOD_BADGE_COLORS } from './constants';
import { findParentIdForActiveItem, toggleSidebarCollapsed } from './utils';
import ModalTooltip from '../ModalTooltip/ModalTooltip';

export const ProSidebar = ({
  groups,
  activeId,
  onSelect,
  collapsible = true,
  loading = false,
  skeletonItems = 12,
  className = '',
  headerContent,
  footerContent,
  user,
  userMenuItems = [],
  userMenuLinks = [],
  userFooterAction,
  onItemEdit,
  onItemDelete,
  onItemPin,
  onItemCollaborators,
  onReorderItems,
  avatarBgColor,
  pinnedIconColor,
  methodBadgeColors,
  subItemActiveBgColor,
  subItemActiveTextColor,
  isMobileOpen = false,
  onCloseMobile,
  style,
  enableFilter = false,
  currentFilter,
  onFilterChange,
  filterIcon,
  filterBtnActiveBg,
  filterBtnActiveColor,
  filterPopoverBg,
  filterPopoverTextColor,
  filterPopoverTitleColor,
  filterPopoverBorderColor,
  filterPopoverHoverBg,
  filterPopoverActiveBg,
  filterPopoverActiveTextColor,
  filterPopoverCheckColor,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved !== null ? saved === 'true' : false;
  });

  const effectiveCollapsed = isCollapsed && !isMobileOpen;
  const [expandedIds, setExpandedIds] = useState(() => {
    const parentId = findParentIdForActiveItem(groups, activeId);
    return parentId ? new Set([parentId]) : new Set();
  });

  const [contextMenu, setContextMenu] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverItemId, setDragOverItemId] = useState(null);
  const contextMenuRef = useRef(null);

  const canShowItemContextMenu = Boolean(onItemEdit || onItemDelete || onItemPin);
  const canReorder = Boolean(onReorderItems);

  const badgeThemeVars = Object.keys(DEFAULT_METHOD_BADGE_COLORS).reduce((acc, key) => {
    const override = methodBadgeColors && methodBadgeColors[key];
    if (override?.bg) acc[`--sidebar-badge-${key}-bg`] = override.bg;
    if (override?.color) acc[`--sidebar-badge-${key}-color`] = override.color;
    return acc;
  }, {});

  const themeVars = {
    ...(avatarBgColor ? { '--sidebar-avatar-bg': avatarBgColor } : {}),
    ...(pinnedIconColor ? { '--sidebar-pinned-icon': pinnedIconColor } : {}),
    ...(subItemActiveBgColor ? { '--sidebar-subitem-active-bg': subItemActiveBgColor } : {}),
    ...(subItemActiveTextColor ? { '--sidebar-subitem-active-text': subItemActiveTextColor } : {}),
    ...(filterBtnActiveBg ? { '--sidebar-filter-btn-active-bg': filterBtnActiveBg } : {}),
    ...(filterBtnActiveColor ? { '--sidebar-filter-btn-active-color': filterBtnActiveColor } : {}),
    ...badgeThemeVars,
    ...style,
  };

  // Variables CSS específicas para inyectar directo al Popover en el Portal
  const popoverThemeVars = {
    ...(filterPopoverBg ? { '--popover-bg': filterPopoverBg } : {}),
    ...(filterPopoverTextColor ? { '--popover-text': filterPopoverTextColor } : {}),
    ...(filterPopoverTitleColor ? { '--popover-title': filterPopoverTitleColor } : {}),
    ...(filterPopoverBorderColor ? { '--popover-border': filterPopoverBorderColor } : {}),
    ...(filterPopoverHoverBg ? { '--popover-hover-bg': filterPopoverHoverBg } : {}),
    ...(filterPopoverActiveBg ? { '--popover-active-bg': filterPopoverActiveBg } : {}),
    ...(filterPopoverActiveTextColor ? { '--popover-active-text': filterPopoverActiveTextColor } : {}),
    ...(filterPopoverCheckColor ? { '--popover-check-color': filterPopoverCheckColor } : {}),
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggedItemId(item.id);
  };

  const handleDragOver = (event, item) => {
    event.preventDefault();
    if (item.id !== draggedItemId) setDragOverItemId(item.id);
  };

  const handleDragLeave = (item) => {
    setDragOverItemId((prev) => (prev === item.id ? null : prev));
  };

  const makeHandleDrop = (groupItems) => (event, targetItem) => {
    event.preventDefault();
    setDragOverItemId(null);
    if (!draggedItemId || draggedItemId === targetItem.id) return;

    const fromIndex = groupItems.findIndex((it) => it.id === draggedItemId);
    const toIndex = groupItems.findIndex((it) => it.id === targetItem.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = groupItems.map((it) => it.id);
    const [movedId] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedId);

    onReorderItems && onReorderItems(reordered);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const toggleExpanded = (itemId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  useEffect(() => {
    if (!contextMenu) return undefined;
    const handlePointerDown = (event) => {
      if (contextMenuRef.current?.contains(event.target)) return;
      setContextMenu(null);
    };
    const closeMenu = () => setContextMenu(null);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('contextmenu', handlePointerDown);
    document.addEventListener('scroll', closeMenu, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('contextmenu', handlePointerDown);
      document.removeEventListener('scroll', closeMenu, true);
    };
  }, [contextMenu]);

  const handleItemContextMenu = (event, item) => {
    if (!canShowItemContextMenu) return;
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({ x: event.clientX, y: event.clientY, item });
  };

  useEffect(() => {
    if (!isMobileOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseMobile && onCloseMobile();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const handleSelect = (item) => {
    onSelect && onSelect(item);
    onCloseMobile && onCloseMobile();
  };

  return (
    <KeyboardShortcut
      shortcut="ctrl+b"
      enabled={collapsible}
      onTrigger={() => setIsCollapsed(toggleSidebarCollapsed)}
    >
      {isMobileOpen && (
        <div className={styles.mobileBackdrop} onClick={onCloseMobile} />
      )}

      <div className={`${styles.sidebarWrapper} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <aside
          className={`${styles.sidebar} ${effectiveCollapsed ? styles.collapsed : ''} ${className}`}
          style={themeVars}
        >
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={onCloseMobile}
            aria-label={TEXTS.closeMobileMenu}
          >
            <X size={16} />
          </button>

          {(headerContent || collapsible || enableFilter) && (
            <div className={styles.sidebarHeader}>
              {!effectiveCollapsed && headerContent && (
                <div className={styles.headerContent}>{headerContent}</div>
              )}

              <div className={styles.headerActions}>
                {enableFilter && (
                  <FilterPopover
                    currentFilter={currentFilter}
                    onFilterChange={onFilterChange}
                    filterIcon={filterIcon}
                    effectiveCollapsed={effectiveCollapsed}
                    popoverThemeVars={popoverThemeVars}
                  />
                )}

                {collapsible && (
                  <Button
                    circle
                    size="small"
                    variant={Button.VARIANTS.GHOST}
                    className={styles.toggleBtn}
                    onClick={() => setIsCollapsed(toggleSidebarCollapsed)}
                    color="transparent"
                  >
                    <ModalTooltip
                      key={effectiveCollapsed}
                      text={effectiveCollapsed ? TEXTS.openMenu : TEXTS.closeMenu}
                      position="bottom"
                    >
                      {effectiveCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </ModalTooltip>
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className={styles.navContainer}>
            {loading ? (
              <SidebarSkeleton skeletonItems={skeletonItems} effectiveCollapsed={effectiveCollapsed} />
            ) : groups && groups.map((group, gIdx) => (
              <div key={gIdx} className={styles.menuGroup}>
                {group.title && !effectiveCollapsed && (
                  <span className={styles.groupTitle}>{group.title}</span>
                )}

                <div className={styles.buttonList}>
                  {group.items && group.items.map((item) => {
                    const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
                    const isDragging = draggedItemId === item.id;
                    const isDragOver = canReorder && dragOverItemId === item.id && !isDragging;
                    const isExpanded = hasSubItems && expandedIds.has(item.id) && !effectiveCollapsed;

                    return (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        activeId={activeId}
                        effectiveCollapsed={effectiveCollapsed}
                        canReorder={canReorder}
                        isExpanded={isExpanded}
                        isDragging={isDragging}
                        isDragOver={isDragOver}
                        onToggleExpanded={toggleExpanded}
                        onSelect={handleSelect}
                        onContextMenu={handleItemContextMenu}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={makeHandleDrop(group.items)}
                        onDragEnd={handleDragEnd}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {(footerContent || user?.email) && (
            <div className={styles.footerGroup}>
              {footerContent && !effectiveCollapsed && (
                <div className={styles.footerContent}>{footerContent}</div>
              )}

              <UserFooter
                user={user}
                userMenuItems={userMenuItems}
                userMenuLinks={userMenuLinks}
                userFooterAction={userFooterAction}
                effectiveCollapsed={effectiveCollapsed}
              />
            </div>
          )}

          <ItemContextMenu
            contextMenu={contextMenu}
            contextMenuRef={contextMenuRef}
            onClose={() => setContextMenu(null)}
            onItemEdit={onItemEdit}
            onItemDelete={onItemDelete}
            onItemPin={onItemPin}
            onItemCollaborators={onItemCollaborators}
          />
        </aside>
      </div>
    </KeyboardShortcut>
  );
};

export default ProSidebar;
