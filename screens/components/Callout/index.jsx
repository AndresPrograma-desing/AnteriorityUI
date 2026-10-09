import React from 'react';
import { X } from 'lucide-react';
import MarkdownContent from '../MarkdownContent/index';
import styles from './index.module.css';
import { VARIANT_PALETTE, DEFAULT_VARIANT } from './constants';

export const Callout = ({
  variant = DEFAULT_VARIANT,
  title,
  children,
  icon,
  actions,
  onClose,
  closeLabel = 'Cerrar aviso',
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

  return (
    <div
      role={role}
      className={`${styles.callout} ${className}`}
      style={{
        backgroundColor: resolvedBg,
        borderColor: resolvedBorder,
        ...style,
      }}
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

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          style={{ color: resolvedText }}
          onClick={onClose}
          aria-label={closeLabel}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Callout;
