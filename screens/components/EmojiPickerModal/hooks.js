import { useCallback, useEffect, useRef, useState } from 'react';
import { ICON_PAGE_SIZE } from './constants';

// Scroll infinito para grillas grandes: expone cuántos items renderizar y un ref para el
// área de scroll (se pasa a `scrollAreaRef` de ScrollBar). Vuelve a la primera página y
// al tope cuando cambia `resetKey` (búsqueda, filtro, categoría).
export function useLoadMore(total, resetKey, pageSize = ICON_PAGE_SIZE) {
  const [visible, setVisible] = useState(pageSize);
  const scrollAreaRef = useRef(null);
  const totalRef = useRef(total);
  totalRef.current = total;

  useEffect(() => {
    setVisible(pageSize);
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
  }, [resetKey, pageSize]);

  useEffect(() => {
    const node = scrollAreaRef.current;
    if (!node) return undefined;
    const onScroll = () => {
      if (node.scrollTop + node.clientHeight >= node.scrollHeight - 120) {
        setVisible((v) => (v < totalRef.current ? v + pageSize : v));
      }
    };
    node.addEventListener('scroll', onScroll);
    return () => node.removeEventListener('scroll', onScroll);
  }, [pageSize]);

  return { visible, scrollAreaRef };
}

const readRecents = (storageKey) => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
    return Array.isArray(parsed) ? parsed.filter((r) => r && typeof r.value === 'string') : [];
  } catch {
    return [];
  }
};

// Últimos emojis/íconos elegidos ({ value, color }), persistidos en localStorage. El acceso va
// en try/catch porque puede fallar (ventana privada, SSR, storage bloqueado).
export function useRecents(storageKey, limit) {
  const [recents, setRecents] = useState(() => readRecents(storageKey).slice(0, limit));

  const addRecent = useCallback(
    (value, color = '') => {
      setRecents((prev) => {
        const next = [{ value, color }, ...prev.filter((r) => r.value !== value)].slice(0, limit);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // sin persistencia: se mantiene solo en memoria
        }
        return next;
      });
    },
    [storageKey, limit]
  );

  return { recents, addRecent };
}
