import React from 'react';
import styles from './index.module.css';

const Badge = ({
  icon: Icon,
  label,
  value,
  iconColor = "#000000ff",
  bgColor,
  borderColor,
  labelColor,
  valueColor,
  style = {},
}) => {
  return (
    <div
      className={styles.badgeContainer}
      style={{
        ...(bgColor ? { '--badge-bg': bgColor } : {}),
        ...(borderColor ? { '--badge-border': borderColor } : {}),
        ...(labelColor ? { '--badge-label': labelColor } : {}),
        ...(valueColor ? { '--badge-value': valueColor } : {}),
        ...style,
      }}
    >
      {Icon && <Icon size={18} color={iconColor} />}
      {label && <span className={styles.badgeLabel}>{label}:</span>}
      <span className={styles.badgeValue}>{value}</span>
    </div>
  );
};

export default Badge;
