import { startOfMonth, startOfWeek, addDays, isBefore, isAfter, isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { MOON_PHASES } from './Constants';

// date-holidays no trae caché propia entre renders — una instancia por país
// alcanza para toda la vida de la app (los datos de reglas de feriados son
// estáticos), así que se memoiza por código de país en vez de recrear la
// instancia en cada cálculo de mes.
const holidaysInstanceCache = new Map();

const getHolidaysInstance = (country) => {
  if (!country) return null;
  if (!holidaysInstanceCache.has(country)) {
    const hd = new Holidays();
    try {
      hd.init(country, { types: ['public', 'bank', 'school', 'optional', 'observance'] });
    } catch {
      // Código de país inválido/no soportado por date-holidays: se cachea
      // igual como `null` para no reintentar el init en cada render.
      holidaysInstanceCache.set(country, null);
      return null;
    }
    holidaysInstanceCache.set(country, hd);
  }
  return holidaysInstanceCache.get(country);
};

// Mapa { 'yyyy-MM-dd': [{ label, type }] } de feriados/efemérides oficiales
// de `country` (código ISO 3166-1, ej. "AR", "US") para el año de `monthDate`,
// combinado con `extraHolidays` (mismo shape) para fechas que date-holidays
// no cubre (ej. efemérides internacionales puntuales como un día mundial
// específico). `extraHolidays` puede traer también fechas de años distintos
// al de `monthDate` — esta función ya filtra implícitamente por cómo el
// caller arma las keys, no hace falta year-matching acá.
export const getHolidaysMap = (monthDate, country, extraHolidays) => {
  const map = {};

  const hd = getHolidaysInstance(country);
  if (hd) {
    const year = monthDate.getFullYear();
    // date-holidays no pagina por mes: trae el año completo (barato, son
    // listas cortas) y acá se indexa por fecha para lookup O(1) por celda.
    const list = [
      ...hd.getHolidays(year - 1),
      ...hd.getHolidays(year),
      ...hd.getHolidays(year + 1),
    ];
    list.forEach((holiday) => {
      const key = holiday.date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push({ label: holiday.name, type: holiday.type });
    });
  }

  if (extraHolidays && typeof extraHolidays === 'object') {
    Object.entries(extraHolidays).forEach(([key, entries]) => {
      const normalized = Array.isArray(entries) ? entries : [entries];
      if (!map[key]) map[key] = [];
      map[key].push(...normalized.map((entry) => (
        typeof entry === 'string' ? { label: entry, type: 'custom' } : entry
      )));
    });
  }

  return map;
};

const SYNODIC_MONTH_DAYS = 29.530588853;
// Luna nueva de referencia conocida (6 de enero de 2000, 18:14 UTC) — cualquier
// otra fecha se ubica dentro del ciclo sinódico contando días transcurridos
// desde esta referencia y tomando el resto módulo el período del ciclo.
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

// Fase lunar aproximada para `date` (±1 día de margen de error, suficiente
// para mostrar un ícono por día; no reemplaza una efeméride astronómica
// oficial). Devuelve una entrada de MOON_PHASES ({ key, label }); el
// componente mapea `key` a un ícono de react-icons/wi.
export const getMoonPhase = (date) => {
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const cyclePosition = ((daysSinceNewMoon % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  const phaseIndex = Math.round(cyclePosition / (SYNODIC_MONTH_DAYS / 8)) % 8;
  return MOON_PHASES[phaseIndex];
};

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
