import React, { useMemo } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import {
  DEFAULT_CALENDAR_COLORS,
  DEFAULT_CALENDAR_EMPTY_COLOR,
  DEFAULT_CALENDAR_MONTH_BORDER_COLOR,
  DEFAULT_CALENDAR_DAY_BORDER_COLOR,
} from '../../constants.js';

const NO_TOOLTIP = () => null;
const DEFAULT_TOOLTIP_TEXT_COLOR = '#111827';

// data: [{ day: 'YYYY-MM-DD', value: number }]
export default function NivoCalendarChart({
  data,
  from,
  to,
  colors = DEFAULT_CALENDAR_COLORS,
  emptyColor = DEFAULT_CALENDAR_EMPTY_COLOR,
  monthBorderColor = DEFAULT_CALENDAR_MONTH_BORDER_COLOR,
  dayBorderColor = DEFAULT_CALENDAR_DAY_BORDER_COLOR,
  dayBorderWidth = 2,
  yearSpacing = 40,
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  showLegend = true,
  onDayClick,
  height = 300,
  // Tooltip al pasar sobre un día (default de Nivo: "fecha: valor" con fondo blanco).
  showTooltip = true,
  tooltipBgColor,
  tooltipTextColor,
  tooltipBorderColor,
  tooltipComponent,
  valueFormat,
}) {
  // Colores del tooltip vía theme parcial de Nivo; sin props, queda el theme por default.
  // El fondo default de Nivo es blanco: el texto se fuerza oscuro para no heredar el color claro
  // de un tema oscuro (que lo dejaba ilegible). Con tooltipTextColor se pisa.
  const theme = useMemo(() => {
    const container = {
      color: tooltipTextColor ?? DEFAULT_TOOLTIP_TEXT_COLOR,
      ...(tooltipBgColor ? { background: tooltipBgColor } : {}),
      ...(tooltipBorderColor ? { border: `1px solid ${tooltipBorderColor}` } : {}),
    };
    return { tooltip: { container } };
  }, [tooltipBgColor, tooltipTextColor, tooltipBorderColor]);

  // Solo se pasan `tooltip` y `theme` si el consumidor los define, para no pisar los defaults de Nivo.
  const tooltipProps = {};
  if (!showTooltip) tooltipProps.tooltip = NO_TOOLTIP;
  else if (tooltipComponent) tooltipProps.tooltip = tooltipComponent;
  if (theme) tooltipProps.theme = theme;

  return (
    <div style={{ width: '100%', height, cursor: onDayClick ? 'pointer' : undefined }}>
      <ResponsiveCalendar
        data={data}
        from={from}
        to={to}
        colors={colors}
        emptyColor={emptyColor}
        margin={margin}
        yearSpacing={yearSpacing}
        monthBorderColor={monthBorderColor}
        dayBorderWidth={dayBorderWidth}
        dayBorderColor={dayBorderColor}
        onClick={onDayClick}
        {...(valueFormat !== undefined ? { valueFormat } : {})}
        {...tooltipProps}
        legends={
          showLegend
            ? [
                {
                  anchor: 'bottom-right',
                  direction: 'row',
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 42,
                  itemHeight: 36,
                  itemsSpacing: 14,
                  itemDirection: 'right-to-left',
                },
              ]
            : []
        }
      />
    </div>
  );
}
