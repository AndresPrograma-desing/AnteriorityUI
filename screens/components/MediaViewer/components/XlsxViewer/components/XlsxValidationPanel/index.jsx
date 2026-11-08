import React, { useState } from 'react';
import { RadioGroup, Radio } from '../../../../../Radio/index';
import Button from '../../../../../Button/index';
import Input from '../../../../../Input/index';
import ScrollBar from '../../../../../ScrollBar/index';
import { XLSX_VALIDATION_TYPES } from '../../../../constants.js';
import styles from './index.module.css';

// Panel «Validación de datos»: elige qué se permite escribir en el rango seleccionado. Se muestra como un panel
// lateral pegado al menú contextual (ver XlsxContextMenu), no como un modal centrado. El contenido scrollea con
// el ScrollBar de la librería cuando la ventana es baja. `onApply`/`onClear` reciben la decisión; `onClose` cierra.
const XlsxValidationPanel = ({
  rangeLabel,
  initial,
  labels,
  onApply,
  onClear,
  onClose,
  bgColor,
  textColor,
  accentColor,
  borderColor,
}) => {
  const [type, setType] = useState(initial ? initial.type : 'any');
  const [pattern, setPattern] = useState(initial ? initial.pattern || '' : '');
  const [message, setMessage] = useState(initial ? initial.message || '' : '');

  const vars = {
    '--xv-bg': bgColor,
    '--xv-text': textColor,
    '--xv-accent': accentColor,
    '--xv-border': borderColor,
    backgroundColor: bgColor,
    color: textColor,
  };

  return (
    <div className={styles.panel} style={vars}>
      <h3 className={styles.title}>{labels.title}</h3>
      <ScrollBar maxHeight="calc(100vh - 170px)" horizontal={false}>
        <div className={styles.body}>
          <div className={styles.field}>
            <span className={styles.label}>{labels.range}</span>
            <strong>{rangeLabel}</strong>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>{labels.type}</span>
            <RadioGroup
              name="xlsx-validation-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              accentColor={accentColor}
              textColor={textColor}
              borderColor={borderColor}
              variant="card"
              radius={10}
              size="small"
            >
              {XLSX_VALIDATION_TYPES.map((value) => (
                <Radio key={value} value={value} label={labels.types[value]} />
              ))}
            </RadioGroup>
          </div>
          {type === 'custom' && (
            <div className={styles.field}>
              <Input
                id="xlsx-validation-pattern"
                label={labels.pattern}
                size="small"
                fullWidth
                value={pattern}
                placeholder={labels.patternPlaceholder}
                textColor={textColor}
                onChange={(event) => setPattern(event.target.value)}
              />
            </div>
          )}
          {type !== 'any' && (
            <div className={styles.field}>
              <Input
                id="xlsx-validation-message"
                label={labels.message}
                size="small"
                fullWidth
                value={message}
                placeholder={labels.messages[type]}
                textColor={textColor}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
          )}
        </div>
      </ScrollBar>
      <div className={styles.actions}>
        {initial && (
          <Button variant="ghost" color="red" size="small" onClick={onClear}>{labels.clear}</Button>
        )}
        <span style={{ flex: 1 }} />
        <Button variant="outline" size="small" borderColor={borderColor} style={{ color: textColor }} onClick={onClose}>
          {labels.cancel}
        </Button>
        <Button
          size="small"
          style={accentColor ? { backgroundColor: accentColor } : undefined}
          onClick={() => onApply({ type, pattern: type === 'custom' ? pattern : undefined, message: message.trim() || undefined })}
        >
          {labels.apply}
        </Button>
      </div>
    </div>
  );
};

export default XlsxValidationPanel;
