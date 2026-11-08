import { useEffect, useState } from 'react';

// Qué direcciones tienen contenido por scrollear en `ref` (el elemento con overflow): sirve para mostrar
// solo las flechas que hacen algo. Se actualiza al scrollear y cuando cambia el tamaño del elemento o de su
// contenido (cambio de hoja, animación de alto, resize).
export default function useScrollEdges(ref, dep) {
  const [edges, setEdges] = useState({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = () => {
      const next = {
        up: el.scrollTop > 1,
        down: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
        left: el.scrollLeft > 1,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      };
      setEdges((prev) =>
        prev.up === next.up && prev.down === next.down && prev.left === next.left && prev.right === next.right
          ? prev
          : next,
      );
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [ref, dep]);

  return edges;
}
