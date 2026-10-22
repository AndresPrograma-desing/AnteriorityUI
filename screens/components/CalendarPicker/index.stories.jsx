import React from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import CalendarPicker from './index';
import Button from '../Button/index';

export default {
  title: 'Components/CalendarPicker',
  component: CalendarPicker,
};

const MOCK_EVENTS = {
  '2026-10-08': [{ label: 'Control Ana Torres', color: '#0ea5e9' }],
  '2026-10-16': [
    { label: 'Turno Carlos Ruiz', color: '#f97316' },
    { label: 'Turno Laura Pérez', color: '#6366f1' },
  ],
  '2026-10-22': [{ label: 'Cirugía programada', color: '#ef4444' }],
};

export const Default = {
  args: {
    label: 'Fecha de nacimiento',
    name: 'birthDate',
    value: '',
    showFooter: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const WithValue = {
  args: {
    label: 'Fecha de la cita',
    name: 'appointmentDate',
    value: '2024-06-15',
    showFooter: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Required = {
  args: {
    label: 'Fecha requerida',
    name: 'requiredDate',
    value: '',
    required: true,
    showFooter: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Disabled = {
  args: {
    label: 'Fecha bloqueada',
    name: 'disabledDate',
    value: '2024-01-01',
    disabled: true,
    showFooter: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Range = {
  args: {
    label: 'Rango de estadía',
    name: 'stayRange',
    range: true,
    value: { start: '', end: '' },
    showFooter: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const RangeWithValue = {
  args: {
    label: 'Período de licencia',
    name: 'licenseRange',
    range: true,
    value: { start: '2024-06-10', end: '2024-06-18' },
    showFooter: true,
    onChange: (e) => console.log('changed', e.target.value),
  },
};

// Sin `showFooter`, el popover no muestra el footer con Borrar/Hoy (default
// false) — solo el grid de días. Útil cuando el consumidor ya tiene sus
// propios controles de limpiar/ir a hoy fuera del calendario.
export const WithoutFooter = {
  args: {
    label: 'Fecha de la cita',
    name: 'noFooterDate',
    value: '2024-06-15',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const Inline = {
  args: {
    name: 'agendaDate',
    variant: 'inline',
    value: '2024-06-15',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const InlineRange = {
  args: {
    name: 'agendaRange',
    variant: 'inline',
    range: true,
    value: { start: '2024-06-10', end: '2024-06-18' },
    onChange: (e) => console.log('changed', e.target.value),
  },
};

export const InlineCustomColor = {
  args: {
    name: 'agendaCustomColor',
    variant: 'inline',
    value: '2024-06-15',
    selectedColor: '#f97316',
    accentColor: '#f97316',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

// Caso real de agenda de citas: cada celda muestra sus eventos (chips) y un
// botón "+" para agregar uno nuevo, vía el slot `renderDay`. Los chips cortan
// la propagación del click para no disparar también la selección del día
// (onDayClick del CalendarPicker). El botón "Agregar" solo se muestra al
// hacer hover de la celda (clase `.addEventTrigger` de abajo, scoped a esta
// story) para no ensuciar visualmente los días sin eventos.
export const InlineWithEvents = {
  args: {
    name: 'agendaWithEvents',
    variant: 'inline',
    value: '2026-10-20',
    onChange: (e) => console.log('changed', e.target.value),
    renderDay: (day) => {
      const key = format(day, 'yyyy-MM-dd');
      const events = MOCK_EVENTS[key] || [];

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
          {events.map((event, index) => (
            <Button
              key={index}
              variant="primary"
              size="small"
              color={event.color}
              onClick={(e) => {
                e.stopPropagation();
                console.log('abrir evento', event.label);
              }}
              style={{
                fontSize: '0.68rem',
                lineHeight: 1.2,
                justifyContent: 'flex-start',
                padding: '3px 6px',
                minWidth: 0,
                width: '100%',
                borderRadius: '4px',
                boxShadow: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {event.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="small"
            icon={Plus}
            color="inherit"
            onClick={(e) => {
              e.stopPropagation();
              console.log('agregar evento el', key);
            }}
            className="addEventTrigger"
            style={{ alignSelf: 'flex-start', fontSize: '0.68rem', padding: '2px 4px', minWidth: 0, opacity: 0 }}
          >
            Agregar
          </Button>
        </div>
      );
    },
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          .addEventTrigger { transition: opacity 0.1s ease; }
          [class*="dayCell"]:hover .addEventTrigger { opacity: 1 !important; }
        `}</style>
        <Story />
      </>
    ),
  ],
};

// Feriados/efemérides oficiales de Argentina (date-holidays) + fases lunares
// por día, ambos activados por prop sin tocar nada de UI a mano.
export const InlineWithHolidaysAndMoonPhases = {
  args: {
    name: 'agendaHolidays',
    variant: 'inline',
    country: 'AR',
    showMoonPhases: true,
    value: '2026-10-20',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

// `extraHolidays` combina efemérides que date-holidays no trae (ej. un día
// mundial puntual) con los feriados oficiales del país.
export const InlineWithCustomHolidays = {
  args: {
    name: 'agendaCustomHolidays',
    variant: 'inline',
    country: 'AR',
    extraHolidays: {
      '2026-10-14': 'Día Mundial de la Normalización',
      '2026-10-16': 'Día Mundial de la Alimentación',
    },
    value: '2026-10-20',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

// El día con feriado/efeméride se marca con un borde de color (rojo por
// default vía `holidayBorderColor`, acá personalizado a violeta) — pasar el
// mouse sobre el nombre truncado o el ícono de luna abre un tooltip con el
// detalle completo (ModalTooltip, vía portal, no se corta por las celdas
// vecinas del grid).
export const InlineWithHolidayBorder = {
  args: {
    name: 'agendaHolidayBorder',
    variant: 'inline',
    country: 'AR',
    showMoonPhases: true,
    holidayBorderColor: '#8b5cf6',
    value: '2026-10-20',
    onChange: (e) => console.log('changed', e.target.value),
  },
};

// Mismo feriado/efeméride/fase lunar, pero en el popover chico (variant
// default). Acá no hay espacio para texto ni íconos visibles dentro del
// círculo de 36px: el feriado se marca con un anillo de color (sin cambiar
// el tamaño del día) y la fase lunar con un punto diminuto — el detalle
// completo (nombre del feriado, fase + fecha) solo se ve al hacer hover
// (ModalTooltip). Abrí el calendario (click en el input) para probarlo.
export const PopoverWithHolidaysAndMoonPhases = {
  args: {
    label: 'Fecha de la cita',
    name: 'popoverHolidays',
    country: 'AR',
    showMoonPhases: true,
    showFooter: true,
    value: '2026-10-20',
    onChange: (e) => console.log('changed', e.target.value),
  },
};
