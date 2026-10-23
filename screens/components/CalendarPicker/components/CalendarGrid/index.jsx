import React, { useMemo } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import styles from './index.module.css';
import Button from '../../../Button/index';
import Selector from '../../../Material-UI/Components/Selector/index';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import { MONTHS, WEEKDAYS, BUTTONS, RANGE_HINTS } from '../../Constants';
import { isDayInRange, isDaySame, getHolidaysMap, getMoonPhase } from '../../utils';
import { MOON_PHASE_ICONS } from '../moonPhaseIcons';

// Grid de calendario puro/controlado (círculos chicos): no guarda estado
// propio, todo llega y sale por props. Lo usa el popover de CalendarPicker
// en modo input. El modo inline/agenda usa AgendaGrid en su lugar.
const CalendarGrid = ({
  currentDate,
  monthStart,
  days,
  showSelectors,
  onToggleSelectors,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onYearChange,
  onConfirmSelectors,
  range,
  rangeHint,
  selectedDate,
  rangeStart,
  rangeEnd,
  dragStartDay,
  hoveredDay,
  onDayMouseLeave,
  onDayClick,
  onDayMouseDown,
  onDayMouseEnter,
  onClear,
  onSetToday,
  showFooter = true,
  accentColor,
  selectedColor,
  country,
  showHolidays = Boolean(country),
  extraHolidays,
  holidayBorderColor,
  showMoonPhases = false,
  moonPhaseColor,
  tooltipBgColor,
  tooltipTextColor,
  className = '',
}) => {
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 110 }, (_, i) => currentYear + 5 - i);

  // Mismo cálculo que AgendaGrid (ver ese componente para el detalle) — acá
  // la celda es un círculo chico de tamaño fijo, así que feriado/fase lunar
  // nunca se muestran como texto/ícono visible permanente (deformarían el
  // círculo): solo un anillo/punto sutil, con el detalle completo revelado
  // al hover vía ModalTooltip.
  const holidaysMap = useMemo(
    () => (showHolidays ? getHolidaysMap(currentDate, country, extraHolidays) : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showHolidays, country, extraHolidays, currentDate.getFullYear(), currentDate.getMonth()]
  );

  return (
    <div className={`${styles.calendarGrid} ${className}`.trim()}>
      <div className={styles.header}>
        <Button
          variant="ghost"
          size="small"
          circle
          onClick={onPrevMonth}
          icon={ChevronLeft}
          color="inherit"
          disabled={showSelectors}
          style={{ visibility: showSelectors ? 'hidden' : 'visible' }}
        />

        <div className={styles.headerTitleContainer} onClick={onToggleSelectors}>
          <span className={styles.monthName}>
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </span>
          <ChevronDown size={14} className={`${styles.dropdownChevron} ${showSelectors ? styles.chevronChevronOpen : ''}`} />
        </div>

        <Button
          variant="ghost"
          size="small"
          circle
          onClick={onNextMonth}
          icon={ChevronRight}
          color="inherit"
          disabled={showSelectors}
          style={{ visibility: showSelectors ? 'hidden' : 'visible' }}
        />
      </div>

      {showSelectors ? (
        <div className={styles.selectorsPanel}>
          <div className={styles.selectorGroup}>
            <Selector
              label="Mes"
              value={currentDate.getMonth()}
              onChange={onMonthChange}
              options={MONTHS.map((m, index) => ({ value: index, label: m }))}
            />
          </div>
          <div className={styles.selectorGroup}>
            <Selector
              label="Año"
              value={currentDate.getFullYear()}
              onChange={onYearChange}
              options={years.map(y => ({ value: y, label: String(y) }))}
            />
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={onConfirmSelectors}
            color={selectedColor || 'var(--cp-selected, #6366f1)'}
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

          <div className={styles.daysGrid} onMouseLeave={onDayMouseLeave}>
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

              const dayHolidays = holidaysMap[format(day, 'yyyy-MM-dd')];
              const moonPhase = showMoonPhases ? getMoonPhase(day) : null;
              const MoonIcon = moonPhase ? MOON_PHASE_ICONS[moonPhase.key] : null;

              if (dayHolidays?.length) dayClassName += ` ${styles.hasHoliday}`;

              const dayCell = (
                <div
                  key={index}
                  className={dayClassName}
                  onClick={() => isCurrentMonth && onDayClick(day)}
                  onMouseDown={() => isCurrentMonth && onDayMouseDown(day)}
                  onMouseEnter={() => isCurrentMonth && onDayMouseEnter(day)}
                  style={holidayBorderColor ? { '--cp-holiday-border': holidayBorderColor } : undefined}
                >
                  {format(day, 'd')}
                  {MoonIcon && (
                    <span className={styles.moonDot} style={moonPhaseColor ? { '--cp-moon-dot': moonPhaseColor } : undefined} />
                  )}
                </div>
              );

              if (!dayHolidays?.length && !MoonIcon) {
                return dayCell;
              }

              const tooltipParts = [
                ...(dayHolidays || []).map((h) => h.label),
                ...(MoonIcon ? [moonPhase.label] : []),
              ];

              return (
                <ModalTooltip
                  key={index}
                  text={tooltipParts.join(' · ')}
                  position="top"
                  bgColor={tooltipBgColor}
                  textColor={tooltipTextColor}
                  style={{ display: 'inline-flex', margin: 'auto' }}
                >
                  {dayCell}
                </ModalTooltip>
              );
            })}
          </div>
        </>
      )}

      {showFooter && (
        <div className={styles.footer}>
          <Button
            variant="ghost"
            size="small"
            onClick={onClear}
            color="inherit"
          >
            {BUTTONS.CLEAR}
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={onSetToday}
            color={accentColor || 'var(--cp-accent, #6366f1)'}
          >
            {BUTTONS.TODAY}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
