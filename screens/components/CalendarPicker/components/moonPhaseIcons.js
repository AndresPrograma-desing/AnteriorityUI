import {
  WiMoonNew,
  WiMoonWaxingCrescent3,
  WiMoonFirstQuarter,
  WiMoonWaxingGibbous3,
  WiMoonFull,
  WiMoonWaningGibbous3,
  WiMoonThirdQuarter,
  WiMoonWaningCrescent3,
} from 'react-icons/wi';

// Un ícono real de react-icons/wi por cada key de MOON_PHASES (../Constants.js),
// en el mismo orden del ciclo. Compartido entre AgendaGrid y CalendarGrid para
// no duplicar el mapeo (y el import de 8 íconos) en los dos.
export const MOON_PHASE_ICONS = {
  new: WiMoonNew,
  'waxing-crescent': WiMoonWaxingCrescent3,
  'first-quarter': WiMoonFirstQuarter,
  'waxing-gibbous': WiMoonWaxingGibbous3,
  full: WiMoonFull,
  'waning-gibbous': WiMoonWaningGibbous3,
  'last-quarter': WiMoonThirdQuarter,
  'waning-crescent': WiMoonWaningCrescent3,
};
