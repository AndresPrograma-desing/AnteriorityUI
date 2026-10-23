import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpDown, Check } from 'lucide-react';
import Button from '../../../Button/index';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import styles from './index.module.css';
import { TEXTS } from '../../constants.js';

const FILTER_OPTIONS = [
  { key: 'date', label: TEXTS.filterByDate },
  { key: 'name', label: TEXTS.filterByName },
  { key: 'recent', label: TEXTS.filterByRecent },
];

function FilterPopover({
  currentFilter,
  onFilterChange,
  filterIcon,
  effectiveCollapsed,
  popoverThemeVars,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const hasActiveFilter = Boolean(currentFilter);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: effectiveCollapsed ? rect.left : rect.left - 120,
    });
  }, [isOpen, effectiveCollapsed]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      const target = event.target;
      if (menuRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleSelectFilter = (filterKey) => {
    if (onFilterChange) {
      const nextFilter = currentFilter === filterKey ? null : filterKey;
      onFilterChange(nextFilter);
    }
    setIsOpen(false);
  };

  const renderFilterIcon = () => {
    if (filterIcon) {
      const IconComponent = filterIcon;
      if (typeof IconComponent === 'function' || typeof IconComponent === 'object') {
        return <IconComponent size={15} />;
      }
      return filterIcon;
    }
    return <ArrowUpDown size={15} />;
  };

  return (
    <>
      <div ref={buttonRef} className={styles.filterBtnWrapper}>
        <Button
          circle
          size="small"
          variant={Button.VARIANTS.GHOST}
          className={`${styles.filterBtn} ${isOpen || hasActiveFilter ? styles.filterBtnActive : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          color="transparent"
        >
          <ModalTooltip text={TEXTS.filterTooltip} position="bottom">
            {renderFilterIcon()}
          </ModalTooltip>
        </Button>
      </div>

      {isVisible && position && createPortal(
        <div
          ref={menuRef}
          className={`${styles.filterMenu} ${isOpen ? styles.filterMenuOpen : styles.filterMenuClosing}`}
          style={{
            top: position.top,
            left: position.left,
            ...popoverThemeVars,
          }}
        >
          <div className={styles.filterMenuTitle}>{TEXTS.filterTooltip}</div>
          {FILTER_OPTIONS.map((opt) => {
            const isSelected = currentFilter === opt.key;
            return (
              <Button
                key={opt.key}
                fullWidth
                color="transparent"
                active={isSelected}
                onClick={() => handleSelectFilter(opt.key)}
                className={`${styles.filterMenuItem} ${isSelected ? styles.filterMenuItemActive : ''}`}
              >
                <div className={styles.filterMenuItemLayout}>
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} className={styles.filterCheckIcon} />}
                </div>
              </Button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

export default FilterPopover;
