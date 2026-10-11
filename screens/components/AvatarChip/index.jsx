import React from 'react';
import { X as CloseIcon } from 'lucide-react';
import styles from './index.module.css';
import Avatar from '../Avatar/index';
import { CHIP_VARIANTS, CHIP_SIZES } from './constants';

const AVATAR_SIZES = {
  small: 20,
  medium: 26,
  large: 32,
};

const AvatarChip = ({
  avatar,
  src,
  name,
  initial,
  icon,
  label,
  variant = CHIP_VARIANTS.FILLED,
  size = CHIP_SIZES.MEDIUM,
  expandOnHover = false,
  collapsed,
  onClick,
  onDelete,
  deleteIcon,
  deleteAriaLabel = 'Eliminar',
  disabled = false,
  bgColor,
  textColor,
  borderColor,
  className = '',
  style = {},
  ...props
}) => {
  const isExpandMode = Boolean(expandOnHover);
  const isManuallyExpanded = collapsed !== undefined ? !collapsed : false;

  const sizeClass = size === CHIP_SIZES.SMALL 
    ? styles.sizeSmall 
    : size === CHIP_SIZES.LARGE 
    ? styles.sizeLarge 
    : styles.sizeMedium;

  const variantClass = variant === CHIP_VARIANTS.OUTLINED 
    ? styles.variantOutlined 
    : styles.variantFilled;

  const isClickable = Boolean(onClick) && !disabled;

  const themeVars = {
    ...(bgColor ? { '--chip-bg': bgColor } : {}),
    ...(textColor ? { '--chip-text': textColor } : {}),
    ...(borderColor ? { '--chip-border': borderColor } : {}),
    ...style,
  };

  const avatarSize = AVATAR_SIZES[size] || 26;

  let renderedAvatar = null;
  if (React.isValidElement(avatar)) {
    renderedAvatar = React.cloneElement(avatar, {
      size: avatar.props.size || avatarSize,
    });
  } else if (avatar) {
    renderedAvatar = avatar;
  } else if (src || name || initial || icon) {
    renderedAvatar = (
      <Avatar
        src={src}
        name={name}
        size={avatarSize}
        icon={icon}
      >
        {initial}
      </Avatar>
    );
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onDelete && onDelete(e);
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      className={`
        ${styles.chip}
        ${sizeClass}
        ${variantClass}
        ${isClickable ? styles.clickable : ''}
        ${disabled ? styles.disabled : ''}
        ${isExpandMode ? styles.expandOnHover : ''}
        ${isManuallyExpanded ? styles.isExpanded : ''}
        ${className}
      `.trim()}
      style={themeVars}
      {...props}
    >
      {renderedAvatar && (
        <span className={styles.avatarWrapper}>
          {renderedAvatar}
        </span>
      )}

      {label && (
        <span className={styles.labelWrapper}>
          <span className={styles.labelText}>{label}</span>
        </span>
      )}

      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDeleteClick}
          aria-label={deleteAriaLabel}
          disabled={disabled}
        >
          {deleteIcon || <CloseIcon size={size === CHIP_SIZES.SMALL ? 12 : 14} />}
        </button>
      )}
    </div>
  );
};

export const AvatarChipGroup = ({
  children,
  direction = 'row',
  spacing = 8,
  wrap = true,
  className = '',
  style = {},
  ...props
}) => {
  const isColumn = direction === 'column';
  const spacingValue = typeof spacing === 'number' ? `${spacing}px` : spacing;

  return (
    <div
      className={`${styles.chipGroup} ${isColumn ? styles.chipGroupColumn : ''} ${className}`.trim()}
      style={{
        '--chip-group-spacing': spacingValue,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

AvatarChip.Group = AvatarChipGroup;
AvatarChip.Avatar = Avatar;
AvatarChip.VARIANTS = CHIP_VARIANTS;
AvatarChip.SIZES = CHIP_SIZES;

export { AvatarChip, AvatarChip as Chip, Avatar };
export default AvatarChip;
