import React from 'react';
import Button from '../../../Button/index';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import topbarStyles from '../../index.module.css';
import styles from './index.module.css';

function TopBarActions({ actions, hasGlobalHover }) {
    return actions.map((action, index) => {
        const Icon = action.icon;
        const hasBadge = action.badge !== undefined && action.badge !== null && action.badge !== false;
        const isDotBadge = action.badge === true;
        const isHoverEnabled = hasGlobalHover && action.hover !== false && !action.noHover && !action.disableHover;

        const actionStyle = {
            minWidth: 0,
            padding: '7px',
            ...(action.bgColor ? { '--action-bg-color': action.bgColor } : {}),
            ...(action.color ? { '--action-icon-color': action.color } : {}),
            ...(action.borderColor ? { '--action-border-color': action.borderColor } : {}),
            ...(action.hoverBgColor ? { '--action-hover-bg': action.hoverBgColor } : {}),
            ...(action.hoverTextColor ? { '--action-hover-text': action.hoverTextColor } : {}),
            ...(action.hoverBorderColor ? { '--action-hover-border': action.hoverBorderColor } : {}),
            ...(action.rippleColor ? { '--action-ripple-color': action.rippleColor } : {}),
            ...action.style,
        };

        const button = (
            <span key={action.key ?? index} className={topbarStyles.actionBtnWrapper}>
                <Button
                    size="small"
                    variant={Button.VARIANTS.GHOST}
                    color="transparent"
                    disableRipple={action.disableRipple}
                    className={`${styles.actionBtn} ${isHoverEnabled ? styles.actionBtnWithHover : styles.actionBtnNoHover}`}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    style={actionStyle}
                >
                    {Icon && <Icon size={18} />}
                </Button>
                {hasBadge && (
                    <span className={`${topbarStyles.actionBadge} ${isDotBadge ? topbarStyles.actionBadgeDot : topbarStyles.actionBadgeCount}`}>
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
    });
}

export default TopBarActions;
