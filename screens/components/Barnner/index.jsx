import React from 'react';
import styles from './index.module.css';

const Barnner = ({ children, icon: Icon, type = 'default', className = '', bgColor, textColor, borderColor }) => {
  const typeClass = styles[`badge${type.charAt(0).toUpperCase() + type.slice(1)}`] || styles.badgeDefault;

  const overrideStyle = {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(textColor ? { color: textColor } : {}),
    ...(borderColor ? { borderColor, borderStyle: 'solid', borderWidth: '1px' } : {}),
  };

  return (
    <div className={`${styles.badge} ${typeClass} ${className}`} style={overrideStyle}>
      {Icon && <Icon size={14} />}
      <span>{children}</span>
    </div>
  );
};

export default Barnner;
