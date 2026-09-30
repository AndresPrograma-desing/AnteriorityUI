import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ChevronUp, ChevronDown } from 'lucide-react';
import TextField from '../Material-UI/Components/TextField/index';
import styles from './index.module.css';
import { clampNumber, isValidNumericText, stepNumber, getNumberWindow } from './utils';

const WINDOW_RADIUS = 2;

const NumericInput = forwardRef(({
    value,
    defaultValue,
    onChange,
    onFocus,
    onKeyDown,
    min,
    max,
    step = 1,
    allowDecimal = false,
    allowNegative,
    showStepper = true,
    popoverBgColor,
    popoverIconColor,
    popoverPlacement = 'top',
    name,
    inputProps,
    ...props
}, ref) => {
    const isControlled = value !== undefined;
    const [inner, setInner] = useState(defaultValue ?? '');
    const current = isControlled ? value : inner;
    const negativeOk = allowNegative ?? (min === undefined || min < 0);

    const [anchor, setAnchor] = useState(null);
    const inputEl = useRef(null);
    const [paperNode, setPaperNode] = useState(null);
    const latest = useRef({});
    latest.current = { current, min, max, step };

    const setRefs = (node) => {
        inputEl.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

    const emit = useCallback((next) => {
        const text = String(next);
        if (!isControlled) setInner(text);
        onChange?.({ target: { value: text, name }, currentTarget: { value: text, name } });
    }, [isControlled, onChange, name]);

    const applyStep = useCallback((direction) => {
        const { current: c, min: mn, max: mx, step: st } = latest.current;
        emit(stepNumber(c, direction * st, mn, mx));
    }, [emit]);

    const handleChange = (e) => {
        const text = e.target.value;
        if (!isValidNumericText(text, { allowDecimal, allowNegative: negativeOk })) return;
        if (!isControlled) setInner(text);
        onChange?.(e);
    };

    const handleBlur = (e) => {
        props.onBlur?.(e);
        setAnchor(null);
        const text = String(latest.current.current ?? '');
        if (text === '' || text === '-' || text === '.' || text === '-.') return;
        const clamped = clampNumber(Number(text), min, max);
        if (String(clamped) !== text) emit(clamped);
    };

    const handleKeyDown = (e) => {
        onKeyDown?.(e);
        if (e.key === 'ArrowUp') { e.preventDefault(); applyStep(1); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); applyStep(-1); }
        else if (e.key === 'Escape' || e.key === 'Enter') setAnchor(null);
    };

    // Rueda del mouse: listener nativo no-pasivo para poder evitar el scroll de la página.
    const isOpen = Boolean(anchor);
    useEffect(() => {
        if (!isOpen) return undefined;
        const onWheel = (e) => {
            e.preventDefault();
            applyStep(e.deltaY < 0 ? 1 : -1);
        };
        // El popover vive en un portal y se monta después de abrir: por eso se guarda el nodo en estado.
        const nodes = [anchor, inputEl.current, paperNode].filter(Boolean);
        nodes.forEach((n) => n.addEventListener('wheel', onWheel, { passive: false }));
        return () => nodes.forEach((n) => n.removeEventListener('wheel', onWheel));
    }, [isOpen, anchor, paperNode, applyStep]);

    const popoverStyle = {
        ...(popoverBgColor ? { '--numeric-popover-bg': popoverBgColor } : {}),
        ...(popoverIconColor ? { '--numeric-popover-icon': popoverIconColor } : {}),
    };

    return (
        <>
            <TextField
                {...props}
                name={name}
                value={current}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                    onFocus?.(e);
                    if (showStepper && !props.disabled && !props.readOnly) setAnchor(e.currentTarget.closest('.MuiInputBase-root') || e.currentTarget);
                }}
                onClick={(e) => {
                    if (showStepper && !props.disabled && !props.readOnly) setAnchor(e.currentTarget.closest('.MuiInputBase-root') || e.currentTarget);
                }}
                ref={setRefs}
                type="text"
                slotProps={{
                    htmlInput: {
                        inputMode: allowDecimal ? 'decimal' : 'numeric',
                        autoComplete: 'off',
                        ...inputProps,
                    },
                }}
            />
            {showStepper && (
                <Popper
                    open={isOpen}
                    anchorEl={anchor}
                    placement={popoverPlacement}
                    style={{ zIndex: 1400 }}
                    modifiers={[
                        { name: 'offset', options: { offset: [0, 4] } },
                        { name: 'flip', options: { fallbackPlacements: [popoverPlacement === 'top' ? 'bottom' : 'top'], padding: 8 } },
                        { name: 'preventOverflow', options: { altAxis: true, padding: 8 } },
                    ]}
                >
                    <ClickAwayListener onClickAway={(e) => {
                        if (anchor && anchor.contains(e.target)) return;
                        setAnchor(null);
                    }}>
                        <Paper
                            ref={setPaperNode}
                            elevation={4}
                            className={styles.numericPopover}
                            style={popoverStyle}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <button type="button" className={styles.numericStep} aria-label="Aumentar" onClick={() => applyStep(1)}>
                                <ChevronUp size={16} />
                            </button>
                            {getNumberWindow(current, step, min, max, WINDOW_RADIUS).map(({ offset, value: n }) => (
                                <button
                                    key={offset}
                                    type="button"
                                    disabled={n === null}
                                    className={`${styles.numericOption} ${offset === 0 ? styles.numericOptionActive : ''}`}
                                    style={{ opacity: n === null ? 0 : 1 - Math.abs(offset) * 0.25 }}
                                    onClick={() => n !== null && emit(n)}
                                >
                                    {n ?? ''}
                                </button>
                            ))}
                            <button type="button" className={styles.numericStep} aria-label="Disminuir" onClick={() => applyStep(-1)}>
                                <ChevronDown size={16} />
                            </button>
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            )}
        </>
    );
});

NumericInput.displayName = 'NumericInput';

export default NumericInput;
