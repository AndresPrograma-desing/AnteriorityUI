import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import ButtonBase from '@mui/material/ButtonBase';
import styles from './index.module.css';

import ModalTooltip from '../ModalTooltip/ModalTooltip';

export default function PermissionCheckboxItem({ label, checked, onChange, disabled, checkedBgColor, labelColor, checkedLabelColor, className = '', style: styleProp }) {
  const style = {
    ...(checkedBgColor ? { '--checks-checked-bg': checkedBgColor } : {}),
    ...(labelColor ? { '--checks-label': labelColor } : {}),
    ...(checkedLabelColor ? { '--checks-checked-label': checkedLabelColor } : {}),
  };

  return (
    <ButtonBase
      component="div"
      className={`${styles.itemContainer} ${checked ? styles.checked : ''} ${className}`.trim()}
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      focusRipple
      style={{ ...style, ...styleProp }}
    >
        <ModalTooltip  text={label}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        disableRipple
        tabIndex={-1}
      />
      </ModalTooltip>
     
        <span className={styles.label}>{label}</span>

    </ButtonBase>
  );
}
