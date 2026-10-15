import React, { useCallback, useState } from 'react';
import { Menu, Search, MoreHorizontal, X } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs/index';
import Skeleton from '../Skeleton/index';
import CommandPalette from '../CommandPalette/index';
import Button from '../Button/index';
import KeyboardShortcut from '../KeyboardShortcut/index';
import SearchBar from './components/SearchBar/index';
import TopBarActions from './components/TopBarActions/index';
import UserMenu from './components/UserMenu/index';
import NavLinks from './components/NavLinks/index';
import MobileActionsPanel from './components/MobileActionsPanel/index';
import styles from './index.module.css';
import { buildThemeVars, hasActionHoverEnabled, hasCenterSearch } from './utils.js';
import {
    DEFAULT_BREADCRUMB_LINK_COLOR,
    DEFAULT_BREADCRUMB_CURRENT_COLOR,
    DEFAULT_SKELETON_ACTIONS_COUNT,
    DEFAULT_COMMAND_PALETTE_PLACEHOLDER,
    DEFAULT_MOBILE_MENU_LABEL,
    DEFAULT_MOBILE_ACTIONS_LABEL,
    DEFAULT_MOBILE_SEARCH_LABEL,
    DEFAULT_MOBILE_SEARCH_CLOSE_LABEL,
    DEFAULT_SEARCH_PLACEHOLDER,
} from './constants.js';

