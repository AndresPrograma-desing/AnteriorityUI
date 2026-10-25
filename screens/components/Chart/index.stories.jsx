import React from 'react';
import { FiActivity } from 'react-icons/fi';
import { RefreshCw, Download } from 'lucide-react';
import Chart from './index';
import DrawPanel from '../DrawPanel';
import Search from '../Material-UI/Components/Search';
import Swich from '../Swich';
import CalendarPicker from '../CalendarPicker';

const data = [
  { month: 'Jan', revenue: 4200, profit: 1100 },
  { month: 'Feb', revenue: 5800, profit: 1500 },
  { month: 'Mar', revenue: 7200, profit: 2400 },
  { month: 'Apr', revenue: 6100, profit: 1800 },
  { month: 'May', revenue: 8900, profit: 3100 },
  { month: 'Jun', revenue: 7400, profit: 2600 },
];

export default {
  title: 'Components/Chart',
  component: Chart,
};

export const Line = {
  render: () => (
    <Chart
      type="line"
      data={data}
      xKey="month"
      lines={[{ dataKey: 'revenue' }, { dataKey: 'profit' }]}
    />
  ),
};

export const LineCustomColors = {
  render: () => (
    <Chart
      type="line"
      data={data}
      xKey="month"
      bgColor="#0f172a"
      gridColor="#1e293b"
      axisColor="#64748b"
      textColor="#e2e8f0"
      tooltipBgColor="#1e293b"
      tooltipBorderColor="#38bdf8"
      tooltipTextColor="#e2e8f0"
      legendTextColor="#e2e8f0"
      lines={[
        { dataKey: 'revenue', color: '#38bdf8' },
        { dataKey: 'profit', color: '#34d399' },
      ]}
    />
  ),
};

export const LineNoLegendNoTooltip = {
  render: () => (
    <Chart
      type="line"
      data={data}
      xKey="month"
      showLegend={false}
      showTooltip={false}
      lines={[{ dataKey: 'revenue' }]}
    />
  ),
};

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

export const LineWithReferences = {
  render: () => (
    <Chart
      type="line"
      data={salesData}
      xKey="name"
      lines={[{ dataKey: 'sales' }]}
      referenceLines={[{ y: 3500, label: 'Target: 3500', color: '#be123c' }]}
      referenceDots={[{ x: 'May', y: 6000, label: 'Peak', color: '#15803d' }]}
    />
  ),
};

const numericData = [
  { x: 0, y: 12 },
  { x: 117, y: 45 },
  { x: 234, y: 23 },
  { x: 351, y: 78 },
  { x: 468, y: 156 },
];

export const LineNumericAxis = {
  render: () => (
    <Chart
      type="line"
      data={numericData}
      xKey="x"
      xType="number"
      xTicks={[0, 110, 220, 330, 440, 550]}
      yTicks={[0, 40, 80, 120, 160, 200]}
      lines={[{ dataKey: 'y' }]}
    />
  ),
};

export const LineSymlogScale = {
  render: () => (
    <Chart
      type="line"
      data={numericData}
      xKey="x"
      xType="number"
      xTicks={[0, 110, 220, 330, 440, 550]}
      xScale="symlog"
      yTicks={[0, 40, 80, 120, 160, 200]}
      yScale="symlog"
      lines={[{ dataKey: 'y' }]}
    />
  ),
};

const pieData = [
  { name: 'Series 1', value: 30 },
  { name: 'Series 2', value: 47 },
  { name: 'Series 3', value: 64 },
  { name: 'Series 4', value: 41 },
  { name: 'Series 5', value: 58 },
  { name: 'Series 6', value: 35 },
  { name: 'Series 7', value: 52 },
  { name: 'Series 8', value: 69 },
  { name: 'Series 9', value: 46 },
  { name: 'Series 10', value: 63 },
  { name: 'Series 11', value: 40 },
  { name: 'Series 12', value: 57 },
];

export const Pie = {
  render: () => (
    <Chart type="pie" data={pieData} bgColor="#18181b" textColor="#f4f4f5" legendTextColor="#f4f4f5" />
  ),
};

export const PieFull = {
  render: () => (
    <Chart type="pie" data={pieData.slice(0, 4)} innerRadius={0} bgColor="#18181b" legendTextColor="#f4f4f5" />
  ),
};

export const PieClickable = {
  render: () => (
    <Chart
      type="pie"
      data={pieData}
      bgColor="#18181b"
      textColor="#f4f4f5"
      legendTextColor="#f4f4f5"
      onSliceClick={(entry) => alert(`${entry.name}: ${entry.value}`)}
    />
  ),
};

export const PieCustomCenterIcon = {
  render: () => (
    <Chart
      type="pie"
      data={pieData}
      bgColor="#18181b"
      textColor="#f4f4f5"
      legendTextColor="#f4f4f5"
      centerIcon={<FiActivity size={32} color="#38bdf8" />}
    />
  ),
};

export const PieNoCenterIcon = {
  render: () => (
    <Chart type="pie" data={pieData} bgColor="#18181b" textColor="#f4f4f5" legendTextColor="#f4f4f5" centerIcon={null} />
  ),
};

const solarSystem = [
  { name: 'Sun', massKg: 1.989e30, color: '#ffa700' },
  { name: 'Mercury', massKg: 3.3e23, color: '#1a1a1a' },
  { name: 'Venus', massKg: 4.87e24, color: '#e3bb76' },
  { name: 'Earth', massKg: 5.97e24, color: '#6b93d6' },
  { name: 'Mars', massKg: 6.42e23, color: '#993d00' },
  { name: 'Jupiter', massKg: 1.9e27, color: '#b07f35' },
  { name: 'Saturn', massKg: 5.68e26, color: '#b08f36' },
  { name: 'Uranus', massKg: 8.68e25, color: '#5580aa' },
  { name: 'Neptune', massKg: 1.02e26, color: '#366896' },
  { name: 'Pluto', massKg: 1.3e22, color: '#968570' },
];

