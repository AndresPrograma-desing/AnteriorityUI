import React from 'react';
import styles from './index.module.css';
import Skeleton from '../Skeleton/index';
import { AlertCircle, Inbox, Filter as FilterIcon } from 'lucide-react';
import Button from '../Button';
import ScrollBar from '../ScrollBar';
import { getNextFilterValue, getFilterOptionLabel } from './utils';

const TableA = (props) => {
  const {
    columns = [],
    data = [],
    keyExtractor,
    rowClassName,
    loading = false,
    skeletonRows = 6,
    error = null,
    onRetry,
    emptyIcon: EmptyIcon = Inbox,
    emptyMessage = "No hay datos disponibles",
    surfaceColor,
    headerColor,
    textColor,
    headingColor,
    mutedTextColor,
    borderColor,
    hoverColor,
    rowBorderColor,
    onRowClick,
    filterIconColor,
    filterActiveColor = '#10b981'
  } = props;

  const themeVars = {
    '--tableA-surface': surfaceColor,
    '--tableA-header': headerColor,
    '--tableA-text': textColor,
    '--tableA-heading-text': headingColor,
    '--tableA-muted-text': mutedTextColor,
    '--tableA-border': borderColor,
    '--tableA-hover': hoverColor,
    '--tableA-row-border': rowBorderColor
  };

  const handleCycleFilter = (filter) => {
    if (!filter || !Array.isArray(filter.options) || filter.options.length === 0) return;
    filter.onChange?.(getNextFilterValue(filter.options, filter.value));
  };

  return (
    <ScrollBar horizontal vertical={false} className={styles.tableWrapper} style={themeVars}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width,
                  minWidth: col.width,
                  maxWidth: col.width,
                }}
              >
                {col.filter ? (
                  <div
                    className={styles.headerFilterWrap}
                    style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}
                  >
                    <span>{col.header}</span>
                    <Button
                      circle
                      size="small"
                      variant={Button.VARIANTS.GHOST}
                      icon={FilterIcon}
                      color={col.filter.value ? filterActiveColor : filterIconColor}
                      className={styles.headerFilterBtn}
                      ToolTip={col.filter.tooltip || getFilterOptionLabel(col.filter.options, col.filter.value)}
                      onClick={() => handleCycleFilter(col.filter)}
                    />
                  </div>
                ) : col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`} className={styles.row}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} style={{ textAlign: col.align || 'left', width: col.width, minWidth: col.width, maxWidth: col.width }}>
                    <Skeleton height="14px" width={col.align === 'right' || col.align === 'center' ? '60%' : '85%'} />
                  </td>
                ))}
              </tr>
            ))
          ) : error ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                <div className={styles.centerSection}>
                  <div className={styles.errorMessage}>
                    <AlertCircle size={32} />
                    <span>{error}</span>
                  </div>
                  {onRetry && (
                    <Button
                      type={"button"}
                      variant={Button.VARIANTS.PRIMARY}
                      size={Button.SIZES.LARGE}
                      color={Button.COLORS.GREEN}
                      onClick={onRetry}>Reintentar</Button>
                  )}
                </div>
              </td>
            </tr>
          ) : (!data || data.length === 0) ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '1.5rem' }}>
                <div className={styles.emptyState}>
                  <EmptyIcon size={48} className={styles.emptyIcon} />
                  <p style={{ margin: 0 }}>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={`${styles.row} ${rowClassName ? rowClassName(row) : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      textAlign: col.align || 'left',
                      width: col.width,
                      minWidth: col.width,
                      maxWidth: col.width,
                    }}
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </ScrollBar>
  );
};

export default TableA;