function TopBar(props) {
    const {
        logo,
        onLogoClick,
        breadcrumbItems,
        title,
        searchProps,
        centerContent,
        actions = [],
        user,
        userMenuItems = [],
        className = '',
        bgColor,
        textColor,
        borderColor,
        iconColor,
        accentColor,
        searchBgColor,
        actionBgColor,
        actionBorderColor,
        dividerColor,
        showDivider = true,
        badgeBgColor,
        badgeTextColor,
        breadcrumbLinkColor = DEFAULT_BREADCRUMB_LINK_COLOR,
        breadcrumbCurrentColor = DEFAULT_BREADCRUMB_CURRENT_COLOR,
        loading = false,
        isLoading = false,
        skeletonActionsCount,
        actionHover = true,
        showActionHover = true,
        disableActionHover = false,
        actionHoverBgColor,
        actionHoverTextColor,
        actionHoverBorderColor,
        actionRippleColor,
        commandItems,
        commandPaletteShortcut = true,
        commandPalettePlaceholder = DEFAULT_COMMAND_PALETTE_PLACEHOLDER,
        onCommandPaletteOpen,
        onCommandPaletteClose,
        paletteBgColor,
        paletteTextColor,
        paletteBorderColor,
        paletteIconColor,
        paletteAccentColor,
        paletteCategoryColor,
        commandPaletteLoading = false,
        commandPaletteLoadingType,
        commandPaletteLoadingVariant,
        commandPaletteSkeletonCount,
        commandPaletteClearQueryOnClose = false,
        navLinks,
        navLinkColor,
        navLinkActiveColor,
        ctaButton,
        onMenuClick,
        mobileMenuLabel = DEFAULT_MOBILE_MENU_LABEL,
    } = props;

    const isTopBarLoading = Boolean(loading || isLoading);
    const hasGlobalHover = hasActionHoverEnabled({ actionHover, showActionHover, disableActionHover });
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const openCommandPalette = useCallback(() => {
        setIsCommandPaletteOpen(true);
        onCommandPaletteOpen && onCommandPaletteOpen();
    }, [onCommandPaletteOpen]);

    const closeCommandPalette = useCallback(() => {
        setIsCommandPaletteOpen(false);
        onCommandPaletteClose && onCommandPaletteClose();
    }, [onCommandPaletteClose]);

    const toggleCommandPalette = useCallback(() => {
        setIsCommandPaletteOpen((prev) => {
            const next = !prev;
            if (next) onCommandPaletteOpen && onCommandPaletteOpen();
            else onCommandPaletteClose && onCommandPaletteClose();
            return next;
        });
    }, [onCommandPaletteOpen, onCommandPaletteClose]);

    const hasMobileSearch = hasCenterSearch({ centerContent, searchProps, commandItems }) && !(navLinks && navLinks.length > 0);
    const hasPendingActionBadge = actions.some((action) => action.badge !== undefined && action.badge !== null && action.badge !== false);

    const handleMobileSearchClick = () => {
        if (commandItems !== undefined) {
            openCommandPalette();
        } else {
            setIsMobileSearchOpen(true);
        }
    };

    const themeVars = buildThemeVars({
        bgColor,
        textColor,
        borderColor,
        iconColor,
        actionBgColor,
        actionBorderColor,
        actionHoverBgColor,
        actionHoverTextColor,
        actionHoverBorderColor,
        actionRippleColor,
        accentColor,
        searchBgColor,
        dividerColor,
        badgeBgColor,
        badgeTextColor,
    });

    if (isTopBarLoading) {
        const actionsCount = skeletonActionsCount !== undefined
            ? skeletonActionsCount
            : ('actions' in props && Array.isArray(props.actions) ? props.actions.length : DEFAULT_SKELETON_ACTIONS_COUNT);
        const showCenterSearchSkeleton = hasCenterSearch({ centerContent, searchProps, commandItems });
        const hasCenterContent = Boolean(centerContent);
        const hasUser = user !== null && user !== false && ('user' in props ? Boolean(props.user) : true);
        const hasLogo = logo !== null && logo !== false;

        return (
            <header className={`${styles.topbar} ${className}`} style={themeVars} aria-busy="true">
                <div className={styles.leftSection}>
                    {onMenuClick && (
                        <button type="button" className={styles.mobileMenuButton} disabled aria-hidden="true">
                            <Menu size={20} />
                        </button>
                    )}

                    {hasLogo && (
                        <Skeleton width="32px" height="32px" radius="8px" />
                    )}

                    {breadcrumbItems && breadcrumbItems.length > 0 ? (
                        <div className={styles.skeletonBreadcrumbs}>
                            {breadcrumbItems.map((_, idx) => (
                                <React.Fragment key={idx}>
                                    {idx > 0 && <span className={styles.skeletonBreadcrumbSeparator}>/</span>}
                                    <Skeleton
                                        width={`${Math.max(48, Math.min(100, 52 + idx * 24))}px`}
                                        height="14px"
                                        radius="4px"
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    ) : title ? (
                        <Skeleton width="130px" height="18px" radius="4px" />
                    ) : (
                        <div className={styles.skeletonBreadcrumbs}>
                            <Skeleton width="60px" height="14px" radius="4px" />
                            <span className={styles.skeletonBreadcrumbSeparator}>/</span>
                            <Skeleton width="90px" height="14px" radius="4px" />
                        </div>
                    )}
                </div>

                <div className={styles.centerSection}>
                    {showCenterSearchSkeleton ? (
                        <div className={styles.searchWrapper}>
                            <Skeleton width="100%" height="36px" radius="8px" />
                        </div>
                    ) : hasCenterContent ? (
                        <Skeleton width="240px" height="36px" radius="8px" />
                    ) : null}
                </div>

                <div className={styles.rightSection}>
                    {actionsCount > 0 && Array.from({ length: actionsCount }).map((_, idx) => (
                        <span key={`skeleton-action-${idx}`} className={styles.actionBtnWrapper}>
                            <Skeleton width="34px" height="34px" radius="6px" />
                        </span>
                    ))}

                    {showDivider && actionsCount > 0 && hasUser && (
                        <span className={styles.actionsDivider} aria-hidden="true" />
                    )}

                    {hasUser && (
                        <Skeleton circle width="32px" height="32px" />
                    )}
                </div>
            </header>
        );
    }

    return (
        <KeyboardShortcut
            shortcut="ctrl+k"
            enabled={commandItems !== undefined && commandPaletteShortcut !== false}
            onTrigger={toggleCommandPalette}
        >
        <header className={`${styles.topbar} ${className}`} style={themeVars}>
            <div className={styles.leftSection}>
                {onMenuClick && (
                    <button
                        type="button"
                        className={styles.mobileMenuButton}
                        onClick={onMenuClick}
                        aria-label={mobileMenuLabel}
                    >
                        <Menu size={20} />
                    </button>
                )}

                {logo && (
                    <button
                        type="button"
                        className={styles.logoButton}
                        onClick={onLogoClick}
                        disabled={!onLogoClick}
                    >
                        {logo}
                    </button>
                )}

                {breadcrumbItems && breadcrumbItems.length > 0 ? (
                    <Breadcrumbs
                        items={breadcrumbItems}
                        className={styles.breadcrumbs}
                        linkColor={breadcrumbLinkColor}
                        currentColor={textColor || breadcrumbCurrentColor}
                    />
                ) : (
                    title && <span className={styles.title}>{title}</span>
                )}
            </div>

            <div className={styles.centerSection}>
                {navLinks && navLinks.length > 0 ? (
                    <NavLinks
                        navLinks={navLinks}
                        navLinkColor={navLinkColor}
                        navLinkActiveColor={navLinkActiveColor}
                    />
                ) : (
                    <SearchBar
                        centerContent={centerContent}
                        searchProps={searchProps}
                        commandItems={commandItems}
                        commandPaletteShortcut={commandPaletteShortcut}
                        commandPalettePlaceholder={commandPalettePlaceholder}
                        onOpenCommandPalette={openCommandPalette}
                    />
                )}
            </div>

            <div className={styles.rightSection}>
                {hasMobileSearch && (
                    <button
                        type="button"
                        className={styles.mobileSearchButton}
                        onClick={handleMobileSearchClick}
                        aria-label={DEFAULT_MOBILE_SEARCH_LABEL}
                    >
                        <Search size={18} />
                    </button>
                )}

                {actions.length > 0 && (
                    <span className={styles.mobileActionsButtonWrapper}>
                        <button
                            type="button"
                            className={styles.mobileActionsButton}
                            onClick={() => setIsMobileActionsOpen(true)}
                            aria-label={DEFAULT_MOBILE_ACTIONS_LABEL}
                        >
                            <MoreHorizontal size={18} />
                        </button>
                        {hasPendingActionBadge && (
                            <span className={`${styles.actionBadge} ${styles.actionBadgeDot}`} />
                        )}
                    </span>
                )}

                <TopBarActions actions={actions} hasGlobalHover={hasGlobalHover} />

                {showDivider && actions.length > 0 && user && (
                    <span className={styles.actionsDivider} aria-hidden="true" />
                )}

                <UserMenu user={user} userMenuItems={userMenuItems} />

                {ctaButton && (
                    <Button
                        size={ctaButton.size || 'small'}
                        variant={ctaButton.variant || Button.VARIANTS.PRIMARY}
                        color={ctaButton.color}
                        onClick={ctaButton.onClick}
                        className={styles.ctaButton}
                        style={ctaButton.style}
                    >
                        {ctaButton.label}
                    </Button>
                )}
            </div>

            {commandItems !== undefined && (
                <CommandPalette
                    open={isCommandPaletteOpen}
                    onClose={closeCommandPalette}
                    items={commandItems}
                    bgColor={paletteBgColor}
                    textColor={paletteTextColor}
                    borderColor={paletteBorderColor}
                    iconColor={paletteIconColor}
                    accentColor={paletteAccentColor}
                    categoryColor={paletteCategoryColor}
                    isLoading={commandPaletteLoading}
                    loadingType={commandPaletteLoadingType}
                    loadingVariant={commandPaletteLoadingVariant}
                    skeletonCount={commandPaletteSkeletonCount}
                    clearQueryOnClose={commandPaletteClearQueryOnClose}
                />
            )}

            {actions.length > 0 && (
                <MobileActionsPanel
                    open={isMobileActionsOpen}
                    onClose={() => setIsMobileActionsOpen(false)}
                    actions={actions}
                />
            )}

            {isMobileSearchOpen && searchProps && (
                <div className={styles.mobileSearchOverlay}>
                    <input
                        type="text"
                        autoFocus
                        className={styles.mobileSearchOverlayInput}
                        placeholder={searchProps.placeholder ?? DEFAULT_SEARCH_PLACEHOLDER}
                        value={searchProps.value}
                        onChange={searchProps.onChange}
                        onFocus={searchProps.onFocus}
                        onBlur={searchProps.onBlur}
                    />
                    <button
                        type="button"
                        className={styles.mobileSearchOverlayClose}
                        onClick={() => setIsMobileSearchOpen(false)}
                        aria-label={DEFAULT_MOBILE_SEARCH_CLOSE_LABEL}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
        </header>
        </KeyboardShortcut>
    );
}

export default TopBar;
