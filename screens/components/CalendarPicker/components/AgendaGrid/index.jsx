import React, { useMemo } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './index.module.css';
import Button from '../../../Button/index';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import { WEEKDAYS_ABBR, BUTTONS } from '../../Constants';
import { isDayInRange, isDaySame, getHolidaysMap, getMoonPhase } from '../../utils';
import { MOON_PHASE_ICONS } from '../moonPhaseIcons';

// Vista de calendario mensual tipo "hoja de agenda": celdas rectangulares con
// el número arriba-izquierda y un slot opcional para contenido (eventos) por
// día, en vez de los círculos chicos del popover (CalendarGrid). Pensado para
// ocupar el ancho completo de un container, no para abrir sobre un input.
const AgendaGrid = ({
  currentDate,
  monthStart,
  days,
  onPrevMonth,
  onNextMonth,
  onSetToday,
  todayLabel = BUTTONS.TODAY,
  range,
  selectedDate,
  rangeStart,
  rangeEnd,
  dragStartDay,
  hoveredDay,
  onDayMouseLeave,
  onDayClick,
  onDayMouseDown,
  onDayMouseEnter,
  renderDay,
  country,
  showHolidays = Boolean(country),
  extraHolidays,
  holidayColor,
  holidayBorderColor,
  tooltipBgColor,
  tooltipTextColor,
  showMoonPhases = false,
  moonPhaseColor,
  bgColor,
  textColor,
  mutedColor,
  mutedBgColor,
  borderColor,
  hoverColor,
  className = '',
  style,
}) => {
  const colorVars = {
    ...(bgColor ? { '--cp-agenda-bg': bgColor } : {}),
    ...(textColor ? { '--cp-agenda-text': textColor } : {}),
    ...(mutedColor ? { '--cp-agenda-muted': mutedColor, '--cp-agenda-year': mutedColor } : {}),
    ...(mutedBgColor ? { '--cp-agenda-muted-bg': mutedBgColor } : {}),
    ...(borderColor ? { '--cp-agenda-border': borderColor } : {}),
    ...(hoverColor ? { '--cp-agenda-hover': hoverColor } : {}),
    ...(holidayColor ? { '--cp-agenda-holiday': holidayColor } : {}),
    ...(holidayBorderColor ? { '--cp-agenda-holiday-border': holidayBorderColor } : {}),
    ...(moonPhaseColor ? { '--cp-agenda-moon': moonPhaseColor } : {}),
    ...(tooltipBgColor ? { '--cp-agenda-tooltip-bg': tooltipBgColor } : {}),
    ...(tooltipTextColor ? { '--cp-agenda-tooltip-text': tooltipTextColor } : {}),
  };

  // Se recalcula solo cuando cambia el mes visible (currentDate), el país o
  // los feriados custom — no en cada render por hover/selección de día.
  const holidaysMap = useMemo(
    () => (showHolidays ? getHolidaysMap(currentDate, country, extraHolidays) : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showHolidays, country, extraHolidays, currentDate.getFullYear(), currentDate.getMonth()]
  );

  return (
    <div className={`${styles.agendaGrid} ${className}`.trim()} style={{ ...colorVars, ...style }}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.monthName}>{format(currentDate, 'MMMM', { locale: es })}</span>
          <span className={styles.yearName}>{format(currentDate, 'yyyy')}</span>
        </div>

        <div className={styles.navigation}>
          <Button variant="ghost" size="small" circle onClick={onPrevMonth} icon={ChevronLeft} color="inherit" />
          <Button variant="ghost" size="small" onClick={onSetToday} color="inherit">
            {todayLabel}
          </Button>
          <Button variant="ghost" size="small" circle onClick={onNextMonth} icon={ChevronRight} color="inherit" />
        </div>
      </div>

      <div className={styles.weekDaysRow}>
        {WEEKDAYS_ABBR.map((day) => (
          <div key={day} className={styles.weekDayName}>{day}</div>
        ))}
      </div>

      <div className={styles.daysGrid} onMouseLeave={onDayMouseLeave}>
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          let cellClassName = styles.dayCell;
          let isSelected = false;

          if (range) {
            const effectiveStart = dragStartDay || rangeStart;
            const effectiveEnd = dragStartDay ? null : rangeEnd;
            const previewEnd = effectiveStart && !effectiveEnd ? hoveredDay : null;

            const isRangeStart = isDaySame(day, effectiveStart);
            const isRangeEnd = isDaySame(day, effectiveEnd);
            const isBetween = isDayInRange(day, effectiveStart, effectiveEnd) || isDayInRange(day, effectiveStart, previewEnd);
            const isPreviewEdge = previewEnd && isDaySame(day, previewEnd);

            isSelected = isRangeStart || isRangeEnd;
            if (isBetween) cellClassName += ` ${styles.inRange}`;
            if (isPreviewEdge) cellClassName += ` ${styles.rangePreviewEdge}`;
          } else {
            isSelected = selectedDate && isSameDay(day, selectedDate);
          }

          const dayHolidays = holidaysMap[format(day, 'yyyy-MM-dd')];
          const moonPhase = showMoonPhases ? getMoonPhase(day) : null;
          const MoonIcon = moonPhase ? MOON_PHASE_ICONS[moonPhase.key] : null;

          if (!isCurrentMonth) cellClassName += ` ${styles.otherMonth}`;
          if (isSelected) cellClassName += ` ${styles.selectedDay}`;
          if (dayHolidays?.length) cellClassName += ` ${styles.isHoliday}`;

          const dayNumberNode = (
            <span className={`${styles.dayNumber} ${isToday ? styles.dayNumberToday : ''}`}>
              {format(day, 'd')}
            </span>
          );

          const extraInfoNode = (dayHolidays?.length || MoonIcon) && (
            <div className={styles.dayExtras}>
              {MoonIcon && (
                <ModalTooltip
                  text={`${moonPhase.label} · ${format(day, 'dd/MM/yyyy')}`}
                  position="bottom"
                  bgColor={tooltipBgColor}
                  textColor={tooltipTextColor}
                  style={{ display: 'inline-flex' }}
                >
                  <MoonIcon size={14} className={styles.moonIcon} />
                </ModalTooltip>
              )}
              {dayHolidays?.map((holiday, holidayIndex) => (
                <ModalTooltip
                  key={holidayIndex}
                  text={holiday.label}
                  position="bottom"
                  bgColor={tooltipBgColor}
                  textColor={tooltipTextColor}
                  style={{ display: 'block', width: '100%', minWidth: 0 }}
                >
                  <span className={styles.holidayLabel}>{holiday.label}</span>
                </ModalTooltip>
              ))}
            </div>
          );

          const cellContent = typeof renderDay === 'function' ? renderDay(day) : null;

          // Sin contenido propio: la celda entera es el Button de la librería
          // (caso más común). Con renderDay (eventos/acciones propias dentro de
          // la celda) un <button> no puede contener otro <button> — ahí la celda
          // es un div y solo el número de día usa Button.
          if (!cellContent) {
            return (
              <Button
                key={index}
                variant="ghost"
                color="inherit"
                disabled={!isCurrentMonth}
                onClick={() => onDayClick(day)}
                onMouseDown={() => onDayMouseDown(day)}
                onMouseEnter={() => onDayMouseEnter(day)}
                className={cellClassName}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  fontWeight: 400,
                }}
              >
                {dayNumberNode}
                {extraInfoNode}
              </Button>
            );
          }

          return (
            <div
              key={index}
              className={cellClassName}
              onClick={() => isCurrentMonth && onDayClick(day)}
              onMouseDown={() => isCurrentMonth && onDayMouseDown(day)}
              onMouseEnter={() => isCurrentMonth && onDayMouseEnter(day)}
            >
              <Button
                variant="ghost"
                size="small"
                circle
                color="inherit"
                disabled={!isCurrentMonth}
                onClick={(e) => {
                  e.stopPropagation();
                  onDayClick(day);
                }}
                className={`${styles.dayNumber} ${isToday ? styles.dayNumberToday : ''}`}
                style={{ alignSelf: 'flex-start' }}
              >
                {format(day, 'd')}
              </Button>
              {extraInfoNode}
              <div className={styles.dayContent}>{cellContent}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaGrid;
