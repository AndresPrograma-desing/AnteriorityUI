import React from 'react';
import { X } from 'lucide-react';
import MarkdownContent from '../MarkdownContent/index';
import styles from './index.module.css';
import { VARIANT_PALETTE, DEFAULT_VARIANT } from './constants';

export const Callout = ({
  variant = DEFAULT_VARIANT,
  title,
  children,
  timestamp,
  icon,
  actions,
  onClose,
  closeLabel = 'Cerrar aviso',
  onClick,
  href,
  bgColor,
  textColor,
  iconColor,
  borderColor,
  linkColor,
  markdownComponents,
  className = '',
  style,
}) => {
  if (!title && !children) return null;

  const palette = VARIANT_PALETTE[variant] || VARIANT_PALETTE[DEFAULT_VARIANT];
  const Icon = icon || palette.icon;
  const resolvedBg = bgColor || palette.bgColor;
  const resolvedBorder = borderColor || palette.borderColor;
  const resolvedText = textColor || palette.textColor;
  const resolvedIcon = iconColor || palette.iconColor;
  const role = variant === 'danger' || variant === 'warning' ? 'alert' : 'status';

  const isClickable = Boolean(onClick || href);
  const Tag = href ? 'a' : 'div';
  const clickableProps = isClickable
    ? {
        onClick,
        href,
        role: href ? undefined : 'button',
        tabIndex: 0,
        onKeyDown: href
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(e);
              }
            },
      }
    : {};

  return (
    <Tag
      role={isClickable ? clickableProps.role : role}
      className={`${styles.callout} ${isClickable ? styles.clickable : ''} ${className}`}
      style={{
        backgroundColor: resolvedBg,
        borderColor: resolvedBorder,
        ...style,
      }}
      {...clickableProps}
    >
      {Icon && (
        <span className={styles.icon} style={{ color: resolvedIcon }}>
          <Icon size={20} />
        </span>
      )}

      <div className={styles.body}>
        {title && (
          <div className={styles.title} style={{ color: resolvedText }}>
            {title}
          </div>
        )}

        {children && (
          <MarkdownContent
            className={styles.markdownBody}
            linkColor={linkColor}
            components={markdownComponents}
            style={{ color: resolvedText }}
          >
            {children}
          </MarkdownContent>
        )}

        {timestamp && (
          <div className={styles.timestamp} style={{ color: resolvedText }}>
            {timestamp}
          </div>
        )}

        {actions && <div className={styles.actions} onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          style={{ color: resolvedText }}
          onClick={(e) => {
            e.stopPropagation();
            onClose(e);
          }}
          aria-label={closeLabel}
        >
          <X size={16} />
        </button>
      )}
    </Tag>
  );
};

export default Callout;
