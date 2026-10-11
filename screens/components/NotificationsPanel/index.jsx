import React from 'react';
import { Bell } from 'lucide-react';
import Frame from '../Frame/index';
import Button from '../Button/index';
import Callout from '../Callout/index';
import styles from './index.module.css';
import {
    DEFAULT_TITLE,
    DEFAULT_EMPTY_MESSAGE,
    DEFAULT_MAX_HEIGHT,
    DEFAULT_DISMISS_LABEL,
} from './constants.js';

function NotificationsPanel({
    title = DEFAULT_TITLE,
    icon = <Bell size={20} />,
    notifications = [],
    onDismiss,
    emptyMessage = DEFAULT_EMPTY_MESSAGE,
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

    return (
        <Frame
            title={title}
            icon={icon}
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
                    <p className={styles.emptyMessage}>{emptyMessage}</p>
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
