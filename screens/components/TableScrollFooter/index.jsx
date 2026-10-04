import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button';
import styles from './index.module.css';

// Fracción del ancho visible que se desplaza la tabla con cada clic.
const SCROLL_STEP = 0.6;

// Botones y slider que mueven el área de scroll horizontal de una tabla (TableA/TableB, vía scrollAreaRef). Solo se
// muestra cuando la tabla es más ancha que su contenedor.
export default function TableScrollFooter({ scrollAreaRef, controlsColor, leftLabel, rightLabel, sliderLabel }) {
  const [metrics, setMetrics] = useState({ max: 0, left: 0 });

  useEffect(() => {
    const area = scrollAreaRef.current;
    if (!area) return undefined;

    const measure = () => {
      setMetrics({ max: Math.max(0, area.scrollWidth - area.clientWidth), left: area.scrollLeft });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    if (area.firstElementChild) observer.observe(area.firstElementChild);
    area.addEventListener('scroll', measure);
    return () => {
      observer.disconnect();
      area.removeEventListener('scroll', measure);
    };
  }, [scrollAreaRef]);

  if (metrics.max <= 1) return null;

  const scrollBy = (direction) => {
    const area = scrollAreaRef.current;
    area?.scrollBy({ left: direction * area.clientWidth * SCROLL_STEP, behavior: 'smooth' });
  };

  return (
    <div className={styles.footer}>
      <Button
        size="small"
        variant={Button.VARIANTS.GHOST}
        icon={ChevronLeft}
        color={controlsColor}
        ToolTip={leftLabel}
        disabled={metrics.left <= 1}
        onClick={() => scrollBy(-1)}
      />
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={metrics.max}
        step={1}
        value={Math.min(metrics.left, metrics.max)}
        aria-label={sliderLabel}
        onChange={(event) => { scrollAreaRef.current.scrollLeft = Number(event.target.value); }}
      />
      <Button
        size="small"
        variant={Button.VARIANTS.GHOST}
        icon={ChevronRight}
        color={controlsColor}
        ToolTip={rightLabel}
        disabled={metrics.left >= metrics.max - 1}
        onClick={() => scrollBy(1)}
      />
    </div>
  );
}
