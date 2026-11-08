import React, { useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../../../Button/index';
import styles from './index.module.css';
import { XLSX_ARROW_REPEAT_DELAY_MS, XLSX_ARROW_REPEAT_MS } from '../../../../constants.js';

const ICONS = { up: ChevronUp, down: ChevronDown, left: ChevronLeft, right: ChevronRight };

// Botón de flecha para mover el contenido de un área scrolleable: un click da un paso (animado) y
// mantenerlo apretado repite el paso sin parar. `onStep(isRepeat)` recibe true en las repeticiones para
// que el padre las haga instantáneas. Flotante sobre el área (por dirección) o `inline` dentro de una fila.
// Los colores salen de las CSS vars del visor (--xlsx-*), que lo alcanzan porque no usa portal.
const ScrollArrow = ({ direction, label, onStep, inline = false, className = '' }) => {
  const delayRef = useRef(null);
  const tickRef = useRef(null);
  const Icon = ICONS[direction];

  const stop = () => {
    clearTimeout(delayRef.current);
    clearInterval(tickRef.current);
  };
  useEffect(() => stop, []);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault(); // no robarle el foco a la grilla (para que sigan andando las teclas)
    onStep(false);
    stop();
    delayRef.current = setTimeout(() => {
      tickRef.current = setInterval(() => onStep(true), XLSX_ARROW_REPEAT_MS);
    }, XLSX_ARROW_REPEAT_DELAY_MS);
  };

  return (
    <Button
      circle
      size="small"
      variant="ghost"
      aria-label={label}
      title={label}
      tabIndex={-1}
      className={`${styles.arrow} ${inline ? styles.inline : `${styles.floating} ${styles[direction]}`} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onClick={(event) => {
        if (event.detail === 0) onStep(false); // activación por teclado (Enter/Espacio)
      }}
    >
      <Icon size={18} strokeWidth={2.5} />
    </Button>
  );
};

export default ScrollArrow;
