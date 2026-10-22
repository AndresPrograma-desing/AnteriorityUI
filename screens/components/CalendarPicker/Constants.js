export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const WEEKDAYS_ABBR = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const BUTTONS = {
  CLEAR: 'Borrar',
  TODAY: 'Hoy',
  CONFIRM: 'Confirmar Selección'
};

export const RANGE_HINTS = {
  START: 'Seleccioná la fecha de inicio',
  END: 'Seleccioná la fecha de fin',
};

// lucide-react no tiene las 8 fases lunares como íconos distintos (solo un
// ícono de luna genérico) — react-icons/wi (Weather Icons) sí trae las 8 como
// SVG reales; se usa el ícono del medio de cada serie "crescent"/"gibbous"
// (ej. WiMoonWaxingCrescent3 de 5) como representativo de esa fase genérica.
// El componente importa los íconos directamente desde 'react-icons/wi' (no
// quedan acá para no mezclar componentes de ícono con constantes de datos);
// esto solo define el orden/metadata de las 8 fases del ciclo.
export const MOON_PHASES = [
  { key: 'new', label: 'Luna nueva' },
  { key: 'waxing-crescent', label: 'Luna creciente' },
  { key: 'first-quarter', label: 'Cuarto creciente' },
  { key: 'waxing-gibbous', label: 'Gibosa creciente' },
  { key: 'full', label: 'Luna llena' },
  { key: 'waning-gibbous', label: 'Gibosa menguante' },
  { key: 'last-quarter', label: 'Cuarto menguante' },
  { key: 'waning-crescent', label: 'Luna menguante' },
];
