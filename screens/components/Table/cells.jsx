import React, { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import Button from '../Button';
import Swich from '../Swich/index';
import Checks from '../Checks/index';
import Input from '../Input/index';
import Selector from '../Material-UI/Components/Selector/index';
import AnchoredCalendar from '../CalendarPicker/components/AnchoredCalendar/index';
import { formatDateValue } from './utils';

// Las celdas interactivas viven dentro de una fila que puede ser clicable/expandible: el click
// no debe burbujear a la fila.
const stop = (e) => e.stopPropagation();

const resolve = (value, row) => (typeof value === 'function' ? value(row) : value);

export function LinkCell({ col, row, value, linkColor }) {
  const href = resolve(col.href, row) ?? (typeof value === 'string' ? value : undefined);
  const text = resolve(col.text, row) ?? value;
  if (text === undefined || text === null || text === '') return null;
  return (
    <a
      href={href}
      target={col.target ?? (href ? '_blank' : undefined)}
      rel="noopener noreferrer"
      onClick={(e) => { e.stopPropagation(); col.onClick?.(row, e); }}
      style={{ color: col.linkColor || linkColor || '#2563eb', textDecoration: 'underline' }}
    >
      {text}
    </a>
  );
}

export function ButtonCell({ col, row }) {
  return (
    <Button
      size={Button.SIZES.SMALL}
      variant={Button.VARIANTS.PRIMARY}
      color={Button.COLORS.PRIMARY}
      {...col.buttonProps}
      icon={col.icon}
      disabled={resolve(col.disabled, row) ?? false}
      onClick={(e) => { e.stopPropagation(); col.onClick?.(row, e); }}
    >
      {resolve(col.text, row) ?? col.label}
    </Button>
  );
}

export function SwitchCell({ col, row, value }) {
  return (
    <span onClick={stop} style={{ display: 'inline-flex' }}>
      <Swich
        value={!!value}
        disabled={resolve(col.disabled, row) ?? false}
        showIcons={col.showIcons}
        activeColor={col.activeColor}
        inactiveColor={col.inactiveColor}
        showTooltip={col.showTooltip ?? false}
        onChange={(next) => col.onChange?.(row, next)}
      />
    </span>
  );
}

export function CheckCell({ col, row, value }) {
  return (
    <span onClick={stop} style={{ display: 'inline-flex' }}>
      <Checks
        iconOnly
        checked={!!value}
        disabled={resolve(col.disabled, row) ?? false}
        checkedBgColor={col.checkedBgColor}
        onChange={() => col.onChange?.(row, !value)}
      />
    </span>
  );
}

export function DateCell({ col, value }) {
  return <>{formatDateValue(value, col.format, col.locale)}</>;
}

export function NumberCell({ col, value }) {
  if (value === null || value === undefined || value === '') return null;
  return <>{typeof value === 'number' ? value.toLocaleString(col.locale ?? 'es-AR', col.numberFormat) : value}</>;
}

// Input editable en la celda. Mantiene el texto en estado local (así se puede tipear aunque el
// consumidor no actualice `data` en cada tecla) y avisa con onChange(row, next) en cada cambio;
// se resincroniza cuando cambia el valor de la fila. `inputType: 'number'` usa el Input numérico
// y entrega un número (o undefined si está vacío). `onCommit(row, next)` se llama al salir del campo.
export function InputCell({ col, row, value }) {
  const [text, setText] = useState(value ?? '');
  useEffect(() => { setText(value ?? ''); }, [value]);
  const isNumber = col.inputType === 'number';
  const parse = (raw) => (isNumber ? (raw === '' ? undefined : Number(raw)) : raw);

  return (
    <span onClick={stop} onKeyDown={(e) => e.stopPropagation()} style={{ display: 'block', minWidth: col.minInputWidth ?? 120 }}>
      <Input
        id={`${col.key}-${row[col.rowId ?? 'id'] ?? ''}`}
        numeric={isNumber}
        min={col.min}
        max={col.max}
        showStepper={false}
        type={isNumber ? undefined : (col.inputType || 'text')}
        value={text}
        placeholder={col.placeholder}
        disabled={resolve(col.disabled, row) ?? false}
        error={resolve(col.error, row)}
        bgColor={col.bgColor}
        textColor={col.textColor}
        onChange={(e) => {
          setText(e.target.value);
          col.onChange?.(row, parse(e.target.value));
        }}
        onBlur={(e) => col.onCommit?.(row, parse(e.target.value))}
      />
    </span>
  );
}

// Selector desplegable en la celda. `options`: [{ value, label }]. `selectorProps` (objeto o fn(row))
// se reenvía al Selector: ej. { variant: 'flat', textColor, bgColor } para verlo como badge.
export function SelectCell({ col, row, value }) {
  return (
    <span onClick={stop} style={{ display: 'block', minWidth: col.minInputWidth ?? 140 }}>
      <Selector
        id={`${col.key}-${row[col.rowId ?? 'id'] ?? ''}`}
        options={col.options || []}
        value={value}
        placeholder={col.placeholder}
        disableClearable={col.disableClearable ?? true}
        {...resolve(col.selectorProps, row)}
        onChange={(e) => col.onChange?.(row, e.target.value)}
      />
    </span>
  );
}

// Fecha editable con el CalendarPicker de la librería. La celda muestra la fecha formateada y, al hacer
// click, abre el calendario en un portal anclado a la celda (así no lo recorta el overflow de la tabla).
// `onChange(row, 'YYYY-MM-DD')` ('' si se usa "Borrar"). Props: format, locale, placeholder, disabled, accentColor.
export function DatePickerCell({ col, row, value }) {
  const [rect, setRect] = useState(null);
  const disabled = resolve(col.disabled, row) ?? false;
  const text = formatDateValue(value, col.format, col.locale);

  return (
    <span onClick={stop} style={{ display: 'block', minWidth: col.minInputWidth ?? 120 }}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => setRect(e.currentTarget.getBoundingClientRect())}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', font: 'inherit',
          color: 'inherit', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: 6,
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{ opacity: text ? 1 : 0.5 }}>{text || col.placeholder || 'Elegir fecha'}</span>
        <CalendarDays size={16} style={{ color: '#64748b' }} />
      </button>
      {rect && (
        <AnchoredCalendar
          rect={rect}
          value={value || undefined}
          accentColor={col.accentColor}
          onPick={(next) => { setRect(null); col.onChange?.(row, next); }}
          onClose={() => setRect(null)}
        />
      )}
    </span>
  );
}
