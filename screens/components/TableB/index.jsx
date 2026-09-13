import React, { useState } from 'react';
import styles from './index.module.css';
import { Inbox, ChevronDown, ChevronUp, Filter as FilterIcon } from 'lucide-react';
import Barnner from '../Barnner';
import Button from '../Button';
import Loading from '../Loading/index';
import Skeleton from '../Skeleton/index';
import ScrollBar from '../ScrollBar';
import { getNextFilterValue, getFilterOptionLabel } from './utils';

const TableB = (props) => {
  const {
    columns = [],
    data = [],
    loading = false,
    skeletonRows = 6,
    error = null,
    emptyIcon: EmptyIcon = Inbox,
    emptyMessage = "No hay datos disponibles.",
    onRetry,
    expandable,
    rowKey = 'id',
    rowClassName,
    surfaceColor,
    headerColor,
    textColor,
    headingColor,
    mutedTextColor,
    borderColor,
    hoverColor,
    rowBorderColor,
    badgeColors,
    filterIconColor,
    filterActiveColor = '#10b981'
  } = props;
  const [expandedKeys, setExpandedKeys] = useState({});

  const handleCycleFilter = (filter) => {
    if (!filter || !Array.isArray(filter.options) || filter.options.length === 0) return;
    filter.onChange?.(getNextFilterValue(filter.options, filter.value));
  };

  const toggleExpand = (key) => {
    setExpandedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const themeVars = {
    '--tableB-surface': surfaceColor,
    '--tableB-header': headerColor,
    '--tableB-text': textColor,
    '--tableB-heading-text': headingColor,
    '--tableB-muted-text': mutedTextColor,
    '--tableB-border': borderColor,
    '--tableB-hover': hoverColor,
    '--tableB-row-border': rowBorderColor,
    '--tableB-badge-success-bg': badgeColors?.success?.bg,
    '--tableB-badge-success-color': badgeColors?.success?.color,
    '--tableB-badge-warning-bg': badgeColors?.warning?.bg,
    '--tableB-badge-warning-color': badgeColors?.warning?.color,
    '--tableB-badge-danger-bg': badgeColors?.danger?.bg,
    '--tableB-badge-danger-color': badgeColors?.danger?.color,
  };

  const getBadgeOverrideClass = (badgeTypeValue) => {
    if (badgeTypeValue === 'success') return styles.badgeSuccess;
    if (badgeTypeValue === 'warning') return styles.badgeWarning;
    if (badgeTypeValue === 'danger') return styles.badgeDanger;
    return '';
  };

  return (
    <ScrollBar horizontal vertical={false} className={styles.tableContainer} style={themeVars}>
      <table className={styles.modernTable}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{ textAlign: col.align || 'left' }}
              >
                {col.filter ? (
                  <div
                    className={styles.headerFilterWrap}
                    style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}
                  >
                    <span>{col.label}</span>
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
                ) : col.label}
              </th>
            ))}
            {expandable && <th className={styles.expandHeader}></th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`}>
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} style={{ textAlign: col.align || 'left', width: col.width }}>
                    <Skeleton height="14px" width={col.align === 'right' || col.align === 'center' ? '60%' : '85%'} />
                  </td>
                ))}
                {expandable && <td className={styles.expandCell} />}
              </tr>
            ))
          ) : error ? (
            <tr>
              <td colSpan={columns.length + (expandable ? 1 : 0)} style={{ padding: 0 }}>
                <div className={styles.centerSection}>
                  <div style={{ marginBottom: '16px' }}>
                    <Loading size="large" phrases={[error, "Revisando conexión", "Por favor, intenta de nuevo"]} />
                  </div>
                  {/* {onRetry && (
                    <Button
                      type={"button"}
                      variant={Button.VARIANTS.PRIMARY}
                      size={Button.SIZES.LARGE}
                      color={Button.COLORS.GREEN}
                      onClick={onRetry}>Reintentar</Button>
                  )} */}
                </div>
              </td>
            </tr>
          ) : (!data || data.length === 0) ? (
            <tr>
              <td colSpan={columns.length + (expandable ? 1 : 0)} style={{ padding: '1.5rem' }}>
                <div className={styles.emptyState}>
                  <EmptyIcon size={48} className={styles.emptyIcon} />
                  <p style={{ margin: 0 }}>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const key = row[rowKey] || rowIndex;
              const isExpanded = !!expandedKeys[key];
              const canExpand = expandable?.rowExpandable ? expandable.rowExpandable(row) : true;

              return (
              <React.Fragment key={key}>
                <tr 
                  className={`${styles.tableRow} ${isExpanded ? styles.rowExpanded : ''} ${rowClassName ? rowClassName(row, rowIndex) : ''}`}
                  onClick={() => canExpand && toggleExpand(key)}
                  style={{ cursor: canExpand ? 'pointer' : 'default' }}
                >
                  {columns.map((col, colIndex) => (
                    <td 
                      key={col.key || colIndex}
                      style={{ textAlign: col.align || 'left', width: col.width }}
                    >
                      {col.type === 'actions' && col.actions ? (
                        <div className={styles.actionButtons} style={{ justifyContent: col.align || 'flex-start' }}>
                          {col.actions.map((act, actIdx) => (
                            <Button 
                              key={actIdx} 
                              variant={Button.VARIANTS.PRIMARY}
                              size={Button.SIZES.LARGE}
                              color={Button.COLORS.GREEN}
                              onClick={(e) => { e.stopPropagation(); act.onClick(row); }}
                              disabled={act.disabled ? act.disabled(row) : false}
                            >
                              {act.label}
                              {act.icon && <img src={act.icon} alt={act.label} className={`${styles.actionIcon} ${act.invertIcon ? styles.actionIconInvert : ''}`} />}
                            </Button>
                          ))}
                        </div>
                      ) : col.type === 'badge' ? (
                        <Barnner
                          type={col.badgeType ? col.badgeType(row) : undefined}
                          className={`${getBadgeOverrideClass(col.badgeType ? col.badgeType(row) : undefined)} ${col.badgeClass ? col.badgeClass(row) : ''}`}
                        >
                          {col.render ? col.render(row, rowIndex) : row[col.key]}
                        </Barnner>
                      ) : col.render ? (
                        col.render(row, rowIndex)
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                  {expandable && (
                    <td className={styles.expandCell}>
                      {canExpand ? (
                        <div className={styles.expandIconWrapper}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      ) : null}
                    </td>
                  )}
                </tr>
                {expandable && isExpanded && (
                  <tr className={styles.expandedContentRow}>
                    <td colSpan={columns.length + 1} className={styles.expandedContentCell}>
                      <div className={styles.expandedWrapper}>
                        {expandable.expandedRowRender(row, rowIndex)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          }))}
        </tbody>
      </table>
    </ScrollBar>
  );
};

export default TableB;
