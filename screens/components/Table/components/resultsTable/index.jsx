import React from 'react';
import ScrollBar from '../../../ScrollBar';
import Skeleton from '../../../Skeleton/index';
import styles from './index.module.css';

const resolve = (option, row, rowIndex, column) =>
  typeof option === 'function' ? option(row, rowIndex, column) : option;

const displayValue = (column, row, index) => {
  const value = row?.[column.accessor ?? column.key];
  if (column.render) return column.render(row, index);
  if (column.formatValue) return column.formatValue(value, row, index);
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (column.type === 'number' && typeof value === 'number')
    return new Intl.NumberFormat(column.locale ?? 'es-AR', column.numberFormat).format(value);
  return typeof value === 'object' ? JSON.stringify(value) : value;
};

const ResultsTable = ({
  columns, data, summary, summaryLabel, cellBgColor, alternateCellBgColor, cellColor,
  summaryBgColor, summaryTextColor, accentColor, surfaceColor, headerColor, textColor,
  headingColor, mutedTextColor, borderColor, hoverColor, loading, error,
  onRetry, emptyIcon: EmptyIcon, emptyMessage, skeletonRows, skeletonProps,
  scrollBarProps, keyExtractor, rowClassName, rowKey, onRowClick,
  stickyHeader, maxHeight, width, className, style,
}) => {
  const { className: scrollBarClassName = '', style: scrollBarStyle, ...otherScrollBarProps } = scrollBarProps ?? {};
  const vars = {
    ...(surfaceColor && { '--results-surface': surfaceColor }),
    ...(headerColor && { '--results-header': headerColor }),
    ...(textColor && { '--results-text': textColor }),
    ...(headingColor && { '--results-heading': headingColor }),
    ...(mutedTextColor && { '--results-muted': mutedTextColor }),
    ...(borderColor && { '--results-border': borderColor }),
    ...(hoverColor && { '--results-hover': hoverColor }),
    ...(cellBgColor && typeof cellBgColor !== 'function' && { '--results-cell': cellBgColor }),
    ...(alternateCellBgColor && { '--results-cell-alt': alternateCellBgColor }),
    ...(!alternateCellBgColor && cellBgColor && typeof cellBgColor !== 'function' && { '--results-cell-alt': cellBgColor }),
    ...(cellColor && typeof cellColor !== 'function' && { '--results-cell-text': cellColor }),
    ...(summaryBgColor && { '--results-summary': summaryBgColor }),
    ...(summaryTextColor && { '--results-summary-text': summaryTextColor }),
    ...(accentColor && { '--results-accent': accentColor }),
    ...style,
  };

  const cell = (column, row, index, isSummary = false) => {
    const bg = resolve(column.cellBgColor ?? cellBgColor, row, index, column);
    const color = resolve(column.cellColor ?? cellColor, row, index, column);
    const ActionIcon = column.action?.icon;
    const secondary = column.secondaryKey ? row?.[column.secondaryKey] : undefined;
    return (
      <td key={column.key ?? column.accessor} style={{ width: column.width, minWidth: column.width }}>
        <div className={isSummary ? styles.summaryCell : styles.cell} style={{
          ...(!isSummary && bg && { backgroundColor: bg }),
          ...(!isSummary && color && { color }),
        }}>
          <span className={styles.cellContent}>
            <span className={styles.value}>{isSummary && row?.[column.accessor ?? column.key] == null && column === columns[0]
              ? summaryLabel : displayValue(column, row, index)}</span>
            {!isSummary && secondary != null && <span className={styles.secondary}>{secondary}</span>}
          </span>
          {!isSummary && ActionIcon && (
            <button type="button" className={styles.action}
              aria-label={column.action.label} onClick={(event) => {
                event.stopPropagation();
                column.action.onClick?.(row, index, column);
              }}>
              <ActionIcon size={18} />
            </button>
          )}
        </div>
      </td>
    );
  };

  return <ScrollBar horizontal vertical={stickyHeader} maxHeight={stickyHeader ? maxHeight : undefined}
    className={`${styles.wrapper} ${className} ${scrollBarClassName}`.trim()}
    style={{ ...vars, ...scrollBarStyle }} {...otherScrollBarProps}>
    <table className={styles.table} style={width ? { width } : undefined}>
      <thead className={stickyHeader ? styles.sticky : undefined}><tr>
        {columns.map((column, index) => <th key={column.key ?? column.accessor ?? index}
          scope="col" style={{ width: column.width, minWidth: column.width }}>
          <span>{column.header ?? column.label}</span>
        </th>)}
      </tr></thead>
      <tbody>
        {summary && <tr className={styles.summaryRow}>{columns.map((column) => cell(column, summary, -1, true))}</tr>}
        {loading ? Array.from({ length: skeletonRows }, (_, index) => <tr key={index}>
          {columns.map((column, columnIndex) => <td key={column.key ?? column.accessor ?? columnIndex}>
            <div className={styles.cell}><Skeleton height="20px" width="75%" {...skeletonProps} /></div>
          </td>)}
        </tr>) : error ? <tr><td colSpan={columns.length} className={styles.message}>
          {String(error)} {onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}
        </td></tr> : data.length ? data.map((row, index) => <tr key={keyExtractor?.(row) ?? row[rowKey] ?? index}
          className={`${onRowClick ? styles.clickable : ''} ${rowClassName?.(row, index) ?? ''}`.trim()}
          onClick={() => onRowClick?.(row, index)}>
          {columns.map((column) => cell(column, row, index))}
        </tr>) : <tr><td colSpan={columns.length} className={styles.message}>
          <EmptyIcon size={28} aria-hidden="true" /> {emptyMessage ?? 'No hay resultados disponibles'}
        </td></tr>}
      </tbody>
    </table>
  </ScrollBar>;
};

export default ResultsTable;
