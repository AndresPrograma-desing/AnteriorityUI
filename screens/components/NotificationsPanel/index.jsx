import React from 'react';
import { Bell, BellOff, Mail, MailX } from 'lucide-react';
import Frame from '../Frame/index';
import Button from '../Button/index';
import Callout from '../Callout/index';
import styles from './index.module.css';
import {
    DEFAULT_TITLE,
    DEFAULT_EMPTY_MESSAGE,
    DEFAULT_MAX_HEIGHT,
    DEFAULT_DISMISS_LABEL,
    DEFAULT_EMPTY_ICON_SIZE,
    DEFAULT_EMPTY_MIN_HEIGHT,
} from './constants.js';

function NotificationsPanel({
    title = DEFAULT_TITLE,
    icon,
    notifications = [],
    onDismiss,
    emptyTitle,
    emptyMessage = DEFAULT_EMPTY_MESSAGE,
    emptyIcon,
    emptyIconSize = DEFAULT_EMPTY_ICON_SIZE,
    emptyIconColor,
    emptyTextColor,
    emptyMinHeight = DEFAULT_EMPTY_MIN_HEIGHT,
    maxHeight = DEFAULT_MAX_HEIGHT,
    dismissLabel = DEFAULT_DISMISS_LABEL,
    isModal = false,
    onClose,
    isLoading = false,
    loadingType,
    loadingVariant,
    skeletonCount,
    className = '',
    bgColor,
    iconColor,
    itemBgColor,
    itemBorderColor,
    itemIconColor,
    textColor,
}) {
    const hasNotifications = notifications.length > 0;

    const isMessageContext =
        (typeof title === 'string' && /mensaje|mail|chat/i.test(title)) ||
        (typeof emptyMessage === 'string' && /mensaje|mail|chat/i.test(emptyMessage));

    let renderedEmptyIcon = null;
    if (emptyIcon !== false && emptyIcon !== null) {
        if (React.isValidElement(emptyIcon)) {
            renderedEmptyIcon = emptyIcon;
        } else if (typeof emptyIcon === 'function') {
            const IconComponent = emptyIcon;
            renderedEmptyIcon = <IconComponent size={emptyIconSize} strokeWidth={1.5} />;
        } else {
            const DefaultEmptyIcon = isMessageContext ? MailX : BellOff;
            renderedEmptyIcon = <DefaultEmptyIcon size={emptyIconSize} strokeWidth={1.5} />;
        }
    }

    const resolvedHeaderIcon =
        icon !== undefined
            ? icon
            : isMessageContext
                ? <Mail size={20} />
                : <Bell size={20} />;

    const emptyContainerStyle = {
        ...(emptyMinHeight ? { minHeight: typeof emptyMinHeight === 'number' ? `${emptyMinHeight}px` : emptyMinHeight } : {}),
        ...(emptyIconColor ? { '--notifications-empty-icon': emptyIconColor } : {}),
        ...(emptyTextColor ? { '--notifications-empty-text': emptyTextColor } : {}),
    };

    return (
        <Frame
            title={title}
            icon={resolvedHeaderIcon}
            isModal={isModal}
            onClose={onClose}
            isLoading={isLoading}
            loadingType={loadingType}
            loadingVariant={loadingVariant}
            skeletonCount={skeletonCount}
            scrollable={hasNotifications}
            maxHeight={maxHeight}
            className={`${styles.panel} ${className}`}
            bgColor={bgColor}
            iconColor={iconColor}
        >
            <div className={styles.list}>
                {!hasNotifications ? (
                    <div className={styles.emptyContainer} style={emptyContainerStyle}>
                        {renderedEmptyIcon && (
                            <div className={styles.emptyIconWrapper}>
                                {renderedEmptyIcon}
                            </div>
                        )}
                        {emptyTitle && <h4 className={styles.emptyTitle}>{emptyTitle}</h4>}
                        <p className={styles.emptyMessage}>{emptyMessage}</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <Callout
                            key={notification.id}
                            variant={notification.variant || 'neutral'}
                            icon={notification.icon}
                            title={notification.title}
                            timestamp={notification.timestamp}
                            onClick={notification.onClick}
                            href={notification.href}
                            onClose={onDismiss ? () => onDismiss(notification.id) : undefined}
                            closeLabel={dismissLabel}
                            bgColor={notification.bgColor || itemBgColor}
                            borderColor={notification.borderColor || itemBorderColor}
                            iconColor={notification.iconColor || itemIconColor}
                            textColor={notification.textColor || textColor}
                            className={styles.item}
                            actions={
                                Array.isArray(notification.actions) && notification.actions.length > 0 ? (
                                    <div className={styles.itemActions}>
                                        {notification.actions.map((action, index) => (
                                            <Button
                                                key={action.key ?? index}
                                                size="small"
                                                variant={action.variant || 'primary'}
                                                color={action.color}
                                                fullWidth={action.fullWidth}
                                                onClick={action.onClick}
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                ) : undefined
                            }
                        >
                            {notification.message}
                        </Callout>
                    ))
                )}
            </div>
        </Frame>
    );
}

export default NotificationsPanel;
