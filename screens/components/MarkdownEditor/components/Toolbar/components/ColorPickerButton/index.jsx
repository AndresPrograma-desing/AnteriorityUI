import React from 'react';
import { Tooltip } from '@mui/material';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Palette } from 'lucide-react';
import ColorPickerPanel from '../../../../../ColorPicker/ColorPickerPanel';
import colorPickerStyles from '../../../../../ColorPicker/index.module.css';
import Button from '../../../../../Button/index';
import toolbarStyles from '../../index.module.css';
import styles from './index.module.css';

function ColorPickerButton({
  buttonRef,
  pendingColor,
  isOpen,
  onToggleOpen,
  onClose,
  onColorPreview,
  onApplyColor,
  disabled,
  colorTooltip,
  applyColorLabel,
}) {
  return (
    <>
      <Tooltip title={colorTooltip} arrow>
        <button
          type="button"
          ref={buttonRef}
          className={toolbarStyles.toolButton}
          onClick={onToggleOpen}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <Palette size={16} style={{ color: pendingColor }} />
        </button>
      </Tooltip>

      <Popper
        anchorEl={buttonRef.current}
        open={isOpen}
        placement="bottom-start"
        style={{ zIndex: 1400 }}
        modifiers={[
          { name: 'offset', options: { offset: [0, 6] } },
          { name: 'flip', options: { padding: 8 } },
          { name: 'preventOverflow', options: { altAxis: true, padding: 8 } },
        ]}
      >
        <ClickAwayListener
          onClickAway={(event) => {
            if (!buttonRef.current?.contains(event.target)) onClose();
          }}
        >
          <div className={colorPickerStyles.popover}>
            <ColorPickerPanel value={pendingColor} onChange={onColorPreview} />
            <Button
              fullWidth
              size="small"
              color={pendingColor}
              onClick={onApplyColor}
              className={styles.colorApplyButton}
            >
              {applyColorLabel}
            </Button>
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

export default ColorPickerButton;
