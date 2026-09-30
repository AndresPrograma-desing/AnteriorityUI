import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    COLOR_FORMAT_OPTIONS,
    COLOR_FORMATS,
    COMMIT_THROTTLE_MS,
    DEFAULT_LABELS,
    HSL_CHANNEL_KEYS,
    HUE_KEYBOARD_STEP,
    HUE_MAX,
    HUE_TRACK_BACKGROUND,
    PERCENT_KEYBOARD_STEP,
    PERCENT_MAX,
    RGB_CHANNEL_KEYS,
    SATURATION_OVERLAY_BACKGROUND,
} from './constants';
import {
    clamp,
    formatHslDraft,
    formatRgbDraft,
    getRelativePosition,
    hexToHsv,
    hsvToHex,
    hsvToHsl,
    hsvToRgb,
    isValidHex,
    normalizeHex,
    parseHslDraft,
    parseRgbDraft,
} from './utils';
import Button from '../Button/index';
import Input from '../Input/index';
import styles from './index.module.css';

const SATURATION_KEY_DELTAS = {
    ArrowRight: { s: PERCENT_KEYBOARD_STEP, v: 0 },
    ArrowLeft: { s: -PERCENT_KEYBOARD_STEP, v: 0 },
    ArrowUp: { s: 0, v: PERCENT_KEYBOARD_STEP },
    ArrowDown: { s: 0, v: -PERCENT_KEYBOARD_STEP },
};

const HUE_KEY_DELTAS = { ArrowRight: HUE_KEYBOARD_STEP, ArrowLeft: -HUE_KEYBOARD_STEP };

const draftsFromHsv = (hsv) => ({
    hex: hsvToHex(hsv),
    rgb: formatRgbDraft(hsvToRgb(hsv)),
    hsl: formatHslDraft(hsvToHsl(hsv)),
});

const CHANNEL_MAX = { r: 255, g: 255, b: 255, h: 360, s: 100, l: 100 };

// Colores del Input/popover numérico siguen los tokens del ColorPicker (bgColor/textColor/...).
const inputColors = {
    bgColor: 'var(--cp-bg, #ffffff)',
    textColor: 'var(--cp-text, #1e293b)',
    popoverBgColor: 'var(--cp-bg, #ffffff)',
    popoverIconColor: 'var(--cp-text, #1e293b)',
    popoverPlacement: 'bottom',
};

const fieldSx = (hasError) => ({
    m: 0,
    '& .MuiInputBase-root': { backgroundColor: 'var(--cp-bg, #ffffff)', color: 'var(--cp-text, #1e293b)' },
    '& .MuiInputBase-input': { textAlign: 'center', padding: '6px 4px' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: hasError ? '#ea1f1f' : 'var(--cp-border, #e2e8f0)' },
    '& .InputLabel-root, & .MuiInputLabel-root': { color: 'var(--cp-text, #1e293b)' },
});

const EMPTY_ERRORS = { hex: '', rgb: '', hsl: '' };

/**
 * Panel del selector. Decisiones de rendimiento:
 * - HSV vive en un ref (fuente de verdad durante el arrastre) y en estado solo para renderizar.
 * - El arrastre usa pointer capture (sin listeners globales) y se agrupa con requestAnimationFrame.
 * - onChange se emite con throttle (COMMIT_THROTTLE_MS) y se hace flush al soltar.
 * - Los borradores de HEX/RGB/HSL se guardan aparte para poder escribir valores incompletos.
 */
