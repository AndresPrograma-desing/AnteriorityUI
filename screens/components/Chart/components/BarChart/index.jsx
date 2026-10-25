import React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, Label, LabelList, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import {
  DEFAULT_LINE_COLORS,
  DEFAULT_GRID_COLOR,
  DEFAULT_AXIS_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TOOLTIP_BG_COLOR,
  DEFAULT_TOOLTIP_BORDER_COLOR,
} from '../../constants.js';

// data: [{ [xKey]: ..., [bars[i].dataKey]: number, color? }] — `color` por item pisa el
// color de la serie en esa barra puntual (ej. cada planeta con su propio color en una
// única serie `massKg`).
// bars: [{ dataKey, name?, color?, unit? }]
export default function BarChart({
  data,
  bars,
  xKey = 'name',
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  gridColor = DEFAULT_GRID_COLOR,
  axisColor = DEFAULT_AXIS_COLOR,
  textColor = DEFAULT_TEXT_COLOR,
  tooltipBgColor = DEFAULT_TOOLTIP_BG_COLOR,
  tooltipBorderColor = DEFAULT_TOOLTIP_BORDER_COLOR,
  tooltipTextColor,
  legendTextColor,
  yDomain,
  yLabel,
  yAxisWidth,
  xTickFormatter,
  yTickFormatter,
  xAxisLabel,
  labelColor,
  height = 300,
}) {
  return (
    <RechartsBarChart
      style={{ width: '100%', height }}
      responsive
      data={data}
      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
    >
      {showGrid && <CartesianGrid stroke={gridColor} />}
      <XAxis dataKey={xKey} tickFormatter={xTickFormatter} stroke={axisColor} tick={{ fill: textColor }}>
        {xAxisLabel && (
          <Label value={xAxisLabel} position="insideBottomRight" offset={-10} fill={textColor} />
        )}
      </XAxis>
      <YAxis
        domain={yDomain}
        allowDataOverflow={Boolean(yDomain)}
        width={yAxisWidth}
        tickFormatter={yTickFormatter}
        stroke={axisColor}
        tick={{ fill: textColor }}
      >
        {yLabel && (
          <Label value={yLabel} position="insideLeft" angle={-90} dx={0} dy={20} fill={textColor} />
        )}
      </YAxis>
      {showTooltip && (
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBgColor,
            border: `1px solid ${tooltipBorderColor}`,
            borderRadius: 8,
          }}
          labelStyle={{ color: textColor, fontWeight: 'bold' }}
          itemStyle={tooltipTextColor ? { color: tooltipTextColor } : undefined}
        />
      )}
      {showLegend && (
        <Legend labelStyle={legendTextColor ? { color: legendTextColor } : undefined} />
      )}
      {bars.map((bar, index) => {
        const seriesColor = bar.color || DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length];
        return (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name} unit={bar.unit} fill={seriesColor} isAnimationActive={false}>
            {data.map((entry, entryIndex) => (
              <Cell key={entryIndex} fill={entry.color || seriesColor} />
            ))}
            {bar.showValueLabel && (
              <LabelList
                dataKey={bar.dataKey}
                position="top"
                formatter={bar.labelFormatter}
                fill={labelColor || textColor}
                fontSize={11}
              />
            )}
          </Bar>
        );
      })}
    </RechartsBarChart>
  );
}
