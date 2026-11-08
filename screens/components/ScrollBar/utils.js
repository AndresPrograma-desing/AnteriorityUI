import { useRef, useState, useCallback, useEffect } from 'react';

const HIDE_DELAY = 800;
const MIN_THUMB_SIZE = 24;
// El track está inset 4px por lado (ver index.module.css): su largo real es clientSize - 8.
// Si el thumb se calcula contra clientSize, en el final del scroll sobresale del contenedor
// y puede generar un scroll extra en la página.
const TRACK_INSET = 8;

const EMPTY_THUMB = { v: { size: 0, offset: 0 }, h: { size: 0, offset: 0 } };

export function useScrollbar({ vertical = true, horizontal = true, autoHide = true } = {}) {
  const scrollRef = useRef(null);
  const thumbRef = useRef(EMPTY_THUMB);
  const [thumb, setThumb] = useState(EMPTY_THUMB);
  const [visible, setVisible] = useState(!autoHide);
  const hideTimeoutRef = useRef(null);
  const dragStateRef = useRef(null);

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = { v: { size: 0, offset: 0 }, h: { size: 0, offset: 0 } };

    if (vertical && el.scrollHeight > el.clientHeight) {
      const track = Math.max(el.clientHeight - TRACK_INSET, 0);
      const ratio = el.clientHeight / el.scrollHeight;
      const size = Math.min(Math.max(ratio * track, MIN_THUMB_SIZE), track);
      const travel = track - size;
      const scrollRange = el.scrollHeight - el.clientHeight;
      next.v = { size, offset: scrollRange > 0 ? (el.scrollTop / scrollRange) * travel : 0 };
    }

    if (horizontal && el.scrollWidth > el.clientWidth) {
      const track = Math.max(el.clientWidth - TRACK_INSET, 0);
      const ratio = el.clientWidth / el.scrollWidth;
      const size = Math.min(Math.max(ratio * track, MIN_THUMB_SIZE), track);
      const travel = track - size;
      const scrollRange = el.scrollWidth - el.clientWidth;
      next.h = { size, offset: scrollRange > 0 ? (el.scrollLeft / scrollRange) * travel : 0 };
    }

    thumbRef.current = next;
    setThumb(next);
  }, [vertical, horizontal]);

  const showThenHide = useCallback(() => {
    if (!autoHide) return;
    setVisible(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => setVisible(false), HIDE_DELAY);
  }, [autoHide]);

  const handleScroll = useCallback(() => {
    measure();
    showThenHide();
  }, [measure, showThenHide]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // ResizeObserver fires an initial callback right after observe(), so it
    // also covers the first measurement without calling setState synchronously here.
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => () => clearTimeout(hideTimeoutRef.current), []);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hideTimeoutRef.current);
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    showThenHide();
  }, [showThenHide]);

  const startDrag = useCallback((axis, event) => {
    const el = scrollRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();

    const size = axis === 'v' ? thumbRef.current.v.size : thumbRef.current.h.size;
    const travel = (axis === 'v' ? el.clientHeight : el.clientWidth) - TRACK_INSET - size;
    const scrollRange = axis === 'v' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
    const factor = travel > 0 ? scrollRange / travel : 0;

    dragStateRef.current = {
      axis,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: el.scrollLeft,
      startScrollTop: el.scrollTop,
      factor
    };
    setVisible(true);

    const onMove = (ev) => {
      const state = dragStateRef.current;
      const target = scrollRef.current;
      if (!state || !target) return;
      if (state.axis === 'v') {
        target.scrollTop = state.startScrollTop + (ev.clientY - state.startY) * state.factor;
      } else {
        target.scrollLeft = state.startScrollLeft + (ev.clientX - state.startX) * state.factor;
      }
    };
    const onUp = () => {
      dragStateRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      showThenHide();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [showThenHide]);

  return {
    scrollRef,
    thumb,
    visible,
    handleScroll,
    handleMouseEnter,
    handleMouseLeave,
    startDrag
  };
}
