import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import styles from './index.module.css';
import ModalTooltip from '../ModalTooltip/ModalTooltip';
import { SWITCH_TEXTS } from './constants';  

const Switch = ({ 
  value = false, 
  onChange, 
  disabled = false, 
  activeColor = '#088d4f',
  inactiveColor = '#919191',
  thumbColor = '#ffffff',
  variant = 'default',
  showIcons = false,
  icons = false,
  showLabels = false,
  labels = false,
  yesText = 'SI',
  noText = 'NO',
  iconActiveColor,
  iconInactiveColor,
  labelActiveColor = '#ffffff',
  labelInactiveColor = '#ffffff',
  showTooltip = true,
  tooltip,
  ToolTip,
  className = '', 
  style = {} 
}) => {
  const [active, setActive] = useState(value);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    setActive(value);
  }, [value]);

  const handleClick = (e) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    const newActive = !active;
    setActive(newActive);
    
    if (onChange) {
      onChange(newActive);
    }
  };

  const hasIcons = Boolean(showIcons || icons || variant === 'icons' || variant === 'both');
  const hasLabels = Boolean(showLabels || labels || variant === 'labels' || variant === 'both');
  const shouldShowTooltip = showTooltip !== false && tooltip !== false && ToolTip !== false;

  const statusClass = active ? styles.active : styles.inactive;

  const dynamicStyle = {
    ...style,
    backgroundColor: active ? activeColor : inactiveColor,
  };

  const computedTooltipText = typeof tooltip === 'string'
    ? tooltip
    : typeof ToolTip === 'string'
    ? ToolTip
    : active
    ? (tooltip?.enabled || ToolTip?.enabled || SWITCH_TEXTS.enabled)
    : (tooltip?.disabled || ToolTip?.disabled || SWITCH_TEXTS.disabled);

  const buttonElement = (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      disabled={disabled}
      className={`${styles.switchButton} ${statusClass} ${className}`}
      style={dynamicStyle}
      onClick={handleClick}
    >
      <div className={styles.thumb} style={{ backgroundColor: thumbColor }}>
        {hasIcons && (
          <span key={active ? 'icon-check' : 'icon-x'} className={styles.thumbIcon}>
            {active ? (
              <Check
                size={11}
                strokeWidth={3}
                color={iconActiveColor || activeColor}
                aria-hidden="true"
              />
            ) : (
              <X
                size={11}
                strokeWidth={3}
                color={iconInactiveColor || inactiveColor}
                aria-hidden="true"
              />
            )}
          </span>
        )}
      </div>

      {hasLabels && (
        <span
          key={active ? 'label-yes' : 'label-no'}
          className={`${styles.trackLabel} ${active ? styles.trackLabelActive : styles.trackLabelInactive}`}
          style={{ color: active ? labelActiveColor : labelInactiveColor }}
          aria-hidden="true"
        >
          {active ? yesText : noText}
        </span>
      )}
      
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );

  if (!shouldShowTooltip || !computedTooltipText) {
    return buttonElement;
  }

  return (
    <ModalTooltip text={computedTooltipText}>
      {buttonElement}
    </ModalTooltip>
  );
};

export default Switch;

