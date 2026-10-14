export function buildThemeVars({
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
}) {
    return {
        ...(bgColor ? { '--topbar-bg': bgColor } : {}),
        ...(textColor ? { '--topbar-text': textColor } : {}),
        ...(borderColor ? { '--topbar-border': borderColor } : {}),
        ...(iconColor ? { '--topbar-icon': iconColor } : {}),
        ...(actionBgColor ? { '--topbar-action-bg': actionBgColor } : {}),
        ...(actionBorderColor ? { '--topbar-action-border': actionBorderColor } : {}),
        ...(actionHoverBgColor ? { '--topbar-action-hover-bg': actionHoverBgColor } : {}),
        ...(actionHoverTextColor ? { '--topbar-action-hover-text': actionHoverTextColor } : {}),
        ...(actionHoverBorderColor ? { '--topbar-action-hover-border': actionHoverBorderColor } : {}),
        ...(actionRippleColor ? { '--topbar-action-ripple': actionRippleColor } : {}),
        ...(accentColor ? { '--topbar-accent': accentColor } : {}),
        ...(searchBgColor ? { '--topbar-search-bg': searchBgColor } : {}),
        ...(dividerColor ? { '--topbar-divider': dividerColor } : {}),
        ...(badgeBgColor ? { '--topbar-badge-bg': badgeBgColor } : {}),
        ...(badgeTextColor ? { '--topbar-badge-text': badgeTextColor } : {}),
    };
}

export function hasActionHoverEnabled({ actionHover, showActionHover, disableActionHover }) {
    return actionHover !== false && showActionHover !== false && !disableActionHover;
}

export function hasCenterSearch({ centerContent, searchProps, commandItems }) {
    if (centerContent) return false;
    return (searchProps !== false && searchProps !== null) || commandItems !== undefined;
}
