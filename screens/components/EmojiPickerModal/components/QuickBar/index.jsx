import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus } from 'lucide-react';
import Button from '../../../Button/index';
import DynamicIcon from '../../../DynamicIcon/index';
import { QUICK_BAR_MARGIN, QUICK_CELL_STYLE, QUICK_ICON_SIZE, EXPAND_STYLE } from '../../constants';
import styles from './index.module.css';

const resolveElement = (anchor) => (anchor && 'current' in anchor ? anchor.current : anchor) || null;

// Franja compacta con los últimos usados y un botón redondo al final que expande al selector
// completo. Con `anchorEl` se ancla junto a ese elemento (debajo, o arriba si no hay lugar);
// sin él queda centrada. El fondo es transparente: un clic fuera o Esc la cierra.
const QuickBar = ({ items, onPick, onExpand, onClose, anchorEl, rootClassName, colorVars, t }) => {
  const barRef = useRef(null);
  const [pos, setPos] = useState(null);
  const anchor = resolveElement(anchorEl);

  useLayoutEffect(() => {
    if (!anchor || !barRef.current) return undefined;
    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const bar = barRef.current;
      if (!bar) return;
      const width = bar.offsetWidth;
      const height = bar.offsetHeight;
      const spaceBelow = window.innerHeight - rect.bottom;
      const below = spaceBelow >= height + QUICK_BAR_MARGIN * 2;
      const left = Math.min(Math.max(QUICK_BAR_MARGIN, rect.left), Math.max(QUICK_BAR_MARGIN, window.innerWidth - width - QUICK_BAR_MARGIN));
      const top = below ? rect.bottom + QUICK_BAR_MARGIN : Math.max(QUICK_BAR_MARGIN, rect.top - height - QUICK_BAR_MARGIN);
      setPos({ left, top });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [anchor]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const barStyle = anchor ? { position: 'fixed', ...(pos || { left: 0, top: 0 }), visibility: pos ? 'visible' : 'hidden' } : undefined;

  return createPortal(
    <div
      className={`${styles.overlay} ${anchor ? '' : styles.centered} ${rootClassName}`}
      style={colorVars}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={barRef} className={styles.bar} style={barStyle} role="dialog" aria-label={t.recent}>
        {items.map(({ value, color }) => (
          <Button
            key={value}
            variant="ghost"
            circle
            aria-label={value}
            onClick={() => onPick(value, color)}
            style={QUICK_CELL_STYLE}
          >
            <DynamicIcon name={value} color={color || undefined} size={QUICK_ICON_SIZE} />
          </Button>
        ))}
        <span className={styles.divider} aria-hidden="true" />
        <Button
          variant="outline"
          circle
          size="small"
          icon={Plus}
          aria-label={t.more}
          ToolTip={t.more}
          onClick={onExpand}
          style={EXPAND_STYLE}
        />
      </div>
    </div>,
    document.body
  );
};

export default QuickBar;
