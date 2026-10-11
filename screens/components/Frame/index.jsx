import React from 'react';
import { createPortal } from 'react-dom';
import styles from './index.module.css';
import Loading from '../Loading/index';
import Skeleton from '../Skeleton/index';
import ScrollBar from '../ScrollBar/index';
import { DEFAULT_LOADING_TYPE, DEFAULT_LOADING_VARIANT, DEFAULT_SKELETON_COUNT } from './constants.js';

function Frame({
    title,
    icon,
    content,
    error,
    children,
    className = '',
    isModal = false,
    onClose,
    isLoading = false,
    loadingType = DEFAULT_LOADING_TYPE,
    loadingVariant = DEFAULT_LOADING_VARIANT,
    skeletonCount = DEFAULT_SKELETON_COUNT,
    scrollable = false,
    maxHeight,
    bgColor,
    iconColor,
    descriptionBgColor,
}) {
    const frameCardStyle = {
        ...(bgColor ? { '--frame-bg': bgColor } : {}),
        ...(iconColor ? { '--frame-icon': iconColor } : {}),
        ...(descriptionBgColor ? { '--frame-description-bg': descriptionBgColor } : {}),
    };

    const frameContent = (
        <div
            className={`${styles.frameCard} ${isModal ? styles.frameCardModal : ''} ${className}`}
            style={frameCardStyle}
            onClick={(e) => e.stopPropagation()}
        >
            {(title || icon) && (
                <div className={styles.headerContainer}>
                    {title && <h3 className={styles.frameTitle}>{title}</h3>}
                    {icon && <div className={styles.iconContainer}>{icon}</div>}
                </div>
            )}
            {content && <p className={styles.description}>{content}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.bodyContainer}>
                {isLoading && loadingType === 'skeleton' ? (
                    <div className={styles.skeletonGroup}>
                        {Array.from({ length: skeletonCount }).map((_, index) => (
                            <Skeleton key={index} width="100%" height="1rem" />
                        ))}
                    </div>
                ) : (
                    <>
                        {isLoading && (
                            <div className={styles.loadingOverlay}>
                                <Loading
                                    size="giant"
                                    variant={loadingVariant}
                                />
                            </div>
                        )}
                        <div className={isLoading ? styles.hiddenContent : styles.contentWrapper}>
                            {scrollable ? (
                                <ScrollBar maxHeight={maxHeight} reserveTrackSpace contentClassName={styles.scrollContent}>
                                    {children}
                                </ScrollBar>
                            ) : (
                                children
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    if (isModal) {
        return createPortal(
            <div className={styles.modalOverlay} onClick={onClose}>
                {frameContent}
            </div>,
            document.body
        );
    }

    return frameContent;
}

export default Frame;
