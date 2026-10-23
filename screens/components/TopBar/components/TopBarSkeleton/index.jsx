import React from 'react';
import { Menu } from 'lucide-react';
import Skeleton from '../../../Skeleton/index';
import topbarStyles from '../../index.module.css';
import styles from './index.module.css';
import { hasCenterSearch } from '../../utils.js';
import { DEFAULT_SKELETON_ACTIONS_COUNT } from '../../constants.js';

function TopBarSkeleton({
    className = '',
    themeVars,
    onMenuClick,
    logo,
    breadcrumbItems,
    title,
    centerContent,
    searchProps,
    commandItems,
    hasUser,
    actions,
    skeletonActionsCount,
    showDivider = true,
}) {
    const actionsCount = skeletonActionsCount !== undefined
        ? skeletonActionsCount
        : (Array.isArray(actions) ? actions.length : DEFAULT_SKELETON_ACTIONS_COUNT);
    const showCenterSearchSkeleton = hasCenterSearch({ centerContent, searchProps, commandItems });
    const hasCenterContent = Boolean(centerContent);
    const hasLogo = logo !== null && logo !== false;

    return (
        <header className={`${topbarStyles.topbar} ${className}`} style={themeVars} aria-busy="true">
            <div className={topbarStyles.leftSection}>
                {onMenuClick && (
                    <button type="button" className={topbarStyles.mobileMenuButton} disabled aria-hidden="true">
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

            <div className={topbarStyles.centerSection}>
                {showCenterSearchSkeleton ? (
                    <div className={topbarStyles.searchWrapper}>
                        <Skeleton width="100%" height="36px" radius="8px" />
                    </div>
                ) : hasCenterContent ? (
                    <Skeleton width="240px" height="36px" radius="8px" />
                ) : null}
            </div>

            <div className={topbarStyles.rightSection}>
                {actionsCount > 0 && Array.from({ length: actionsCount }).map((_, idx) => (
                    <span key={`skeleton-action-${idx}`} className={topbarStyles.actionBtnWrapper}>
                        <Skeleton width="34px" height="34px" radius="6px" />
                    </span>
                ))}

                {showDivider && actionsCount > 0 && hasUser && (
                    <span className={topbarStyles.actionsDivider} aria-hidden="true" />
                )}

                {hasUser && (
                    <Skeleton circle width="32px" height="32px" />
                )}
            </div>
        </header>
    );
}

export default TopBarSkeleton;
