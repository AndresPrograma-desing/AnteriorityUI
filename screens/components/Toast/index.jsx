import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import Button from '../Button/index';
import Text from '../Text/index';
import CountdownBar from '../CountdownBar/index';
import styles from './index.module.css';
import {
  DEFAULT_TYPE,
  DEFAULT_DURATION,
  LEAVE_MS,
  DEFAULT_CLOSE_LABEL,
  ICON_SIZE,
  CLOSE_STYLE,
  ACTION_STYLE,
  TITLE_STYLE,
  MESSAGE_STYLE,
  DEFAULT_MESSAGE_ANIMATE,
} from './constants.js';

const TYPE_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

// Notificación flotante. Se cierra sola tras `duration` ms (se pausa al pasar el mouse si
// `pauseOnHover`), o con el botón ✕ si `closable`. `onClose(id)` se llama al terminar la salida.
const Toast = ({
  id,
  type = DEFAULT_TYPE, // 'success' | 'error' | 'info' | 'warning'
  title,
  message,
  action, // { label, onClick } — botón de acción opcional; cierra la notificación al usarlo
  icon: CustomIcon, // ícono de lucide-react que reemplaza al del tipo
  duration = DEFAULT_DURATION,
  pauseOnHover = true,
  closable = true,
  closeLabel = DEFAULT_CLOSE_LABEL,
  animate = DEFAULT_MESSAGE_ANIMATE, // animación de Text para el mensaje (ej. 'letter-fade-in', 'typing')
  onClose,
  // Colores (opcionales; por default salen del tipo y del tema claro)
  bgColor,
  textColor,
  mutedColor,
  iconColor,
  borderColor,
  accentColor,
  iconTextColor,
  hoverColor,
  showProgress = true, // barra de caducidad inferior (encendida por default)
  className = '',
  style,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingPct, setRemainingPct] = useState(100);
  const timerRef = useRef(null);
  const leaveTimerRef = useRef(null);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef(0);
  const dismissedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    clearTimeout(timerRef.current);
    setIsLeaving(true);
    leaveTimerRef.current = setTimeout(() => onCloseRef.current?.(id), LEAVE_MS);
  }, [id]);

  const schedule = useCallback(
    (ms) => {
      clearTimeout(timerRef.current);
      startedAtRef.current = Date.now();
      timerRef.current = setTimeout(dismiss, ms);
    },
    [dismiss]
  );

  useEffect(() => {
    if (!duration) return undefined;
    remainingRef.current = duration;
    setRemainingPct(100);
    schedule(duration);
    return () => clearTimeout(timerRef.current);
  }, [duration, schedule]);

  // Porcentaje restante para la barra: se actualiza mientras corre y se congela al pausar.
  useEffect(() => {
    if (!duration || isPaused) return undefined;
    const tick = () =>
      setRemainingPct(Math.max(0, ((remainingRef.current - (Date.now() - startedAtRef.current)) / duration) * 100));
    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [duration, isPaused]);

  useEffect(() => () => clearTimeout(leaveTimerRef.current), []);

  const pause = () => {
    if (!duration || !pauseOnHover || isPaused || dismissedRef.current) return;
    clearTimeout(timerRef.current);
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
    setRemainingPct((remainingRef.current / duration) * 100);
    setIsPaused(true);
  };

  const resume = () => {
    if (!isPaused) return;
    setIsPaused(false);
    schedule(remainingRef.current);
  };

  const handleAction = () => {
    action?.onClick?.();
    dismiss();
  };

  const Icon = CustomIcon || TYPE_ICONS[type] || TYPE_ICONS[DEFAULT_TYPE];

  const colorVars = {
    ...(bgColor ? { '--toast-bg': bgColor } : {}),
    ...(textColor ? { '--toast-text': textColor } : {}),
    ...(mutedColor ? { '--toast-muted': mutedColor } : {}),
    ...(iconColor ? { '--toast-icon': iconColor } : {}),
    ...(borderColor ? { '--toast-border': borderColor } : {}),
    ...(accentColor ? { '--toast-accent': accentColor } : {}),
    ...(iconTextColor ? { '--toast-icon-fg': iconTextColor } : {}),
    ...(hoverColor ? { '--toast-hover': hoverColor } : {}),
  };

  const classes = [
    styles.toast,
    styles[type] || '',
    isLeaving ? styles.leave : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{ '--toast-duration': `${duration || 0}ms`, ...colorVars, ...style }}
      role={type === 'error' ? 'alert' : 'status'}
      onMouseEnter={pauseOnHover ? pause : undefined}
      onMouseLeave={pauseOnHover ? resume : undefined}
    >
      <div className={styles.body}>
        <span className={styles.iconChip} aria-hidden="true">
          <Icon size={ICON_SIZE} />
        </span>

        <div className={styles.content}>
          {title && (
            <Text variant="h3" color="var(--toast-text, #0f172a)" style={TITLE_STYLE} className={styles.title}>
              {title}
            </Text>
          )}
          {message && (
            <Text variant="body" color="var(--toast-muted, #64748b)" animate={animate} style={MESSAGE_STYLE} className={styles.message}>
              {message}
            </Text>
          )}

          {action && (
            <div className={styles.actions}>
              <Button variant="ghost" size="small" onClick={handleAction} style={ACTION_STYLE}>
                {action.label}
              </Button>
            </div>
          )}
        </div>

        {closable && (
          <Button
            variant="ghost"
            circle
            size="small"
            icon={X}
            onClick={dismiss}
            aria-label={closeLabel}
            style={CLOSE_STYLE}
            className={styles.closeButton}
          />
        )}
      </div>

      {showProgress && duration > 0 && (
        <div className={styles.progressBar}>
          <CountdownBar
            active
            value={remainingPct}
            height="7px"
            showTooltip={false}
            color="var(--toast-accent)"
            trackColor="transparent"
            borderColor="transparent"
            style={{ margin: 0, cursor: 'default' }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
