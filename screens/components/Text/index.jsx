import React from 'react';
import styles from './index.module.css';
import { VARIANT_TAGS, DEFAULT_VARIANT, DEFAULT_ALIGN } from './constants.js';

export default function Text({
  children,
  variant = DEFAULT_VARIANT,
  color,
  align = DEFAULT_ALIGN,
  className = '',
  style,
}) {
  const Tag = VARIANT_TAGS[variant] || VARIANT_TAGS[DEFAULT_VARIANT];

  return (
    <Tag
      className={`${styles.text} ${styles[variant] || ''} ${className}`.trim()}
      style={{
        textAlign: align,
        ...(color ? { '--text-color': color } : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
