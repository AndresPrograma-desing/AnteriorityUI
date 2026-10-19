import React, { useState, useEffect } from 'react';
import Input from '../../../../../Input/index';
import styles from './index.module.css';

// Campo para saltar directo a una página — usa el Input numérico de la librería (con su propio
// popover de stepper en portal, así no queda cortado por overflow/z-index de contenedores
// padres, a diferencia de un popover propio posicionado a mano).
const PdfPageJumper = ({ page, pageCount, onJump, textColor, bgColor }) => {
  const [value, setValue] = useState(String(page));

  useEffect(() => {
    setValue(String(page));
  }, [page]);

  const commit = () => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 1 && (!pageCount || parsed <= pageCount)) {
      if (parsed !== page) onJump(Math.trunc(parsed));
    } else {
      setValue(String(page));
    }
  };

  return (
    <div className={styles.jumper}>
      <Input
        numeric
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commit();
            event.currentTarget.blur();
          }
        }}
        min={1}
        max={pageCount || undefined}
        className={styles.input}
        fullWidth={false}
        bgColor="transparent"
        textColor={textColor}
        aria-label="Número de página"
      />
      <span className={styles.pageCount} style={{ color: textColor }}>/ {pageCount || '…'}</span>
    </div>
  );
};

export default PdfPageJumper;
