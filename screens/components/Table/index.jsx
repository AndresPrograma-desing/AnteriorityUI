import React, { useRef, useState } from 'react';
import stylesA from './tableA.module.css';
import stylesB from './tableB.module.css';
import { AlertCircle, Inbox, ChevronDown, ChevronUp, Filter as FilterIcon } from 'lucide-react';
import Barnner from '../Barnner';
import Button from '../Button';
import Loading from '../Loading/index';
import Skeleton from '../Skeleton/index';
import ScrollBar from '../ScrollBar';
import TableScrollFooter from '../../../common/table/TableScrollFooter';
import { getNextFilterValue, getFilterOptionLabel, columnsFromSchema } from './utils';
import { LinkCell, ButtonCell, SwitchCell, CheckCell, DateCell, NumberCell, InputCell, SelectCell } from './cells';
import {
  DEFAULT_VARIANT,
  DEFAULT_FILTER_ACTIVE_COLOR,
  DEFAULT_MAX_HEIGHT,
  DEFAULT_SKELETON_ROWS,
  DEFAULT_SCROLL_LEFT_LABEL,
  DEFAULT_SCROLL_RIGHT_LABEL,
  DEFAULT_SCROLL_SLIDER_LABEL,
  VARIANT_CONFIG,
} from './constants';

