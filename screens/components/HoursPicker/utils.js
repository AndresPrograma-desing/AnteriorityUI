export const parseTimeTo12h = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const h24 = value.getHours();
    const m = value.getMinutes();
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return { hours: h12, minutes: m, period };
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const match = value.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      const h24 = Number(match[1]);
      const m = Number(match[2]);
      if (!Number.isNaN(h24) && !Number.isNaN(m) && h24 >= 0 && h24 <= 23 && m >= 0 && m <= 59) {
        const period = h24 >= 12 ? 'PM' : 'AM';
        let h12 = h24 % 12;
        if (h12 === 0) h12 = 12;
        return { hours: h12, minutes: m, period };
      }
    }
  }

  return { hours: 12, minutes: 0, period: 'AM' };
};

export const format12hTo24h = (hours, minutes, period) => {
  let h24 = Number(hours);
  if (period === 'PM' && h24 !== 12) h24 += 12;
  if (period === 'AM' && h24 === 12) h24 = 0;
  
  const formattedHours = String(h24).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
};

export const getCurrentTime12h = () => {
  const now = new Date();
  return parseTimeTo12h(now);
};

// Formatea un valor guardado ("HH:MM" 24h o Date) a texto 12h, sin depender
// del estado "en edición" del wheel — se usa para el texto del TextField
// (cerrado) y para el resumen de rango (inicio/fin son independientes).
export const formatStoredTime = (value) => {
  if (!value) return '';
  const { hours, minutes, period } = parseTimeTo12h(value);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
};

// Equivalentes en formato 24h (sin AM/PM) para la prop format24h.
export const parseTimeTo24h = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return { hours: value.getHours(), minutes: value.getMinutes() };
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const match = value.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return { hours, minutes };
      }
    }
  }

  return { hours: 0, minutes: 0 };
};

export const format24hToStorage = (hours, minutes) =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

export const getCurrentTime24h = () => {
  const now = new Date();
  return parseTimeTo24h(now);
};

export const formatStoredTime24h = (value) => {
  if (!value) return '';
  const { hours, minutes } = parseTimeTo24h(value);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
