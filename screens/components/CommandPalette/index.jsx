import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Folder, X } from 'lucide-react';
import ScrollBar from '../ScrollBar/index';
import Loading from '../Loading/index';
import Skeleton from '../Skeleton/index';
import styles from './index.module.css';
import {
    DEFAULT_PLACEHOLDER,
    DEFAULT_EMPTY_MESSAGE,
    DEFAULT_SHORTCUT_LABEL,
    DEFAULT_MAX_HEIGHT,
    DEFAULT_CLOSE_LABEL,
    FOLDER_ICON_SIZE,
    CLEAR_ICON_SIZE,
    SEARCH_ICON_SIZE,
    DEFAULT_LOADING_TYPE,
    DEFAULT_LOADING_VARIANT,
    DEFAULT_SKELETON_COUNT,
} from './constants.js';

function matchesQuery(item, query) {
    if (!query) return true;
    const haystack = `${item.label || ''} ${item.description || ''} ${item.category || ''}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
}

function CommandPalette({
    open = false,
    onClose,
    items = [],
    placeholder = DEFAULT_PLACEHOLDER,
    emptyMessage = DEFAULT_EMPTY_MESSAGE,
    maxHeight = DEFAULT_MAX_HEIGHT,
    closeLabel = DEFAULT_CLOSE_LABEL,
    query: controlledQuery,
    onQueryChange,
    className = '',
    bgColor,
    textColor,
    borderColor,
    iconColor,
    accentColor,
    categoryColor,
    isLoading = false,
    loadingType = DEFAULT_LOADING_TYPE,
    loadingVariant = DEFAULT_LOADING_VARIANT,
    skeletonCount = DEFAULT_SKELETON_COUNT,
    clearQueryOnClose = false,
}) {
    const [internalQuery, setInternalQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const wasOpenRef = useRef(open);

    const query = controlledQuery !== undefined ? controlledQuery : internalQuery;
    const setQuery = (value) => {
        if (onQueryChange) onQueryChange(value);
        if (controlledQuery === undefined) setInternalQuery(value);
    };

    useEffect(() => {
        const wasOpen = wasOpenRef.current;
        wasOpenRef.current = open;
        if (wasOpen && !open && clearQueryOnClose) {
            setQuery('');
        }
    }, [open, clearQueryOnClose]);

    const filteredItems = useMemo(
        () => items.filter((item) => matchesQuery(item, query)),
        [items, query]
    );

    const groups = useMemo(() => {
        const map = new Map();
        filteredItems.forEach((item) => {
            const category = item.category || '';
            if (!map.has(category)) map.set(category, []);
            map.get(category).push(item);
        });
        return Array.from(map.entries()).map(([category, groupItems]) => ({ category, items: groupItems }));
    }, [filteredItems]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query, open]);

    useEffect(() => {
        if (!open) return undefined;
        const focusTimer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(focusTimer);
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose && onClose();
                return;
            }
            if (isLoading) return;
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
                return;
            }
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
                return;
            }
            if (event.key === 'Enter') {
                const item = filteredItems[activeIndex];
                if (item) {
                    event.preventDefault();
                    item.onSelect && item.onSelect(item);
                    onClose && onClose();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, filteredItems, activeIndex, onClose, isLoading]);

    if (!open) return null;

    const themeVars = {
        ...(bgColor ? { '--palette-bg': bgColor } : {}),
        ...(textColor ? { '--palette-text': textColor } : {}),
        ...(borderColor ? { '--palette-border': borderColor } : {}),
        ...(iconColor ? { '--palette-icon': iconColor } : {}),
        ...(accentColor ? { '--palette-accent': accentColor } : {}),
        ...(categoryColor ? { '--palette-category': categoryColor } : {}),
    };

    let flatIndex = -1;

    return createPortal(
        <div className={styles.overlay} onMouseDown={onClose}>
            <div
                className={`${styles.palette} ${className}`}
                style={themeVars}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className={styles.searchRow}>
                    <Search size={SEARCH_ICON_SIZE} className={styles.searchIcon} />
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.input}
                        placeholder={placeholder}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    {query && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={() => setQuery('')}
                            aria-label="Limpiar búsqueda"
                        >
                            <X size={CLEAR_ICON_SIZE} />
                        </button>
                    )}
                    <kbd className={styles.shortcutHint}>{DEFAULT_SHORTCUT_LABEL}</kbd>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label={closeLabel}
                    >
                        <X size={CLEAR_ICON_SIZE} />
                    </button>
                </div>

                <ScrollBar maxHeight={maxHeight} contentClassName={styles.resultsScroll}>
                    <div className={styles.results}>
                        {isLoading ? (
                            loadingType === 'skeleton' ? (
                                <div className={styles.skeletonGroup}>
                                    {Array.from({ length: skeletonCount }).map((_, index) => (
                                        <div key={index} className={styles.skeletonRow}>
                                            <Skeleton width="18px" height="18px" radius="4px" />
                                            <Skeleton width={`${Math.max(40, 70 - index * 6)}%`} height="14px" radius="4px" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.loadingWrapper}>
                                    <Loading size="medium" variant={loadingVariant} />
                                </div>
                            )
                        ) : filteredItems.length === 0 ? (
                            <p className={styles.emptyMessage}>{emptyMessage}</p>
                        ) : (
                            groups.map((group) => (
                                <div key={group.category || 'default'} className={styles.group}>
                                    {group.category && (
                                        <div className={styles.groupLabel}>{group.category}</div>
                                    )}
                                    {group.items.map((item) => {
                                        flatIndex += 1;
                                        const isActive = flatIndex === activeIndex;
                                        const Icon = item.icon || Folder;
                                        return (
                                            <button
                                                key={item.id ?? `${group.category}-${item.label}`}
                                                type="button"
                                                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                                                onMouseEnter={() => setActiveIndex(flatIndex)}
                                                onClick={() => {
                                                    item.onSelect && item.onSelect(item);
                                                    onClose && onClose();
                                                }}
                                            >
                                                <Icon size={FOLDER_ICON_SIZE} className={styles.itemIcon} />
                                                <span className={styles.itemLabel}>{item.label}</span>
                                                {item.description && (
                                                    <span className={styles.itemDescription}>{item.description}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollBar>
            </div>
        </div>,
        document.body
    );
}

export default CommandPalette;