// Tabla unificada. `variant="A"` reproduce TableA (compacta) y `variant="B"` reproduce TableB
// (cómoda); TableA y TableB son wrappers finos de este componente. Todas las funciones están
// disponibles en ambas variantes: columnas con `header`/`accessor` (A) o `label`/`key` (B),
// `type: 'badge' | 'actions'`, `expandable`, filtro por columna, `onRowClick`, sticky y scrollFooter.
const Table = ({
  variant = DEFAULT_VARIANT,
  columns: columnsProp,
  schema,
  uiSchema,
  linkColor,
  data = [],
  keyExtractor,
  rowKey = 'id',
  rowClassName,
  loading = false,
  skeletonRows = DEFAULT_SKELETON_ROWS,
  error = null,
  onRetry,
  emptyIcon: EmptyIcon = Inbox,
  emptyMessage,
  expandable,
  onRowClick,
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
  filterActiveColor = DEFAULT_FILTER_ACTIVE_COLOR,
  stickyFirstColumn = false,
  stickyHeader = false,
  maxHeight = DEFAULT_MAX_HEIGHT,
  width,
  scrollFooter = false,
  scrollFooterBgColor,
  scrollFooterBorderColor,
  scrollControlsColor,
  scrollLeftLabel = DEFAULT_SCROLL_LEFT_LABEL,
  scrollRightLabel = DEFAULT_SCROLL_RIGHT_LABEL,
  scrollSliderLabel = DEFAULT_SCROLL_SLIDER_LABEL,
  className = '',
  style,
}) => {
  // `schema` (+ `uiSchema`) genera las columnas; si además llega `columns`, esa definición manda.
  const columns = columnsProp ?? (schema ? columnsFromSchema(schema, uiSchema) : []);
  const isB = variant === 'B';
  const config = VARIANT_CONFIG[isB ? 'B' : 'A'];
  const styles = isB ? stylesB : stylesA;
  const p = config.prefix;
  const resolvedEmptyMessage = emptyMessage ?? config.emptyMessage;

  const [expandedKeys, setExpandedKeys] = useState({});
  const scrollAreaRef = useRef(null);

  const handleCycleFilter = (filter) => {
    if (!filter || !Array.isArray(filter.options) || filter.options.length === 0) return;
    filter.onChange?.(getNextFilterValue(filter.options, filter.value));
  };

  const toggleExpand = (key) => setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const themeVars = {
    [`--${p}-surface`]: surfaceColor,
    [`--${p}-header`]: headerColor,
    [`--${p}-text`]: textColor,
    [`--${p}-heading-text`]: headingColor,
    [`--${p}-muted-text`]: mutedTextColor,
    [`--${p}-border`]: borderColor,
    [`--${p}-hover`]: hoverColor,
    [`--${p}-row-border`]: rowBorderColor,
    [`--${p}-badge-success-bg`]: badgeColors?.success?.bg,
    [`--${p}-badge-success-color`]: badgeColors?.success?.color,
    [`--${p}-badge-warning-bg`]: badgeColors?.warning?.bg,
    [`--${p}-badge-warning-color`]: badgeColors?.warning?.color,
    [`--${p}-badge-danger-bg`]: badgeColors?.danger?.bg,
    [`--${p}-badge-danger-color`]: badgeColors?.danger?.color,
    '--tableFooter-bg': scrollFooterBgColor ?? surfaceColor,
    '--tableFooter-border': scrollFooterBorderColor ?? borderColor,
    '--tableFooter-accent': scrollControlsColor,
    ...style,
  };

  const getBadgeOverrideClass = (type) => {
    if (type === 'success') return styles.badgeSuccess;
    if (type === 'warning') return styles.badgeWarning;
    if (type === 'danger') return styles.badgeDanger;
    return '';
  };

  const colHeader = (col) => col.header ?? col.label;
  const colValue = (col, row) => row[col.accessor ?? col.key];
  const cellStyle = (col) => ({
    textAlign: col.align || 'left',
    width: col.width,
    minWidth: col.width,
    maxWidth: col.width,
  });

  const wrapperClassName = `${styles[config.wrapper]} ${stickyFirstColumn ? styles.stickyFirstColumn : ''} ${stickyHeader ? styles.stickyHeader : ''} ${scrollFooter ? styles.withFooter : ''} ${scrollFooter ? '' : className}`.trim();
  const colSpan = columns.length + (expandable ? 1 : 0);

  const renderCell = (col, row, rowIndex) => {
    if (col.type === 'actions' && col.actions) {
      return (
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
      );
    }
    if (col.type === 'badge') {
      const type = col.badgeType ? col.badgeType(row) : undefined;
      return (
        <Barnner type={type} className={`${getBadgeOverrideClass(type)} ${col.badgeClass ? col.badgeClass(row) : ''}`}>
          {col.render ? col.render(row, rowIndex) : colValue(col, row)}
        </Barnner>
      );
    }
    const value = colValue(col, row);
    if (col.render) return col.render(row, rowIndex);
    switch (col.type) {
      case 'link': return <LinkCell col={col} row={row} value={value} linkColor={linkColor} />;
      case 'button': return <ButtonCell col={col} row={row} />;
      case 'switch': return <SwitchCell col={col} row={row} value={value} />;
      case 'checkbox': return <CheckCell col={col} row={row} value={value} />;
      case 'input': return <InputCell col={col} row={row} value={value} />;
      case 'select': return <SelectCell col={col} row={row} value={value} />;
      case 'date': return <DateCell col={col} value={value} />;
      case 'number': return <NumberCell col={col} value={value} />;
      default: return value;
    }
  };

  const renderError = () => (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0 }}>
        <div className={styles.centerSection}>
          {isB ? (
            <div style={{ marginBottom: '16px' }}>
              <Loading size="large" phrases={[error, 'Revisando conexión', 'Por favor, intenta de nuevo']} />
            </div>
          ) : (
            <>
              <div className={styles.errorMessage}>
                <AlertCircle size={32} />
                <span>{error}</span>
              </div>
              {onRetry && (
                <Button
                  type="button"
                  variant={Button.VARIANTS.PRIMARY}
                  size={Button.SIZES.LARGE}
                  color={Button.COLORS.GREEN}
                  onClick={onRetry}
                >
                  Reintentar
                </Button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const renderRows = () =>
    data.map((row, rowIndex) => {
      const customKey = keyExtractor ? keyExtractor(row) : undefined;
      const key = customKey ?? (row[rowKey] || rowIndex);
      const isExpanded = !!expandedKeys[key];
      const canExpand = expandable?.rowExpandable ? expandable.rowExpandable(row) : true;
      // TableB históricamente mostraba cursor pointer en toda fila expandible (y, sin `expandable`,
      // en todas); TableA solo cuando hay onRowClick. Se conserva cada comportamiento.
      const pointer = onRowClick ? true : expandable ? canExpand : isB ? canExpand : false;

      return (
        <React.Fragment key={key}>
          <tr
            className={`${styles[config.row]} ${isExpanded ? styles.rowExpanded : ''} ${rowClassName ? rowClassName(row, rowIndex) : ''}`}
            onClick={() => {
              onRowClick?.(row, rowIndex);
              if ((expandable || isB) && canExpand) toggleExpand(key);
            }}
            style={{ cursor: pointer ? 'pointer' : isB ? 'default' : undefined }}
          >
            {columns.map((col, colIndex) => (
              <td key={col.key || colIndex} style={cellStyle(col)}>
                {renderCell(col, row, rowIndex)}
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
                <div className={styles.expandedWrapper}>{expandable.expandedRowRender(row, rowIndex)}</div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });

  const table = (
    <ScrollBar
      horizontal
      vertical={stickyHeader}
      hideVerticalTrack
      maxHeight={stickyHeader ? maxHeight : undefined}
      scrollAreaRef={scrollAreaRef}
      hideHorizontalTrack={scrollFooter}
      className={wrapperClassName}
      style={themeVars}
    >
      <table className={styles[config.table]} style={width ? { width } : undefined}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} style={cellStyle(col)}>
                {col.filter ? (
                  <div
                    className={styles.headerFilterWrap}
                    style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}
                  >
                    <span>{colHeader(col)}</span>
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
                ) : colHeader(col)}
              </th>
            ))}
            {expandable && <th className={styles.expandHeader}></th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`} className={isB ? undefined : styles.row}>
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} style={cellStyle(col)}>
                    <Skeleton height="14px" width={col.align === 'right' || col.align === 'center' ? '60%' : '85%'} />
                  </td>
                ))}
                {expandable && <td className={styles.expandCell} />}
              </tr>
            ))
          ) : error ? (
            renderError()
          ) : (!data || data.length === 0) ? (
            <tr>
              <td colSpan={colSpan} style={{ padding: '1.5rem' }}>
                <div className={styles.emptyState}>
                  <EmptyIcon size={48} className={styles.emptyIcon} />
                  <p style={{ margin: 0 }}>{resolvedEmptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
    </ScrollBar>
  );

  if (!scrollFooter) return table;

  return (
    <div className={`${styles.root} ${className}`.trim()} style={themeVars}>
      {table}
      <TableScrollFooter
        scrollAreaRef={scrollAreaRef}
        controlsColor={scrollControlsColor}
        leftLabel={scrollLeftLabel}
        rightLabel={scrollRightLabel}
        sliderLabel={scrollSliderLabel}
      />
    </div>
  );
};

Table.VARIANTS = { A: 'A', B: 'B' };

export default Table;
