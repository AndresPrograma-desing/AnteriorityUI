import React from 'react';
import styles from './index.module.css';
import MarkdownContent from '../MarkdownContent/index';
import { BarChart, LineChart, PieChart, NivoCalendarChart } from './components/index.js';

export const CHART_TYPE = {
  LINE: 'line',
  PIE: 'pie',
  BAR: 'bar',
  NIVO_CALENDAR: 'nivo-calendar',
};

// Orquesta: según `type`, delega al mini-componente correspondiente en components/.
// Props de cada tipo (lines, xKey, colores, etc.) se pasan tal cual via ...rest.
export default function Chart({
  type = CHART_TYPE.LINE,
  bgColor,
  borderColor,
  title,
  description,
  titleColor,
  descriptionColor,
  actions,
  className = '',
  style,
  ...rest
}) {
  const wrapperStyle = {
    ...(bgColor ? { '--chart-bg': bgColor } : {}),
    ...(borderColor ? { '--chart-border': borderColor } : {}),
    ...style,
  };

  let chart = null;
  if (type === CHART_TYPE.LINE) chart = <LineChart {...rest} />;
  else if (type === CHART_TYPE.PIE) chart = <PieChart {...rest} />;
  else if (type === CHART_TYPE.BAR) chart = <BarChart {...rest} />;
  else if (type === CHART_TYPE.NIVO_CALENDAR) chart = <NivoCalendarChart {...rest} />;

  return (
    <div className={`${styles.wrapper} ${className}`} style={wrapperStyle}>
      {(title || actions) && (
        <div className={styles.header}>
          {title && (
            <MarkdownContent className={styles.title} style={titleColor ? { color: titleColor } : undefined}>
              {title}
            </MarkdownContent>
          )}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {chart}
      {description && (
        <MarkdownContent
          className={styles.description}
          style={descriptionColor ? { color: descriptionColor } : undefined}
        >
          {description}
        </MarkdownContent>
      )}
    </div>
  );
}

Chart.TYPE = CHART_TYPE;
