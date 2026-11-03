import { useCallback, useEffect, useState } from 'react';
import { AUTO_HIDE_HOVER_QUERY } from './constants.js';

// ¿El dispositivo tiene un puntero que pueda hacer hover (mouse/trackpad)? En pantallas táctiles
// no hay forma de "acercar el puntero" para volver a mostrar la barra, así que ahí el auto-ocultado
// se desactiva y la barra queda siempre visible.
function useCanHover() {
  const getMatch = () =>
    typeof window === 'undefined' || typeof window.matchMedia !== 'function'
      ? true
      : window.matchMedia(AUTO_HIDE_HOVER_QUERY).matches;

  const [canHover, setCanHover] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(AUTO_HIDE_HOVER_QUERY);
    const onChange = () => setCanHover(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return canHover;
}

// Lógica del auto-ocultado del TopBar. La barra se oculta `hideDelay` ms después de que el puntero
// sale de ella (la demora evita parpadeos si el puntero la roza), y se vuelve a mostrar al instante
// cuando el puntero entra (a la barra o a la franja de `reveal`, que ocupa el lugar donde se ocultó).
// Nunca se oculta mientras tenga el foco adentro (navegación por teclado) ni mientras `keepVisible`
// sea true (ej. hay un panel/paleta abierto desde la barra).
//
// Los eventos mouseenter/mouseleave/focus/blur de React se propagan por el árbol de React, no por
// el DOM, así que un menú desplegable en un portal (ej. el de usuario) cuenta como "adentro" de
// la barra y no la oculta mientras está abierto.
export default function useAutoHide({ enabled, hideDelay, keepVisible }) {
  const canHover = useCanHover();
  const active = Boolean(enabled) && canHover;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const stayVisible = !active || isHovered || isFocused || Boolean(keepVisible);

  useEffect(() => {
    if (stayVisible) {
      setIsHidden(false);
      return undefined;
    }
    if (isHidden) return undefined;
    const timer = setTimeout(() => setIsHidden(true), hideDelay);
    return () => clearTimeout(timer);
  }, [stayVisible, isHidden, hideDelay]);

  // Mostrar desde la franja de revelado: sin `isHovered` (el puntero todavía no está sobre la
  // barra), el efecto de arriba la vuelve a ocultar tras `hideDelay` si el puntero no entra a ella.
  const reveal = useCallback(() => setIsHidden(false), []);

  const barHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocused(true),
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
    },
  };

  return { active, isHidden: active && isHidden, reveal, barHandlers };
}
