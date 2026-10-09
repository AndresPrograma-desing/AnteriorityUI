import { startOfMonth, startOfWeek, addDays, isBefore, isAfter, isSameDay } from 'date-fns';

export const parseValueToDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      return new Date(year, month - 1, day);
    }
    const fallbackDate = new Date(value);
    if (!Number.isNaN(fallbackDate.getTime())) {
      return new Date(
        fallbackDate.getUTCFullYear(),
        fallbackDate.getUTCMonth(),
        fallbackDate.getUTCDate()
      );
    }
  }
  return null;
};

// true si `day` cae estrictamente entre `start` y `end` (sin contar los bordes,
// esos se marcan aparte como rangeStart/rangeEnd).
export const isDayInRange = (day, start, end) => {
  if (!start || !end) return false;
  const [from, to] = isBefore(start, end) ? [start, end] : [end, start];
  return isAfter(day, from) && isBefore(day, to);
};

export const isDaySame = (a, b) => Boolean(a && b && isSameDay(a, b));

export const getDaysForMonth = (currentDate) => {
  const monthStart = startOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  
  const days = [];
  let dayCursor = startDate;
  for (let i = 0; i < 42; i++) {
    days.push(dayCursor);
    dayCursor = addDays(dayCursor, 1);
  }
  
  return {
    monthStart,
    days
  };
};