const ColorPickerPanel = ({ value, onChange, labels }) => {
    const text = { ...DEFAULT_LABELS, ...labels, channels: { ...DEFAULT_LABELS.channels, ...labels?.channels } };

    const hsvRef = useRef(hexToHsv(value));
    const [hsv, setHsv] = useState(hsvRef.current);
    const [format, setFormat] = useState(COLOR_FORMATS.HEX);
    const [drafts, setDrafts] = useState(() => draftsFromHsv(hsvRef.current));
    const [errors, setErrors] = useState(EMPTY_ERRORS);

    const saturationRef = useRef(null);
    const hueRef = useRef(null);
    const draggingRef = useRef(null);
    const dragRectRef = useRef(null);
    const latestPointRef = useRef(null);
    const rafIdRef = useRef(null);
    const commitTimeoutRef = useRef(null);
    const pendingCommitHexRef = useRef(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const hex = useMemo(() => hsvToHex(hsv), [hsv]);

    const flushCommit = useCallback(() => {
        if (commitTimeoutRef.current !== null) {
            window.clearTimeout(commitTimeoutRef.current);
            commitTimeoutRef.current = null;
        }
        const pendingHex = pendingCommitHexRef.current;
        if (pendingHex === null) return;
        pendingCommitHexRef.current = null;
        onChangeRef.current?.(pendingHex);
    }, []);

    const scheduleCommit = useCallback((nextHex) => {
        pendingCommitHexRef.current = nextHex;
        if (commitTimeoutRef.current === null) {
            commitTimeoutRef.current = window.setTimeout(flushCommit, COMMIT_THROTTLE_MS);
        }
    }, [flushCommit]);

    useEffect(() => () => {
        if (rafIdRef.current !== null) window.cancelAnimationFrame(rafIdRef.current);
        flushCommit();
    }, [flushCommit]);

    // Si el valor cambia desde afuera (no por este panel), se resincroniza.
    useEffect(() => {
        if (draggingRef.current || pendingCommitHexRef.current !== null) return;
        if (!isValidHex(value) || normalizeHex(value) === hsvToHex(hsvRef.current)) return;
        const next = hexToHsv(value);
        hsvRef.current = next;
        setHsv(next);
        setDrafts(draftsFromHsv(next));
        setErrors(EMPTY_ERRORS);
    }, [value]);

    // `skip` es el formato que el usuario está escribiendo: su borrador no se pisa.
    const applyHsv = useCallback((nextHsv, skip) => {
        hsvRef.current = nextHsv;
        const computed = draftsFromHsv(nextHsv);
        setHsv(nextHsv);
        setDrafts((prev) => ({
            hex: skip === COLOR_FORMATS.HEX ? prev.hex : computed.hex,
            rgb: skip === COLOR_FORMATS.RGB ? prev.rgb : computed.rgb,
            hsl: skip === COLOR_FORMATS.HSL ? prev.hsl : computed.hsl,
        }));
        setErrors((prev) => (prev === EMPTY_ERRORS ? prev : {
            hex: skip === COLOR_FORMATS.HEX ? prev.hex : '',
            rgb: skip === COLOR_FORMATS.RGB ? prev.rgb : '',
            hsl: skip === COLOR_FORMATS.HSL ? prev.hsl : '',
        }));
        scheduleCommit(computed.hex);
    }, [scheduleCommit]);

    const updateFromPoint = useCallback((point) => {
        if (!dragRectRef.current) return;
        const { x, y } = getRelativePosition(point, dragRectRef.current);
        if (draggingRef.current === 'saturation') {
            applyHsv({ ...hsvRef.current, s: x * PERCENT_MAX, v: (1 - y) * PERCENT_MAX });
        } else if (draggingRef.current === 'hue') {
            applyHsv({ ...hsvRef.current, h: x * HUE_MAX });
        }
    }, [applyHsv]);

    const flushPendingMove = useCallback(() => {
        rafIdRef.current = null;
        if (latestPointRef.current) updateFromPoint(latestPointRef.current);
    }, [updateFromPoint]);

    const startDragging = (kind, elementRef) => (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        draggingRef.current = kind;
        dragRectRef.current = elementRef.current.getBoundingClientRect();
        updateFromPoint(event);
    };

    const handlePointerMove = (kind) => (event) => {
        if (draggingRef.current !== kind) return;
        latestPointRef.current = { clientX: event.clientX, clientY: event.clientY };
        if (rafIdRef.current === null) rafIdRef.current = window.requestAnimationFrame(flushPendingMove);
    };

    const stopDragging = (event) => {
        if (!draggingRef.current) return;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        draggingRef.current = null;
        dragRectRef.current = null;
        latestPointRef.current = null;
        if (rafIdRef.current !== null) {
            window.cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
        flushCommit();
    };

    const dragProps = (kind, elementRef) => ({
        onPointerDown: startDragging(kind, elementRef),
        onPointerMove: handlePointerMove(kind),
        onPointerUp: stopDragging,
        onPointerCancel: stopDragging,
    });

    const handleSaturationKeyDown = (event) => {
        const delta = SATURATION_KEY_DELTAS[event.key];
        if (!delta) return;
        event.preventDefault();
        applyHsv({
            ...hsvRef.current,
            s: clamp(hsvRef.current.s + delta.s, 0, PERCENT_MAX),
            v: clamp(hsvRef.current.v + delta.v, 0, PERCENT_MAX),
        });
        flushCommit();
    };

    const handleHueKeyDown = (event) => {
        const delta = HUE_KEY_DELTAS[event.key];
        if (delta === undefined) return;
        event.preventDefault();
        applyHsv({ ...hsvRef.current, h: clamp(hsvRef.current.h + delta, 0, HUE_MAX) });
        flushCommit();
    };

    const setDraft = (key, draft) => setDrafts((prev) => ({ ...prev, [key]: draft }));
    const setError = (key, message) => setErrors((prev) => ({ ...prev, [key]: message }));

    const handleHexChange = (raw) => {
        const draft = raw.toUpperCase().replace(/[^#0-9A-F]/g, '');
        setDraft('hex', draft);
        if (!isValidHex(draft)) return setError('hex', text.invalidHex);
        setError('hex', '');
        applyHsv(hexToHsv(draft), COLOR_FORMATS.HEX);
    };

    const handleChannelChange = (kind, parse, invalidMessage) => (channel, raw) => {
        const nextDraft = { ...drafts[kind], [channel]: raw.replace(/\D/g, '') };
        setDraft(kind, nextDraft);
        const parsed = parse(nextDraft);
        if (!parsed) return setError(kind, invalidMessage);
        setError(kind, '');
        applyHsv(parsed, kind === 'rgb' ? COLOR_FORMATS.RGB : COLOR_FORMATS.HSL);
    };

    const handleRgbChange = handleChannelChange('rgb', parseRgbDraft, text.invalidRgb);
    const handleHslChange = handleChannelChange('hsl', parseHslDraft, text.invalidHsl);

    // Al salir de un campo con error se restaura el último color válido.
    const restoreOnBlur = (kind) => () => {
        if (!errors[kind]) return;
        setDraft(kind, draftsFromHsv(hsvRef.current)[kind]);
        setError(kind, '');
    };

    const handleFormatChange = (nextFormat) => {
        setFormat(nextFormat);
        setDrafts(draftsFromHsv(hsvRef.current));
        setErrors(EMPTY_ERRORS);
    };

    const renderChannels = (kind, keys, onChangeChannel) => (
        <div className={styles.channelsRow}>
            {keys.map((channel) => (
                <div className={styles.channelField} key={channel}>
                    <Input
                        {...inputColors}
                        label={text.channels[channel]}
                        max={CHANNEL_MAX[channel]}
                        min={0}
                        numeric
                        onBlur={restoreOnBlur(kind)}
                        onChange={(event) => onChangeChannel(channel, String(event.target.value))}
                        slotProps={{ htmlInput: { maxLength: 3 } }}
                        sx={fieldSx(Boolean(errors[kind]))}
                        value={drafts[kind][channel]}
                    />
                </div>
            ))}
        </div>
    );

    const activeError = errors[format.toLowerCase()];

    return (
        <div className={styles.panel}>
            <div
                aria-label={text.saturation}
                aria-valuemax={PERCENT_MAX}
                aria-valuemin={0}
                aria-valuenow={Math.round(hsv.s)}
                className={styles.saturationArea}
                onKeyDown={handleSaturationKeyDown}
                ref={saturationRef}
                role="slider"
                style={{ backgroundColor: `hsl(${Math.round(hsv.h)}, 100%, 50%)`, backgroundImage: SATURATION_OVERLAY_BACKGROUND }}
                tabIndex={0}
                {...dragProps('saturation', saturationRef)}
            >
                <span
                    className={styles.saturationThumb}
                    style={{ '--swatch-color': hex, left: `${hsv.s}%`, top: `${PERCENT_MAX - hsv.v}%` }}
                />
            </div>

            <div
                aria-label={text.hue}
                aria-valuemax={HUE_MAX}
                aria-valuemin={0}
                aria-valuenow={Math.round(hsv.h)}
                className={styles.hueTrack}
                onKeyDown={handleHueKeyDown}
                ref={hueRef}
                role="slider"
                style={{ backgroundImage: HUE_TRACK_BACKGROUND }}
                tabIndex={0}
                {...dragProps('hue', hueRef)}
            >
                <span className={styles.hueThumb} style={{ left: `${(hsv.h / HUE_MAX) * PERCENT_MAX}%` }} />
            </div>

            <div className={styles.formatRow}>
                {COLOR_FORMAT_OPTIONS.map((option) => (
                    <Button
                        fullWidth
                        key={option}
                        onClick={() => handleFormatChange(option)}
                        size="small"
                        variant={format === option ? 'primary' : 'ghost'}
                    >
                        {option}
                    </Button>
                ))}
            </div>

            <div className={styles.valueRow}>
                <span className={styles.preview} style={{ '--swatch-color': hex }} />
                {format === COLOR_FORMATS.HEX && (
                    <Input
                        {...inputColors}
                        onBlur={restoreOnBlur('hex')}
                        onChange={(event) => handleHexChange(event.target.value)}
                        slotProps={{ htmlInput: { maxLength: 7, spellCheck: false, 'aria-invalid': Boolean(errors.hex) } }}
                        sx={{ ...fieldSx(Boolean(errors.hex)), '& .MuiInputBase-input': { padding: '6px 10px', textTransform: 'uppercase' } }}
                        value={drafts.hex}
                    />
                )}
                {format === COLOR_FORMATS.RGB && renderChannels('rgb', RGB_CHANNEL_KEYS, handleRgbChange)}
                {format === COLOR_FORMATS.HSL && renderChannels('hsl', HSL_CHANNEL_KEYS, handleHslChange)}
            </div>

            {activeError && <span className={styles.error} role="alert">{activeError}</span>}
        </div>
    );
};

export default ColorPickerPanel;
