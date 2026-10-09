import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, isSameDay, isSameMonth, isBefore, setMonth, setYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarDays, X, ChevronDown } from 'lucide-react';
import styles from './index.module.css';
import TextField from '../Material-UI/Components/TextField/index';
import Frame from '../Frame/index';
import Button from '../Button/index';
import Selector from '../Material-UI/Components/Selector/index';
import { MONTHS, WEEKDAYS, BUTTONS, RANGE_HINTS } from './Constants';
import { parseValueToDate, getDaysForMonth, isDayInRange, isDaySame } from './utils';

const CalendarPicker = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  range = false,
  inputSx,
  selectedColor,
  accentColor
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showSelectors, setShowSelectors] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [dragStartDay, setDragStartDay] = useState(null);
  const dragStateRef = useRef({ didDrag: false, hoveredDay: null });

  const rangeValue = range && value && typeof value === 'object' ? value : { start: '', end: '' };
  const rangeStart = range ? parseValueToDate(rangeValue.start) : null;
  const rangeEnd = range ? parseValueToDate(rangeValue.end) : null;
  const selectedDate = !range ? parseValueToDate(value) : null;

  useEffect(() => {
    if (!isOpen) {
      setHoveredDay(null);
      setDragStartDay(null);
      dragStateRef.current = { didDrag: false, hoveredDay: null };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowSelectors(false);
      }
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

  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const emitChange = (nextValue) => {
    if (typeof onChange !== 'function') return;
    onChange({
      target: {
        name,
        value: nextValue,
        type: range ? 'date-range' : 'date',
      },
    });
  };

  const toIsoDate = (day) => {
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateClick = (day) => {
    if (!range) {
      emitChange(toIsoDate(day));
      setIsOpen(false);
      return;
    }

    // Sin inicio, o rango ya completo: arranca un rango nuevo en este día.
    if (!rangeStart || (rangeStart && rangeEnd)) {
      emitChange({ start: toIsoDate(day), end: '' });
      return;
    }

    // Click antes del inicio: reinicia el rango desde este día.
    if (isBefore(day, rangeStart)) {
      emitChange({ start: toIsoDate(day), end: '' });
      return;
    }

    emitChange({ start: toIsoDate(rangeStart), end: toIsoDate(day) });
    setIsOpen(false);
  };

  // Arrastre con mouse: mousedown ancla el inicio, mouseenter va previsualizando
  // el rango (reutiliza el mismo hoveredDay/preview del flujo de dos clicks), y
  // mouseup confirma. Si no hubo movimiento entre down y up (un click simple),
  // no se confirma acá — queda el onClick de siempre, que arranca/confirma de a
  // un día por vez y permite cambiar de mes en el medio sin perder el progreso.
  const handleDayMouseDown = (day) => {
    if (!range) return;
    dragStateRef.current = { didDrag: false, hoveredDay: day };
    setDragStartDay(day);
  };

  const handleDayMouseEnter = (day) => {
    if (!range) return;
    setHoveredDay(day);
    dragStateRef.current.hoveredDay = day;
    if (dragStartDay && !isSameDay(day, dragStartDay)) {
      dragStateRef.current.didDrag = true;
    }
  };

  // El listener se suscribe una sola vez por gesto de arrastre (ancla fija en
  // dragStartDay) y lee hoveredDay/didDrag desde una ref actualizada en cada
  // mouseenter, en vez de depender de ese estado y re-suscribirse en cada hover.
  useEffect(() => {
    if (!range || !dragStartDay) return undefined;
    const handleMouseUp = () => {
      const { didDrag: dragged, hoveredDay: endDay } = dragStateRef.current;
      if (dragged && endDay) {
        const [from, to] = isBefore(dragStartDay, endDay)
          ? [dragStartDay, endDay]
          : [endDay, dragStartDay];
        emitChange({ start: toIsoDate(from), end: toIsoDate(to) });
        setIsOpen(false);
      }
      setDragStartDay(null);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, dragStartDay]);

  const handleSetToday = () => {
    const today = new Date();
    setCurrentDate(today);
    handleDateClick(today);
  };

  const handleClear = () => {
    emitChange(range ? { start: '', end: '' } : '');
    setIsOpen(false);
  };

  const handleMonthChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setCurrentDate(prev => setMonth(prev, val));
    }
  };

  const handleYearChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setCurrentDate(prev => setYear(prev, val));
    }
  };

  const safeDate = currentDate instanceof Date && !isNaN(currentDate.getTime()) ? currentDate : new Date();

  const currentYear = safeDate.getFullYear();
  const years = Array.from({ length: 110 }, (_, i) => currentYear + 5 - i);

  const { monthStart, days } = getDaysForMonth(safeDate);

  const displayText = range
    ? [rangeStart && format(rangeStart, 'dd/MM/yyyy'), rangeEnd && format(rangeEnd, 'dd/MM/yyyy')].filter(Boolean).join(' – ')
    : (selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '');

  const rangeHint = range && rangeStart && !rangeEnd ? RANGE_HINTS.END : RANGE_HINTS.START;

  const headerContent = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid #f8fafc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
      <div className={styles.headerTitleContainer} onClick={() => setShowSelectors(!showSelectors)}>
        <span className={styles.monthName}>
          {format(safeDate, 'MMMM yyyy', { locale: es })}
        </span>
        <ChevronDown size={14} className={`${styles.dropdownChevron} ${showSelectors ? styles.chevronChevronOpen : ''}`} />
      </div>

      <div className={styles.navigation}>
        {!showSelectors && (
          <>
            <Button
              variant="ghost"
              size="small"
              circle
              onClick={handlePrevMonth}
              icon={ChevronLeft}
              color="inherit"
            />
            <Button
              variant="ghost"
              size="small"
              circle
              onClick={handleNextMonth}
              icon={ChevronRight}
              color="inherit"
            />
          </>
        )}
        <Button
          variant="ghost"
          size="small"
          circle
          onClick={() => { setIsOpen(false); setShowSelectors(false); }}
          icon={X}
          color="var(--cancel-button)"
        />
      </div>
    </div>
  );

  return (
    <div className={styles.inputGroup} onClick={(e) => e.stopPropagation()}>
      <TextField
        label={label}
        value={displayText}
        readOnly
        placeholder={range ? 'dd/mm/aaaa – dd/mm/aaaa' : 'dd/mm/aaaa'}
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        required={required}
        {...(inputSx ? { sx: inputSx } : {})}
        slotProps={{
          input: {
            endAdornment: (
              <CalendarDays
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
          onClose={() => { setIsOpen(false); setShowSelectors(false); }}
          className={styles.calendarFrame}
        >
          <div
            style={{
              display: 'contents',
              ...(selectedColor ? { '--cp-selected': selectedColor } : {}),
              ...(accentColor ? { '--cp-accent': accentColor } : {}),
            }}
          >
          {headerContent}

          {showSelectors ? (
            <div className={styles.selectorsPanel}>
              <div className={styles.selectorGroup}>
                <Selector
                  label="Mes"
                  value={currentDate.getMonth()}
                  onChange={handleMonthChange}
                  options={MONTHS.map((m, index) => ({ value: index, label: m }))}
                />
              </div>
              <div className={styles.selectorGroup}>
                <Selector
                  label="Año"
                  value={currentDate.getFullYear()}
                  onChange={handleYearChange}
                  options={years.map(y => ({ value: y, label: String(y) }))}
                />
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowSelectors(false)}
                color={selectedColor || '#0f172a'}
                style={{ marginTop: '0.5rem' }}
              >
                {BUTTONS.CONFIRM}
              </Button>
            </div>
          ) : (
            <>
              {range && <div className={styles.rangeHint}>{rangeHint}</div>}

              <div className={styles.weekDaysGrid}>
                {WEEKDAYS.map(day => (
                  <div key={day} className={styles.weekDayName}>{day}</div>
                ))}
              </div>

              <div className={styles.daysGrid} onMouseLeave={() => setHoveredDay(null)}>
                {days.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isToday = isSameDay(day, new Date());

                  let dayClassName = styles.dayCell;
                  let isSelected = false;

                  if (range) {
                    // Arrastrando: el ancla del drag pisa al inicio ya confirmado (arranca
                    // un rango nuevo). Si no se está arrastrando, es el flujo de dos clicks
                    // normal (inicio confirmado, fin todavía sin confirmar).
                    const effectiveStart = dragStartDay || rangeStart;
                    const effectiveEnd = dragStartDay ? null : rangeEnd;
                    const previewEnd = effectiveStart && !effectiveEnd ? hoveredDay : null;

                    const isRangeStart = isDaySame(day, effectiveStart);
                    const isRangeEnd = isDaySame(day, effectiveEnd);
                    const isBetween = isDayInRange(day, effectiveStart, effectiveEnd) || isDayInRange(day, effectiveStart, previewEnd);
                    const isPreviewEdge = previewEnd && isDaySame(day, previewEnd);

                    isSelected = isRangeStart || isRangeEnd;
                    if (isBetween) dayClassName += ` ${styles.inRange}`;
                    if (isRangeStart) dayClassName += ` ${styles.rangeStart}`;
                    if (isRangeEnd) dayClassName += ` ${styles.rangeEnd}`;
                    if (isPreviewEdge) dayClassName += ` ${styles.rangeEnd} ${styles.rangePreviewEdge}`;
                  } else {
                    isSelected = selectedDate && isSameDay(day, selectedDate);
                  }

                  if (!isCurrentMonth) dayClassName += ` ${styles.otherMonth}`;
                  if (!range && isSelected) dayClassName += ` ${styles.selectedDay}`;
                  if (isToday && !isSelected) dayClassName += ` ${styles.todayDay}`;

                  return (
                    <div
                      key={index}
                      className={dayClassName}
                      onClick={() => isCurrentMonth && handleDateClick(day)}
                      onMouseDown={() => isCurrentMonth && handleDayMouseDown(day)}
                      onMouseEnter={() => isCurrentMonth && handleDayMouseEnter(day)}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className={styles.footer}>
            <Button
              variant="ghost"
              size="small"
              onClick={handleClear}
              color="inherit"
            >
              {BUTTONS.CLEAR}
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleSetToday}
              color={accentColor || 'green'}
            >
              {BUTTONS.TODAY}
            </Button>
          </div>
          </div>
        </Frame>
      )}
    </div>
  );
};

export default CalendarPicker;
