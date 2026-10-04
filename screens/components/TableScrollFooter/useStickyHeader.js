import { useEffect } from 'react';

// Primer ancestro con scroll vertical propio; si no hay ninguno, scrollea la ventana.
const getScrollParent = (element) => {
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY)) return node;
  }
  return window;
};

// Mantiene visible el encabezado de la tabla al scrollear la página. `position: sticky` no sirve
// aquí: el área de scroll horizontal de la tabla es un contenedor de scroll y el sticky quedaría
// atrapado dentro de ella. En su lugar se desplaza cada <th> con translateY según cuánto de la
// tabla quedó por encima del borde visible del scroll de la página.
export default function useStickyHeader(scrollAreaRef, enabled) {
  useEffect(() => {
    const area = scrollAreaRef.current;
    const table = area?.querySelector('table');
    if (!enabled || !table) return undefined;

    const scroller = getScrollParent(area);
    const headerCells = () => [...table.querySelectorAll('thead th')];

    const update = () => {
      const scrollerTop = scroller === window ? 0 : scroller.getBoundingClientRect().top;
      const tableRect = table.getBoundingClientRect();
      const headerHeight = table.tHead?.offsetHeight ?? 0;
      const offset = Math.min(Math.max(scrollerTop - tableRect.top, 0), Math.max(tableRect.height - headerHeight, 0));
      headerCells().forEach((cell) => { cell.style.transform = offset ? `translateY(${offset}px)` : ''; });
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(table);

    return () => {
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
      headerCells().forEach((cell) => { cell.style.transform = ''; });
    };
  }, [scrollAreaRef, enabled]);
}
