import React from 'react';
import Button from '../../../Button/index';
import styles from './index.module.css';

// Barra superior del composer. Cada item define su tipo:
// - 'button': botón con texto (+ ícono opcional)
// - 'icon': botón circular solo ícono
// - 'toggle': botón con estado activo (`active`), con aria-pressed
// - 'custom': nodo libre (`node`), por ejemplo un selector o un badge
// - 'separator' / 'spacer': divisor vertical o espacio flexible
// Colores por item: `color` (color del botón) y `activeColor` (fondo cuando está activo).
const ComposerToolbar = ({ items = [], className = '' }) => (
  <div className={`${styles.toolbar} ${className}`.trim()} role="toolbar">
    {items.map((item, index) => {
      const key = item.key ?? index;

      if (item.type === 'separator') return <span key={key} className={styles.separator} />;
      if (item.type === 'spacer') return <span key={key} className={styles.spacer} />;
      if (item.type === 'custom') return <React.Fragment key={key}>{item.node}</React.Fragment>;

      const common = {
        icon: item.icon,
        disabled: item.disabled,
        onClick: item.onClick,
        color: item.color,
        activeColor: item.activeColor,
        active: !!item.active,
        ToolTip: item.tooltip ?? false,
        variant: item.variant ?? Button.VARIANTS.GHOST,
        size: Button.SIZES.SMALL,
      };

      if (item.type === 'icon') {
        return <Button key={key} circle {...common} />;
      }
      if (item.type === 'toggle') {
        return <Button key={key} aria-pressed={!!item.active} {...common}>{item.label}</Button>;
      }
      return <Button key={key} {...common}>{item.label}</Button>;
    })}
  </div>
);

export default ComposerToolbar;