export const Bar = {
  render: () => (
    <Chart
      type="bar"
      data={solarSystem}
      xKey="name"
      bars={[{ dataKey: 'massKg', unit: 'kg' }]}
      yDomain={[1e23, 2e27]}
      yAxisWidth={100}
      yLabel="Mass [kg]"
      showLegend={false}
    />
  ),
};

const quarterlyData = [
  { quarter: 'Q1', sales: 4200, costs: 2800 },
  { quarter: 'Q2', sales: 5800, costs: 3100 },
  { quarter: 'Q3', sales: 7200, costs: 4000 },
  { quarter: 'Q4', sales: 6100, costs: 3600 },
];

export const BarMultiSeries = {
  render: () => (
    <Chart
      type="bar"
      data={quarterlyData}
      xKey="quarter"
      bars={[{ dataKey: 'sales' }, { dataKey: 'costs' }]}
    />
  ),
};

export const BarWithLabels = {
  render: () => (
    <Chart
      type="bar"
      data={data}
      xKey="month"
      xTickFormatter={(value) => value.toUpperCase()}
      yTickFormatter={(value) => `${value / 1000}k`}
      xAxisLabel="Month"
      bars={[
        { dataKey: 'revenue', showValueLabel: true, labelFormatter: (value) => `${Number(value) / 1000}k` },
        { dataKey: 'profit', showValueLabel: true, labelFormatter: (value) => `▲ ${value}` },
      ]}
    />
  ),
};

// Ícono de ejemplo (estrella) para los ticks del eje X — un consumidor real pasaría
// sus propios paths SVG (ej. un logo por categoría) en vez de un ícono genérico.
const STAR_PATH =
  'M512 100l119 241 266 39-192 187 45 265-238-125-238 125 45-265L127 380l266-39z';

export const LineCustomAxisTickIcons = {
  render: () => (
    <Chart
      type="line"
      data={data}
      xKey="month"
      xTickIcon={() => STAR_PATH}
      xTickIconColor="#ca8a04"
      xAxisHeight={50}
      lines={[{ dataKey: 'revenue', name: 'Revenue' }]}
    />
  ),
};

function randomCalendarData(from, to) {
  const start = new Date(from);
  const end = new Date(to);
  const result = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (Math.random() > 0.6) {
      result.push({ day: d.toISOString().slice(0, 10), value: Math.floor(Math.random() * 100) });
    }
  }
  return result;
}

const calendarData = randomCalendarData('2024-03-01', '2024-07-12');

export const NivoCalendar = {
  render: () => (
    <Chart type="nivo-calendar" data={calendarData} from="2024-03-01" to="2024-07-12" height={260} />
  ),
};

export const NivoCalendarWithTitleAndDescription = {
  render: () => (
    <Chart
      type="nivo-calendar"
      data={calendarData}
      from="2024-03-01"
      to="2024-07-12"
      height={260}
      title="## Actividad del usuario"
      description="Cada celda representa un día. Pasa el mouse para ver el **valor exacto** — [ver más](https://example.com)."
    />
  ),
};

const NivoCalendarWithActionsTemplate = () => {
  const [query, setQuery] = React.useState('');
  const [onlyActive, setOnlyActive] = React.useState(false);

  return (
    <Chart
      type="nivo-calendar"
      data={calendarData}
      from="2024-03-01"
      to="2024-07-12"
      height={260}
      title="## Actividad del usuario"
      actions={
        <>
          <div style={{ width: 160 }}>
            <CalendarPicker freeSolo options={[]} value={query} onChange={setQuery} placeholder="Buscar..." />
          </div>
          <Swich value={onlyActive} onChange={setOnlyActive} ToolTip="Solo activos" />
          <button type="button" title="Refrescar" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <RefreshCw size={18} />
          </button>
          <button type="button" title="Exportar" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <Download size={18} />
          </button>
        </>
      }
    />
  );
};

export const NivoCalendarWithActions = {
  render: () => <NivoCalendarWithActionsTemplate />,
};

export const NivoCalendarCustomBorder = {
  render: () => (
    <Chart
      type="nivo-calendar"
      data={calendarData}
      from="2024-03-01"
      to="2024-07-12"
      height={260}
      bgColor="#f8fafc"
      borderColor="#38bdf8"
    />
  ),
};

export const NivoCalendarCustomColors = {
  render: () => (
    <Chart
      type="nivo-calendar"
      data={calendarData}
      from="2024-03-01"
      to="2024-07-12"
      height={260}
      colors={['#dbeafe', '#93c5fd', '#3b82f6', '#1e3a8a']}
      emptyColor="#1e293b"
      bgColor="#0f172a"
    />
  ),
};

const NivoCalendarClickableTemplate = () => {
  const [selectedDay, setSelectedDay] = React.useState(null);

  return (
    <>
      <Chart
        type="nivo-calendar"
        data={calendarData}
        from="2024-03-01"
        to="2024-07-12"
        height={260}
        onDayClick={(day) => setSelectedDay(day)}
      />
      <DrawPanel
        isOpen={Boolean(selectedDay)}
        onClose={() => setSelectedDay(null)}
        title={selectedDay?.day ?? ''}
        description="Detalle del día seleccionado"
        width="360px"
      >
        <p style={{ margin: 0 }}>
          {selectedDay?.value != null ? `Valor: ${selectedDay.value}` : 'Sin datos para este día.'}
        </p>
      </DrawPanel>
    </>
  );
};

export const NivoCalendarClickable = {
  render: () => <NivoCalendarClickableTemplate />,
};
