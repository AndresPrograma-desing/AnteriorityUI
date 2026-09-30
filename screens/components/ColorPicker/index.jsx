import React, { memo, useRef, useState } from 'react';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ColorPickerPanel from './ColorPickerPanel';
import { isValidHex, normalizeHex } from './utils';
import styles from './index.module.css';

const FALLBACK_COLOR = '#000000';

const ColorPicker = ({
    value = FALLBACK_COLOR,
    onChange,
    label,
    ariaLabel,
    disabled = false,
    placement = 'bottom-start',
    labels,
    className = '',
    bgColor,
    textColor,
    borderColor,
    accentColor,
}) => {
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(false);

    const color = isValidHex(value) ? normalizeHex(value) : FALLBACK_COLOR;

    const cssVars = {
        ...(bgColor ? { '--cp-bg': bgColor } : {}),
        ...(textColor ? { '--cp-text': textColor } : {}),
        ...(borderColor ? { '--cp-border': borderColor } : {}),
        ...(accentColor ? { '--cp-accent': accentColor } : {}),
    };

    return (
        <div className={`${styles.root} ${className}`} style={cssVars}>
            {label && <span className={styles.label}>{label}</span>}
            <button
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={ariaLabel || label}
                className={styles.trigger}
                disabled={disabled}
                onClick={() => setOpen((previous) => !previous)}
                ref={triggerRef}
                type="button"
            >
                <span className={styles.swatch} style={{ '--swatch-color': color }} />
                <span className={styles.hexText}>{color}</span>
            </button>

            <Popper
                anchorEl={triggerRef.current}
                open={open}
                placement={placement}
                style={{ zIndex: 1400, ...cssVars }}
                modifiers={[
                    { name: 'offset', options: { offset: [0, 6] } },
                    { name: 'flip', options: { padding: 8 } },
                    { name: 'preventOverflow', options: { altAxis: true, padding: 8 } },
                ]}
            >
                <ClickAwayListener
                    onClickAway={(event) => {
                        if (!triggerRef.current?.contains(event.target)) setOpen(false);
                    }}
                >
                    <div
                        className={styles.popover}
                        onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                                setOpen(false);
                                triggerRef.current?.focus();
                            }
                        }}
                        role="dialog"
                    >
                        <ColorPickerPanel labels={labels} onChange={onChange} value={color} />
                    </div>
                </ClickAwayListener>
            </Popper>
        </div>
    );
};

export default memo(ColorPicker);
