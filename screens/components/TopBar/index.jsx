import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import Button from '../Button/index';
import Breadcrumbs from '../Breadcrumbs/index';
import ModalTooltip from '../ModalTooltip/ModalTooltip';
import UserAvatar from '../Profile/Avatar/index';
import Skeleton from '../Skeleton/index';
import styles from './index.module.css';
import {
    DEFAULT_SEARCH_PLACEHOLDER,
    DEFAULT_SEARCH_SHORTCUT,
    DEFAULT_USER_MENU_LABEL,
    DEFAULT_BREADCRUMB_LINK_COLOR,
    DEFAULT_BREADCRUMB_CURRENT_COLOR,
    DEFAULT_SKELETON_ACTIONS_COUNT,
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
    } = props;

    const isTopBarLoading = Boolean(loading || isLoading);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userMenuPosition, setUserMenuPosition] = useState(null);
    const userButtonRef = useRef(null);
    const userMenuRef = useRef(null);

    const themeVars = {
        ...(bgColor ? { '--topbar-bg': bgColor } : {}),
        ...(textColor ? { '--topbar-text': textColor } : {}),
        ...(borderColor ? { '--topbar-border': borderColor } : {}),
        ...(iconColor ? { '--topbar-icon': iconColor } : {}),
        ...(actionBgColor ? { '--topbar-action-bg': actionBgColor } : {}),
        ...(actionBorderColor ? { '--topbar-action-border': actionBorderColor } : {}),
        ...(accentColor ? { '--topbar-accent': accentColor } : {}),
        ...(searchBgColor ? { '--topbar-search-bg': searchBgColor } : {}),
        ...(dividerColor ? { '--topbar-divider': dividerColor } : {}),
        ...(badgeBgColor ? { '--topbar-badge-bg': badgeBgColor } : {}),
        ...(badgeTextColor ? { '--topbar-badge-text': badgeTextColor } : {}),
    };

    useLayoutEffect(() => {
        if (!isUserMenuOpen || !userButtonRef.current) return;
        const rect = userButtonRef.current.getBoundingClientRect();
        setUserMenuPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
        });
    }, [isUserMenuOpen]);

    React.useEffect(() => {
        if (!isUserMenuOpen) return undefined;
        const handlePointerDown = (event) => {
            if (userMenuRef.current?.contains(event.target)) return;
            if (userButtonRef.current?.contains(event.target)) return;
            setIsUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [isUserMenuOpen]);

    if (isTopBarLoading) {
        const actionsCount = skeletonActionsCount !== undefined
            ? skeletonActionsCount
            : ('actions' in props && Array.isArray(props.actions) ? props.actions.length : DEFAULT_SKELETON_ACTIONS_COUNT);
        const hasCenterSearch = centerContent ? false : searchProps !== false && searchProps !== null;
        const hasCenterContent = Boolean(centerContent);
        const hasUser = user !== null && user !== false && ('user' in props ? Boolean(props.user) : true);
        const hasLogo = logo !== null && logo !== false;

        return (
            <header className={`${styles.topbar} ${className}`} style={themeVars} aria-busy="true">
                <div className={styles.leftSection}>
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
                    {hasCenterSearch ? (
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
        <header className={`${styles.topbar} ${className}`} style={themeVars}>
            <div className={styles.leftSection}>
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
                {centerContent ? (
                    centerContent
                ) : searchProps ? (
                    <div className={styles.searchWrapper}>
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
                ) : null}
            </div>

            <div className={styles.rightSection}>
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    const hasBadge = action.badge !== undefined && action.badge !== null && action.badge !== false;
                    const isDotBadge = action.badge === true;
                    const button = (
                        <span key={action.key ?? index} className={styles.actionBtnWrapper}>
                            <Button
                                size="small"
                                variant={Button.VARIANTS.GHOST}
                                color="transparent"
                                className={styles.actionBtn}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                style={{ minWidth: 0, padding: '7px' }}
                            >
                                {Icon && <Icon size={18} />}
                            </Button>
                            {hasBadge && (
                                <span className={`${styles.actionBadge} ${isDotBadge ? styles.actionBadgeDot : styles.actionBadgeCount}`}>
                                    {!isDotBadge && action.badge}
                                </span>
                            )}
                        </span>
                    );

                    return action.tooltip ? (
                        <ModalTooltip key={action.key ?? index} text={action.tooltip} position="bottom">
                            {button}
                        </ModalTooltip>
                    ) : (
                        button
                    );
                })}

                {showDivider && actions.length > 0 && user && (
                    <span className={styles.actionsDivider} aria-hidden="true" />
                )}

                {user && (
                    <div className={styles.userSection}>
                        <button
                            type="button"
                            ref={userButtonRef}
                            className={styles.userButton}
                            onClick={() => setIsUserMenuOpen((prev) => !prev)}
                            aria-label={DEFAULT_USER_MENU_LABEL}
                        >
                            <UserAvatar src={user.avatarUrl} name={user.name || user.email} size={28} />
                        </button>

                        {isUserMenuOpen && userMenuPosition && createPortal(
                            <div
                                ref={userMenuRef}
                                className={styles.userMenu}
                                style={{ top: userMenuPosition.top, right: userMenuPosition.right }}
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
                                                setIsUserMenuOpen(false);
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
                )}
            </div>
        </header>
    );
}

export default TopBar;
