import React from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import {
  DEFAULT_CALENDAR_COLORS,
  DEFAULT_CALENDAR_EMPTY_COLOR,
  DEFAULT_CALENDAR_MONTH_BORDER_COLOR,
  DEFAULT_CALENDAR_DAY_BORDER_COLOR,
} from '../../constants.js';

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
}) {
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
