export const TEXT_HOURS_PICKER = {
  TITLE: 'Seleccionar Hora',
  TITLE_RANGE: 'Seleccionar Rango de Horario',
  PLACEHOLDER: '00:00 AM',
  PLACEHOLDER_RANGE: '00:00 AM – 00:00 PM',
  PLACEHOLDER_24H: '00:00',
  PLACEHOLDER_RANGE_24H: '00:00 – 00:00',
  LABEL_START: 'Inicio',
  LABEL_END: 'Fin',
  QUICK_PRESETS_TITLE: 'Horarios Frecuentes',
  BUTTON_CLEAR: 'Borrar',
  BUTTON_CONFIRM: 'Confirmar',
  BUTTON_NOW: 'Hora Actual',
};

export const HOURS_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const HOURS_LIST_24 = Array.from({ length: 24 }, (_, i) => i);

export const MINUTES_LIST = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export const QUICK_TIMES = [
  { label: '08:00 AM', h24: 8, m: 0 },
  { label: '09:00 AM', h24: 9, m: 0 },
  { label: '10:00 AM', h24: 10, m: 0 },
  { label: '11:00 AM', h24: 11, m: 0 },
  { label: '02:00 PM', h24: 14, m: 0 },
  { label: '03:00 PM', h24: 15, m: 0 },
  { label: '04:00 PM', h24: 16, m: 0 },
  { label: '05:00 PM', h24: 17, m: 0 },
];
