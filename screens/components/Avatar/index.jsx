import React, { useState } from 'react';
import styles from './index.module.css';
import { getAvatarInitial, stringToColor } from './utils';

const SIZES = {
  small: 24,
  medium: 32,
  large: 40,
};

const Avatar = ({
  src,
  alt = '',
  name = '',
  children,
  size = 32,
  shape = 'circle',
  bgColor,
  textColor,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  const numericSize = typeof size === 'number' ? size : SIZES[size] || 32;
  const initial = children || getAvatarInitial(name || alt);
  const calculatedBgColor = bgColor || (src && !imgError ? 'transparent' : stringToColor(name || String(children || '')));

  const shapeClass = shape === 'rounded' 
    ? styles.shapeRounded 
    : shape === 'square' 
    ? styles.shapeSquare 
    : styles.shapeCircle;

  const dynamicStyle = {
    width: numericSize,
    height: numericSize,
    fontSize: `${Math.round(numericSize * 0.42)}px`,
    backgroundColor: calculatedBgColor,
    ...(textColor ? { color: textColor } : {}),
    ...style,
  };

  return (
    <div
      className={`${styles.avatar} ${shapeClass} ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || name}
          className={styles.avatarImg}
          onError={() => setImgError(true)}
        />
      ) : Icon ? (
        <Icon size={Math.round(numericSize * 0.55)} />
      ) : (
        <span className={styles.avatarFallback}>{initial}</span>
      )}
    </div>
  );
};

export default Avatar;
