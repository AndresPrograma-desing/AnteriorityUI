import React, { useState, useEffect, useRef } from 'react';
import { Clock, X } from 'lucide-react';
import styles from './index.module.css';
import TextField from '../Material-UI/Components/TextField/index';
import Frame from '../Frame/index';
import Button from '../Button/index';
import {
    TEXT_HOURS_PICKER,
    HOURS_LIST,
    HOURS_LIST_24,
    MINUTES_LIST,
    QUICK_TIMES
} from './Constants';
import {
    parseTimeTo12h,
    format12hTo24h,
    formatStoredTime,
    getCurrentTime12h,
    parseTimeTo24h,
    format24hToStorage,
    formatStoredTime24h,
    getCurrentTime24h
} from './utils';

const DEFAULT_DRAFT = { hours: 12, minutes: 0, period: 'AM' };
const DEFAULT_DRAFT_24H = { hours: 0, minutes: 0, period: null };

const WheelColumn = ({ items, selected, onSelect, formatItem, accentColor, ariaLabel }) => {
    const itemRefs = useRef({});

    useEffect(() => {
        const node = itemRefs.current[selected];
        if (node) node.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, [selected]);

    return (
        <div className={styles.wheelColumn} role="listbox" aria-label={ariaLabel}>
            {items.map((item) => {
                const isActive = item === selected;
                return (
                    <button
                        key={item}
                        type="button"
                        ref={(node) => { itemRefs.current[item] = node; }}
                        role="option"
                        aria-selected={isActive}
                        className={`${styles.wheelItem} ${isActive ? styles.wheelItemActive : ''}`}
                        style={isActive && accentColor ? { backgroundColor: accentColor } : undefined}
                        onClick={() => onSelect(item)}
                    >
                        {formatItem(item)}
                    </button>
                );
            })}
        </div>
    );
};

const HoursPicker = ({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false,
    range = false,
    format24h = false,
    selectedColor = '#10b981',
    accentColor = '#0f172a'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeBoundary, setActiveBoundary] = useState('start');
    const defaultDraft = format24h ? DEFAULT_DRAFT_24H : DEFAULT_DRAFT;
    const [draft, setDraft] = useState({ start: defaultDraft, end: defaultDraft });
    const parseTime = format24h ? parseTimeTo24h : parseTimeTo12h;

    const rangeValue = range && value && typeof value === 'object' ? value : { start: '', end: '' };

    useEffect(() => {
        if (range) {
            setDraft({
                start: parseTime(rangeValue.start),
                end: parseTime(rangeValue.end),
            });
        } else {
            setDraft((prev) => ({ ...prev, start: parseTime(value) }));
        }
        setActiveBoundary('start');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, isOpen, range, format24h]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const activeDraft = draft[activeBoundary];

    const updateActiveDraft = (patch) => {
        setDraft((prev) => ({ ...prev, [activeBoundary]: { ...prev[activeBoundary], ...patch } }));
    };

    const emitChange = (nextValue) => {
        if (typeof onChange !== 'function') return;
        onChange({
            target: {
                name,
                value: nextValue,
                type: range ? 'time-range' : 'time',
            },
        });
    };

    const formatForStorage = (d) => (format24h ? format24hToStorage(d.hours, d.minutes) : format12hTo24h(d.hours, d.minutes, d.period));

    const handleConfirm = () => {
        if (range) {
            emitChange({
                start: formatForStorage(draft.start),
                end: formatForStorage(draft.end),
            });
        } else {
            emitChange(formatForStorage(activeDraft));
        }
        setIsOpen(false);
    };

    const handleClear = () => {
        emitChange(range ? { start: '', end: '' } : '');
        setIsOpen(false);
    };

    const handleSetNow = () => {
        updateActiveDraft(format24h ? getCurrentTime24h() : getCurrentTime12h());
    };

    const handleQuickPreset = (preset) => {
        if (format24h) {
            updateActiveDraft({ hours: preset.h24, minutes: preset.m });
            return;
        }
        let h12 = preset.h24 % 12;
        if (h12 === 0) h12 = 12;
        const period = preset.h24 >= 12 ? 'PM' : 'AM';
        updateActiveDraft({ hours: h12, minutes: preset.m, period });
    };

    const formatDisplay = format24h ? formatStoredTime24h : formatStoredTime;
    const displayText = range
        ? [formatDisplay(rangeValue.start), formatDisplay(rangeValue.end)].filter(Boolean).join(' – ')
        : formatDisplay(value);

    const headerContent = (
        <div className={styles.header}>
            <span className={styles.modalTitle}>
                {range ? TEXT_HOURS_PICKER.TITLE_RANGE : TEXT_HOURS_PICKER.TITLE}
            </span>
            <Button
                variant="ghost"
                size="small"
                circle
                onClick={() => setIsOpen(false)}
                icon={X}
                color="var(--cancel-button)"
            />
        </div>
    );

    return (
        <div className={styles.inputGroup} onClick={(e) => e.stopPropagation()}>
            <TextField
                label={label}
                value={displayText}
                readOnly
                placeholder={
                    range
                        ? (format24h ? TEXT_HOURS_PICKER.PLACEHOLDER_RANGE_24H : TEXT_HOURS_PICKER.PLACEHOLDER_RANGE)
                        : (format24h ? TEXT_HOURS_PICKER.PLACEHOLDER_24H : TEXT_HOURS_PICKER.PLACEHOLDER)
                }
                onClick={() => !disabled && setIsOpen(true)}
                disabled={disabled}
                required={required}
                slotProps={{
                    input: {
                        endAdornment: (
                            <Clock
                                size={16}
                                style={{ cursor: 'pointer', color: '#64748b' }}
                                onClick={() => !disabled && setIsOpen(true)}
                            />
                        )
                    }
                }}
            />

            {isOpen && (
                <Frame
                    isModal={true}
                    onClose={() => setIsOpen(false)}
                    className={styles.hoursFrame}
                >
                    {headerContent}

                    {range && (
                        <div className={styles.boundaryTabs}>
                            {['start', 'end'].map((boundary) => (
                                <button
                                    key={boundary}
                                    type="button"
                                    className={`${styles.boundaryTab} ${activeBoundary === boundary ? styles.boundaryTabActive : ''}`}
                                    style={activeBoundary === boundary ? { borderColor: accentColor, color: accentColor } : undefined}
                                    onClick={() => setActiveBoundary(boundary)}
                                >
                                    <span className={styles.boundaryTabLabel}>
                                        {boundary === 'start' ? TEXT_HOURS_PICKER.LABEL_START : TEXT_HOURS_PICKER.LABEL_END}
                                    </span>
                                    <span className={styles.boundaryTabValue}>
                                        {String(draft[boundary].hours).padStart(2, '0')}:{String(draft[boundary].minutes).padStart(2, '0')}{!format24h && ` ${draft[boundary].period}`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={styles.timePreview} style={{ color: accentColor }}>
                        {String(activeDraft.hours).padStart(2, '0')}:{String(activeDraft.minutes).padStart(2, '0')}
                        {!format24h && <span className={styles.timePreviewPeriod}>{activeDraft.period}</span>}
                    </div>

                    <div className={styles.wheelsRow}>
                        <WheelColumn
                            items={format24h ? HOURS_LIST_24 : HOURS_LIST}
                            selected={activeDraft.hours}
                            onSelect={(h) => updateActiveDraft({ hours: h })}
                            formatItem={(h) => String(h).padStart(2, '0')}
                            accentColor={selectedColor}
                            ariaLabel="Hora"
                        />
                        <WheelColumn
                            items={MINUTES_LIST}
                            selected={activeDraft.minutes}
                            onSelect={(m) => updateActiveDraft({ minutes: m })}
                            formatItem={(m) => String(m).padStart(2, '0')}
                            accentColor={selectedColor}
                            ariaLabel="Minuto"
                        />
                        {!format24h && (
                        <div className={styles.periodColumn}>
                            {['AM', 'PM'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`${styles.periodButton} ${activeDraft.period === p ? styles.periodButtonActive : ''}`}
                                    style={activeDraft.period === p ? { backgroundColor: accentColor } : undefined}
                                    onClick={() => updateActiveDraft({ period: p })}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        )}
                    </div>

                    <div className={styles.presetsSection}>
                        <div className={styles.presetsTitle}>{TEXT_HOURS_PICKER.QUICK_PRESETS_TITLE}</div>
                        <div className={styles.presetsGrid}>
                            {QUICK_TIMES.map((qt, idx) => {
                                let isActive;
                                if (format24h) {
                                    isActive = activeDraft.hours === qt.h24 && activeDraft.minutes === qt.m;
                                } else {
                                    let h12 = qt.h24 % 12 || 12;
                                    const p = qt.h24 >= 12 ? 'PM' : 'AM';
                                    isActive = activeDraft.hours === h12 && activeDraft.minutes === qt.m && activeDraft.period === p;
                                }
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`${styles.presetButton} ${isActive ? styles.presetButtonActive : ''}`}
                                        style={isActive ? { backgroundColor: selectedColor, borderColor: selectedColor } : undefined}
                                        onClick={() => handleQuickPreset(qt)}
                                    >
                                        {format24h ? format24hToStorage(qt.h24, qt.m) : qt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={handleClear}
                            color="inherit"
                        >
                            {TEXT_HOURS_PICKER.BUTTON_CLEAR}
                        </Button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button
                                variant="ghost"
                                size="small"
                                onClick={handleSetNow}
                                color="green"
                            >
                                {TEXT_HOURS_PICKER.BUTTON_NOW}
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={handleConfirm}
                                color={accentColor}
                            >
                                {TEXT_HOURS_PICKER.BUTTON_CONFIRM}
                            </Button>
                        </div>
                    </div>
                </Frame>
            )}
        </div>
    );
};

export default HoursPicker;
