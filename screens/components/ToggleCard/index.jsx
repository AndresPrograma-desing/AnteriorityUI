import React from 'react';
import styles from './index.module.css';
import { formatHighlightedText } from '../GreenHighlight/utils';
import useSwipeToDismiss from '../../../common/hooks/useSwipeToDismiss';

const ToggleCard = ({
  title,
  description,
  icon: Icon,
  action,
  children,
  onClose,
  closeText = "Cerrar",
  variant = "default", // "floating" or "default"
  onClick,
  backgroundColor,
  borderColor,
  titleColor,
  descriptionColor,
  iconColor,
  swipeToDismiss = false,
  swipeThreshold,
  className = '',
  style,
}) => {
  const containerClass = `${styles.toggleContainer} ${variant === 'floating' ? styles.floatingVariant : ''} ${className}`.trim();

  const formattedTitle = typeof title === 'string' ? formatHighlightedText(title) : title;
  const formattedDescription = typeof description === 'string' ? formatHighlightedText(description) : description;

  const { style: swipeStyle, handlers: swipeHandlers } = useSwipeToDismiss({
    enabled: swipeToDismiss,
    onDismiss: onClose,
    ...(swipeThreshold != null ? { threshold: swipeThreshold } : {}),
  });

  return (
    <div
      className={containerClass}
      onClick={onClick}
      {...swipeHandlers}
      style={{
        ...(backgroundColor && { backgroundColor }),
        ...(borderColor && { borderColor }),
        ...(onClick && { cursor: 'pointer' }),
        ...swipeStyle,
        ...style,
      }}
    >
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <div className={styles.headerLine}>
            {Icon && <Icon size={18} className={styles.icon} style={iconColor ? { color: iconColor } : undefined} />}
            <span className={styles.label} style={titleColor ? { color: titleColor } : undefined}>
              {formattedTitle}
            </span>
          </div>
          {description && (
            <p className={styles.description} style={descriptionColor ? { color: descriptionColor } : undefined}>
              {formattedDescription}
            </p>
          )}
        </div>
        <div className={styles.actionSection}>
          {action}
          {onClose && (
            <button onClick={onClose} className={styles.closeBtn}>
              {closeText}
            </button>
          )}
        </div>
      </div>
      {children && <div className={styles.childrenWrapper}>{children}</div>}
    </div>
  );
};

export default ToggleCard;
