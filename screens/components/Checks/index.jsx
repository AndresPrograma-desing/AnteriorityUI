import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import styles from './index.module.css';

import ModalTooltip from '../ModalTooltip/ModalTooltip';

export default function PermissionCheckboxItem({
  label,
  checked,
  onChange,
  disabled,
  checkedBgColor,
  labelColor,
  checkedLabelColor,
  iconOnly = false,
  className = '',
  style: styleProp,
}) {
  const style = {
    ...(checkedBgColor ? { '--checks-checked-bg': checkedBgColor } : {}),
    ...(labelColor ? { '--checks-label': labelColor } : {}),
    ...(checkedLabelColor ? { '--checks-checked-label': checkedLabelColor } : {}),
  };

  const containerClasses = [
    styles.itemContainer,
    checked ? styles.checked : '',
    iconOnly ? styles.iconOnly : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const checkboxClasses = checked ? styles.animatedCheck : '';

  const checkboxElement = (
    <Checkbox
      checked={checked}
      disabled={disabled}
      disableRipple
      tabIndex={-1}
      className={checkboxClasses}
      sx={iconOnly ? { p: 0 } : undefined}
    />
  );

  return (
    <ButtonBase
      component="div"
      className={containerClasses}
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      focusRipple={!iconOnly}
      style={{ ...style, ...styleProp }}
    >
      {label ? (
        <ModalTooltip text={label}>
          {checkboxElement}
        </ModalTooltip>
      ) : (
        checkboxElement
      )}

      {!iconOnly && label && (
        <span className={styles.label}>{label}</span>
      )}
    </ButtonBase>
  );
}