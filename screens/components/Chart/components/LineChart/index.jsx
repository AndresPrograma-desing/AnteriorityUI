import React from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ReferenceDot,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DEFAULT_LINE_COLORS,
  DEFAULT_GRID_COLOR,
  DEFAULT_AXIS_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TOOLTIP_BG_COLOR,
  DEFAULT_TOOLTIP_BORDER_COLOR,
  DEFAULT_REFERENCE_COLOR,
} from '../../constants.js';

// xTickIcon(value) => pathString (SVG path 'd'), para reemplazar el tick de texto del
// eje X por un ícono vectorial (ej. un logo/ícono por categoría). El viewBox asume un
// path cuadrado estándar de 1024x1024 (convención común de iconsets SVG exportados).
function renderTickIcon(xTickIcon, xTickIconColor, xTickIconSize) {
  return ({ x, y, payload }) => {
    const path = xTickIcon(payload.value);
    if (!path) return null;
    return (
      <svg
        x={x - xTickIconSize / 2}
        y={y + 4}
        width={xTickIconSize}
        height={xTickIconSize}
        viewBox="0 0 1024 1024"
        fill={xTickIconColor}
      >
        <path d={path} />
      </svg>
    );
  };
}

// data: [{ [xKey]: ..., [lines[i].dataKey]: number }]
// lines: [{ dataKey, name?, color?, strokeWidth?, strokeDasharray? }]
export default function LineChart({
  data,
  lines,
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
  referenceLines = [],
  referenceDots = [],
  xType = 'category',
  xTicks,
  xScale = 'auto',
  xTickIcon,
  xTickIconColor,
  xTickIconSize = 24,
  xAxisHeight,
  yTicks,
  yScale = 'auto',
  height = 300,
}) {
  return (
    <RechartsLineChart
      style={{ width: '100%', height }}
      responsive
      data={data}
      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
    >
      {showGrid && <CartesianGrid stroke={gridColor} />}
      <XAxis
        dataKey={xKey}
        type={xType}
        ticks={xTicks}
        scale={xScale}
        height={xAxisHeight}
        stroke={axisColor}
        tick={xTickIcon ? renderTickIcon(xTickIcon, xTickIconColor || axisColor, xTickIconSize) : { fill: textColor }}
      />
      <YAxis ticks={yTicks} scale={yScale} stroke={axisColor} tick={{ fill: textColor }} />
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
      {lines.map((line, index) => (
        <Line
          key={line.dataKey}
          dataKey={line.dataKey}
          name={line.name}
          stroke={line.color || DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length]}
          strokeWidth={line.strokeWidth ?? 2}
          strokeDasharray={line.strokeDasharray}
          isAnimationActive={false}
        />
      ))}
      {referenceLines.map((ref) => (
        <ReferenceLine
          key={`${ref.y}-${ref.label || ''}`}
          y={ref.y}
          stroke={ref.color || DEFAULT_REFERENCE_COLOR}
          strokeDasharray={ref.strokeDasharray ?? '5 5'}
        >
          {ref.label && <Label value={ref.label} position={ref.labelPosition || 'insideTopRight'} fill={ref.color || DEFAULT_REFERENCE_COLOR} />}
        </ReferenceLine>
      ))}
      {referenceDots.map((dot) => (
        <ReferenceDot
          key={`${dot.x}-${dot.y}`}
          x={dot.x}
          y={dot.y}
          r={dot.radius ?? 8}
          fill={dot.color || DEFAULT_REFERENCE_COLOR}
          stroke="none"
        >
          {dot.label && <Label value={dot.label} position={dot.labelPosition || 'top'} fill={dot.color || DEFAULT_REFERENCE_COLOR} />}
        </ReferenceDot>
      ))}
    </RechartsLineChart>
  );
}
