import { useRef, useState, useCallback } from 'react';

const DEFAULT_DISMISS_THRESHOLD = 80;
const DEFAULT_RESET_TRANSITION = 'transform 0.2s ease';
const DISMISS_TRANSITION = 'transform 0.2s ease, opacity 0.2s ease';

// Hook genérico para "deslizar con el dedo para cerrar" (swipe-to-dismiss), pensado para
// tarjetas/notificaciones/toasts en mobile. Devuelve handlers de touch para poner en el
// elemento arrastrable y un objeto `style` con el transform/transición ya calculados — el
// componente solo necesita spreadear ambos, sin manejar la física del gesto él mismo.
// threshold: píxeles de desplazamiento horizontal para considerar el swipe "completado" y
// disparar onDismiss. Si el swipe no llega al threshold, vuelve suavemente a su posición.
const useSwipeToDismiss = ({ enabled = true, onDismiss, threshold = DEFAULT_DISMISS_THRESHOLD }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const startXRef = useRef(null);
  const draggingRef = useRef(false);

  const handleTouchStart = useCallback((event) => {
    if (!enabled || !onDismiss) return;
    startXRef.current = event.touches[0].clientX;
    draggingRef.current = true;
  }, [enabled, onDismiss]);

  const handleTouchMove = useCallback((event) => {
    if (!draggingRef.current || startXRef.current == null) return;
    const deltaX = event.touches[0].clientX - startXRef.current;
    setOffsetX(deltaX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    if (Math.abs(offsetX) >= threshold) {
      setIsDismissing(true);
      const direction = offsetX > 0 ? 1 : -1;
      setOffsetX(direction * 400);
      setTimeout(() => onDismiss?.(), 200);
    } else {
      setOffsetX(0);
    }
    startXRef.current = null;
  }, [offsetX, threshold, onDismiss]);

  const style = {
    transform: offsetX ? `translateX(${offsetX}px)` : undefined,
    opacity: isDismissing ? 0 : undefined,
    transition: draggingRef.current ? 'none' : (isDismissing ? DISMISS_TRANSITION : DEFAULT_RESET_TRANSITION),
    touchAction: enabled && onDismiss ? 'pan-y' : undefined,
  };

  return {
    style,
    handlers: enabled && onDismiss ? {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    } : {},
  };
};

export default useSwipeToDismiss;
