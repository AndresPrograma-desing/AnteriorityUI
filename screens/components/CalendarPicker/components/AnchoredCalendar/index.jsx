import React, { useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import CalendarPicker from '../../index';

const GAP = 6; // separación entre la celda y el calendario
const MARGIN = 8; // margen mínimo contra los bordes del viewport

// Calendario anclado a un elemento (una celda, un botón…): abre el CalendarPicker de la librería
// desplegado, sin mostrar su campo de texto, justo debajo del elemento `rect` ({ left, top, width, height }, o un
// DOMRect completo).
// Va en un portal a body con posición fija, así no lo recorta ningún `overflow` del contenedor.
// Se ubica según el espacio disponible: debajo si entra; si no, arriba; y si no entra en ninguno de los
// dos lados, se acota al viewport. El ajuste horizontal lo hace el propio CalendarPicker.
// `onPick` recibe 'YYYY-MM-DD' (o '' si el usuario usa "Borrar"); `onClose`, el cierre sin elegir
// (Escape o click afuera). Solo uno de los dos se ejecuta.
const AnchoredCalendar = ({ rect, value, onPick, onClose, accentColor, bgColor, textColor, borderColor }) => {
  const doneRef = useRef(false);
  const once = (fn) => (arg) => {
    if (doneRef.current) return;
    doneRef.current = true;
    fn(arg);
  };

  // `rect` puede venir como DOMRect completo o solo { left, top, width, height }.
  const anchorBottom = rect.bottom ?? rect.top + (rect.height || 0);

  const wrapRef = useRef(null);
  const [top, setTop] = useState(anchorBottom + GAP - 8);

  useLayoutEffect(() => {
    const root = wrapRef.current;
    const group = root && root.firstElementChild; // contenedor del CalendarPicker: [campo de texto, popover]
    if (!group) return undefined;

    // El campo de texto del CalendarPicker no se muestra: el desplegable nace desde el anclaje.
    const field = group.firstElementChild;
    if (field) field.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';

    const place = () => {
      const popover = group.lastElementChild;
      const height = popover && popover !== field ? popover.offsetHeight : 0;
      // El popover nace a 8px por debajo del borde superior de este contenedor.
      const below = anchorBottom + GAP;
      const above = rect.top - GAP - height;
      let popoverTop = below;
      if (below + height > window.innerHeight - MARGIN) {
        popoverTop = above >= MARGIN ? above : Math.max(MARGIN, window.innerHeight - MARGIN - height);
      }
      setTop(popoverTop - 8);
    };

    place();
    const raf = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', place);
    };
  }, [rect, anchorBottom]);

  return createPortal(
    <div ref={wrapRef} style={{ position: 'fixed', left: rect.left, top, width: Math.max(rect.width, 190), zIndex: 1400 }}>
      <CalendarPicker
        name="anchored-calendar"
        value={value || undefined}
        defaultOpen
        showFooter
        accentColor={accentColor}
        bgColor={bgColor}
        textColor={textColor}
        borderColor={borderColor}
        onChange={once((event) => onPick(event.target.value))}
        onClose={once(onClose)}
      />
    </div>,
    document.body,
  );
};

export default AnchoredCalendar;
