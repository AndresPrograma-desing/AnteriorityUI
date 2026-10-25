import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { FiPieChart } from 'react-icons/fi';
import {
  DEFAULT_PIE_COLORS,
  DEFAULT_TEXT_COLOR,
  DEFAULT_TOOLTIP_BG_COLOR,
  DEFAULT_TOOLTIP_BORDER_COLOR,
  DEFAULT_SLICE_STROKE_COLOR,
  DEFAULT_CENTER_ICON_SIZE,
} from '../../constants.js';

function CustomTooltip({ datum, tooltipBgColor, tooltipBorderColor, tooltipTextColor }) {
  return (
    <div
      style={{
        padding: '6px 10px',
        background: tooltipBgColor,
        border: `1px solid ${tooltipBorderColor}`,
        borderRadius: 8,
        color: tooltipTextColor,
        fontSize: 13,
      }}
    >
      <strong style={{ color: datum.color }}>{datum.label}</strong>: {datum.formattedValue}
    </div>
  );
}

// data: [{ name, value, color? }] — se mapea internamente a { id: name, value, color }
// que es el shape que espera @nivo/pie.
export default function PieChart({
  data,
  colors = DEFAULT_PIE_COLORS,
  innerRadius = 0.5,
  padAngle = 0.6,
  cornerRadius = 2,
  showTooltip = true,
  showLegend = true,
  textColor = DEFAULT_TEXT_COLOR,
  tooltipBgColor = DEFAULT_TOOLTIP_BG_COLOR,
  tooltipBorderColor = DEFAULT_TOOLTIP_BORDER_COLOR,
  tooltipTextColor,
  legendTextColor = DEFAULT_TEXT_COLOR,
  sliceStrokeColor = DEFAULT_SLICE_STROKE_COLOR,
  onSliceClick,
  centerIcon,
  centerIconColor = DEFAULT_TEXT_COLOR,
  arcLabelColor,
  height = 400,
}) {
  // El ícono central solo tiene sentido con un hueco real (donut) — en torta llena
  // (innerRadius 0) se superpone contra las porciones, así que el default se oculta
  // ahí; si el consumidor pasa centerIcon explícitamente, se respeta igual.
  const resolvedCenterIcon =
    centerIcon !== undefined
      ? centerIcon
      : innerRadius > 0
        ? <FiPieChart size={DEFAULT_CENTER_ICON_SIZE} color={centerIconColor} />
        : null;

  const nivoData = data.map((entry) => ({ id: entry.name, label: entry.name, value: entry.value, color: entry.color }));
  // La función `colors` de @nivo/pie recibe un datum "liviano" (id/label/value/data),
  // sin el `arc` computado (eso solo existe en callbacks como onClick/tooltip, que
  // reciben el ComputedDatum completo) — el índice de la serie se resuelve buscando
  // por id en el array original en vez de asumir un `datum.index`/`datum.arc.index`
  // que no existe en esta etapa.
  const resolveColor = (datum) => {
    if (datum.data.color) return datum.data.color;
    const index = nivoData.findIndex((item) => item.id === datum.id);
    return colors[index % colors.length];
  };

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {resolvedCenterIcon && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {resolvedCenterIcon}
        </div>
      )}
      <ResponsivePie
        data={nivoData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={innerRadius}
        padAngle={padAngle}
        cornerRadius={cornerRadius}
        activeOuterRadiusOffset={8}
        colors={resolveColor}
        borderWidth={sliceStrokeColor ? 1 : 0}
        borderColor={sliceStrokeColor}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={textColor}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={arcLabelColor || { from: 'color', modifiers: [['darker', 2]] }}
        isInteractive={showTooltip || Boolean(onSliceClick)}
        tooltip={
          showTooltip
            ? (props) => (
                <CustomTooltip
                  {...props}
                  tooltipBgColor={tooltipBgColor}
                  tooltipBorderColor={tooltipBorderColor}
                  tooltipTextColor={tooltipTextColor || textColor}
                />
              )
            : () => null
        }
        onClick={
          onSliceClick
            ? (datum, event) => {
                const index = nivoData.findIndex((item) => item.id === datum.id);
                onSliceClick({ name: datum.id, value: datum.value, color: datum.color }, index, event);
              }
            : undefined
        }
        legends={
          showLegend
            ? [
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 56,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: legendTextColor,
                  symbolShape: 'circle',
                },
              ]
            : []
        }
      />
    </div>
  );
}
