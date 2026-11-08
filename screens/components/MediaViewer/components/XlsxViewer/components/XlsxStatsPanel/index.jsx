import React, { useState } from 'react';
import { CornerDownRight, Copy, Check } from 'lucide-react';
import Button from '../../../../../Button/index';
import Selector from '../../../../../Material-UI/Components/Selector/index';
import FloatingPanel from '../../../../../FloatingPanel/index';
import useCopyToClipboard from '../../../../../../../common/hooks/useCopyToClipboard';
import styles from './index.module.css';
import { XLSX_STATS_PANEL_WIDTH, XLSX_STATS_PANEL_HEIGHT, XLSX_COPIED_FEEDBACK_MS } from '../../../../constants.js';
import { formatNumber } from '../../utils.js';

const FUNCTIONS = [
  { key: 'sum', fn: 'SUM' },
  { key: 'avg', fn: 'AVERAGE' },
  { key: 'count', fn: 'COUNT' },
  { key: 'min', fn: 'MIN' },
  { key: 'max', fn: 'MAX' },
];

// Calculadora de la selección del visor de Excel. La ventana flotante (mover, redimensionar, anclar a la selección)
// la pone `FloatingPanel`; acá queda solo su contenido: los resultados (copiables) y, si el visor es editable, el
// destino donde insertar cada uno como fórmula.
const XlsxStatsPanel = ({
  stats,
  rangeLabel,
  getAnchorRect,
  canInsert,
  onInsert,
  onClose,
  labels,
  notice,
  accentColor,
  textColor,
  bgColor,
  headerBgColor,
  borderColor,
}) => {
  const [destination, setDestination] = useState('below');
  const { copied: copiedKey, copy } = useCopyToClipboard({ resetMs: XLSX_COPIED_FEEDBACK_MS });

  const destinationOptions = [
    { value: 'below', label: labels.below },
    { value: 'right', label: labels.right },
    { value: 'single', label: labels.single },
  ];

  const values = stats
    ? { sum: stats.sum, avg: stats.avg, count: stats.count, min: stats.min, max: stats.max }
    : null;

  return (
    <FloatingPanel
      title={labels.title}
      subtitle={rangeLabel}
      getAnchorRect={getAnchorRect}
      width={XLSX_STATS_PANEL_WIDTH}
      height={XLSX_STATS_PANEL_HEIGHT}
      onClose={onClose}
      labels={{ title: labels.title, pin: labels.pin, close: labels.close }}
      bgColor={bgColor}
      textColor={textColor}
      borderColor={borderColor}
      headerBgColor={headerBgColor}
      accentColor={accentColor}
    >
      {!values && <p className={styles.empty}>{labels.empty}</p>}
      {values && (
        <ul className={styles.list}>
          {FUNCTIONS.map(({ key, fn }) => (
            <li key={key} className={styles.row}>
              <span className={styles.metric}>{labels[key]}</span>
              <button
                type="button"
                className={styles.value}
                onClick={() => copy(String(values[key]), key)}
                title={`${labels.copy}: ${formatNumber(values[key], 6)}`}
              >
                {formatNumber(values[key], 6)}
                {copiedKey === key ? <Check size={12} /> : <Copy size={12} className={styles.copyIcon} />}
              </button>
              {canInsert && (
                <Button
                  circle
                  size="small"
                  variant="ghost"
                  color="transparent"
                  icon={CornerDownRight}
                  onClick={() => onInsert(fn, destination)}
                  aria-label={`${labels.insert}: ${labels[key]}`}
                  title={`${labels.insert}: ${labels[key]}`}
                  style={{ color: accentColor }}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {canInsert && (
        <div className={styles.footer}>
          <Selector
            id="xlsx-stats-destination"
            label={labels.destination}
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            options={destinationOptions}
            disableClearable
            hideScrollbar={false}
            textColor={textColor}
            iconColor={accentColor}
            bgColor={bgColor}
            borderColor={borderColor}
          />
          {notice && <span className={styles.notice}>{notice}</span>}
        </div>
      )}
    </FloatingPanel>
  );
};

export default XlsxStatsPanel;
