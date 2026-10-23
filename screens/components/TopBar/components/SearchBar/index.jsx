import React from 'react';
import { Search } from 'lucide-react';
import topbarStyles from '../../index.module.css';
import styles from './index.module.css';
import { DEFAULT_SEARCH_PLACEHOLDER, DEFAULT_SEARCH_SHORTCUT } from '../../constants.js';

function SearchBar({ centerContent, searchProps, commandItems, commandPaletteShortcut, commandPalettePlaceholder, onOpenCommandPalette }) {
    if (centerContent) return centerContent;

    if (searchProps) {
        return (
            <div className={topbarStyles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={searchProps.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER}
                    value={searchProps.value}
                    onChange={searchProps.onChange}
                    onFocus={searchProps.onFocus}
                    onBlur={searchProps.onBlur}
                />
                {searchProps.shortcut !== false && (
                    <kbd className={styles.searchShortcut}>
                        {searchProps.shortcut ?? DEFAULT_SEARCH_SHORTCUT}
                    </kbd>
                )}
            </div>
        );
    }

    if (commandItems !== undefined) {
        return (
            <button type="button" className={topbarStyles.searchWrapper} onClick={onOpenCommandPalette}>
                <Search size={16} className={styles.searchIcon} />
                <span className={styles.searchInput} style={{ display: 'flex', alignItems: 'center' }}>
                    {commandPalettePlaceholder}
                </span>
                {commandPaletteShortcut !== false && (
                    <kbd className={styles.searchShortcut}>Ctrl K</kbd>
                )}
            </button>
        );
    }

    return null;
}

export default SearchBar;
