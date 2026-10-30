import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths, subMonths, isSameDay, isBefore, setMonth, setYear } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import styles from './index.module.css';
import TextField from '../Material-UI/Components/TextField/index';
import { RANGE_HINTS, BUTTONS } from './Constants';
import { parseValueToDate, getDaysForMonth } from './utils';
import { CalendarGrid, AgendaGrid } from './components/index.js';

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
  accentColor,
  bgColor,
  textColor,
  mutedColor,
  mutedBgColor,
  borderColor,
  hoverColor,
  holidayColor,
  holidayBorderColor,
  tooltipBgColor,
  tooltipTextColor,
  moonPhaseColor,
  selectorsPopperZIndex,
  variant = 'popover',
  showFooter = true,
  renderDay,
  country,
  showHolidays,
  extraHolidays,
  showMoonPhases,
  className = '',
  style
}) => {
  const isInline = variant === 'inline';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showSelectors, setShowSelectors] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [dragStartDay, setDragStartDay] = useState(null);
  // En vez de un flip binario izquierda/derecha (que asume que alguno de los
  // dos anclajes fijos siempre entra), se calcula un offset horizontal en px
  // que clampea el popover dentro del viewport — cubre también el caso de un
  // contenedor angosto donde ni anclarlo a left:0 ni a right:0 del input
  // alcanza para que quepa completo (ver bug: popover desbordando el borde
  // derecho de la pantalla dentro de una card angosta).
  const [popoverOffsetX, setPopoverOffsetX] = useState(0);
  const dragStateRef = useRef({ didDrag: false, hoveredDay: null });
  const wrapperRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (isInline || !isOpen || !wrapperRef.current) return undefined;

    const VIEWPORT_MARGIN = 8;

    const reposition = () => {
      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const popoverWidth = popoverRef.current?.offsetWidth || 320;

      // Por default el popover nace alineado a left:0 del wrapper (offset 0).
      // Si eso lo desborda por la derecha del viewport, se desplaza hacia la
      // izquierda lo justo y necesario para que su borde derecho quede
      // dentro del viewport (con margen), sin que eso lo saque por la
      // izquierda tampoco — si el contenedor es más angosto que el popover,
      // se prioriza no desbordar por la izquierda (offset mínimo = -wrapperRect.left + margin).
      const rightOverflow = wrapperRect.left + popoverWidth - (window.innerWidth - VIEWPORT_MARGIN);
      let offset = rightOverflow > 0 ? -rightOverflow : 0;
      const minOffset = -wrapperRect.left + VIEWPORT_MARGIN;
      if (offset < minOffset) offset = minOffset;

      setPopoverOffsetX(offset);
    };

    reposition();
    window.addEventListener('resize', reposition);
    return () => window.removeEventListener('resize', reposition);
  }, [isOpen]);

  const isPopoverOpen = isInline || isOpen;

  const rangeValue = range && value && typeof value === 'object' ? value : { start: '', end: '' };
  const rangeStart = range ? parseValueToDate(rangeValue.start) : null;
  const rangeEnd = range ? parseValueToDate(rangeValue.end) : null;
  const selectedDate = !range ? parseValueToDate(value) : null;

  useEffect(() => {
    if (isInline || !isOpen) return undefined;
    const anchorDate = range ? (rangeStart || rangeEnd) : selectedDate;
    if (anchorDate) setCurrentDate(anchorDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isPopoverOpen) {
      setHoveredDay(null);
      setDragStartDay(null);
      dragStateRef.current = { didDrag: false, hoveredDay: null };
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    if (isInline || !isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowSelectors(false);
      }
    };
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowSelectors(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInline, isOpen]);

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
      if (!isInline) setIsOpen(false);
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
    if (!isInline) setIsOpen(false);
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
        if (!isInline) setIsOpen(false);
      }
      setDragStartDay(null);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, dragStartDay, isInline]);

  const handleSetToday = () => {
    const today = new Date();
    setCurrentDate(today);
    handleDateClick(today);
  };

  const handleClear = () => {
    emitChange(range ? { start: '', end: '' } : '');
    if (!isInline) setIsOpen(false);
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

  const { monthStart, days } = getDaysForMonth(safeDate);

  const displayText = range
    ? [rangeStart && format(rangeStart, 'dd/MM/yyyy'), rangeEnd && format(rangeEnd, 'dd/MM/yyyy')].filter(Boolean).join(' – ')
    : (selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '');

  const rangeHint = range && rangeStart && !rangeEnd ? RANGE_HINTS.END : RANGE_HINTS.START;

  const colorVars = {
    ...(selectedColor ? { '--cp-selected': selectedColor } : {}),
    ...(accentColor ? { '--cp-accent': accentColor } : {}),
  };

  if (isInline) {
    return (
      <div className={`${styles.inlineWrapper} ${className}`.trim()} style={{ ...colorVars, ...style }}>
        <AgendaGrid
          currentDate={safeDate}
          monthStart={monthStart}
          days={days}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSetToday={handleSetToday}
          todayLabel={BUTTONS.TODAY}
          range={range}
          selectedDate={selectedDate}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          dragStartDay={dragStartDay}
          hoveredDay={hoveredDay}
          onDayMouseLeave={() => setHoveredDay(null)}
          onDayClick={handleDateClick}
          onDayMouseDown={handleDayMouseDown}
          onDayMouseEnter={handleDayMouseEnter}
          renderDay={renderDay}
          country={country}
          showHolidays={showHolidays}
          extraHolidays={extraHolidays}
          holidayColor={holidayColor}
          holidayBorderColor={holidayBorderColor}
          tooltipBgColor={tooltipBgColor}
          tooltipTextColor={tooltipTextColor}
          showMoonPhases={showMoonPhases}
          moonPhaseColor={moonPhaseColor}
          bgColor={bgColor}
          textColor={textColor}
          mutedColor={mutedColor}
          mutedBgColor={mutedBgColor}
          borderColor={borderColor}
          hoverColor={hoverColor}
        />
      </div>
    );
  }

  const grid = (
    <CalendarGrid
      currentDate={safeDate}
      monthStart={monthStart}
      days={days}
      showSelectors={showSelectors}
      onToggleSelectors={() => setShowSelectors(!showSelectors)}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onMonthChange={handleMonthChange}
      onYearChange={handleYearChange}
      onConfirmSelectors={() => setShowSelectors(false)}
      range={range}
      rangeHint={rangeHint}
      selectedDate={selectedDate}
      rangeStart={rangeStart}
      rangeEnd={rangeEnd}
      dragStartDay={dragStartDay}
      hoveredDay={hoveredDay}
      onDayMouseLeave={() => setHoveredDay(null)}
      onDayClick={handleDateClick}
      onDayMouseDown={handleDayMouseDown}
      onDayMouseEnter={handleDayMouseEnter}
      onClear={handleClear}
      onSetToday={handleSetToday}
      showFooter={showFooter}
      accentColor={accentColor}
      selectedColor={selectedColor}
      country={country}
      showHolidays={showHolidays}
      extraHolidays={extraHolidays}
      holidayBorderColor={holidayBorderColor}
      tooltipBgColor={tooltipBgColor}
      tooltipTextColor={tooltipTextColor}
      showMoonPhases={showMoonPhases}
      moonPhaseColor={moonPhaseColor}
      selectorsPopperZIndex={selectorsPopperZIndex}
    />
  );

  return (
    <div
      ref={wrapperRef}
      className={`${styles.inputGroup} ${className}`.trim()}
      onClick={(e) => e.stopPropagation()}
      style={style}
    >
      <TextField
        label={label}
        value={displayText}
        readOnly
        autoComplete="off"
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
        <div
          ref={popoverRef}
          className={styles.calendarPopover}
          style={{
            ...colorVars,
            transform: popoverOffsetX ? `translateX(${popoverOffsetX}px)` : undefined,
          }}
        >
          {grid}
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
