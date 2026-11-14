import React from 'react';
import { Check, X } from 'lucide-react';
import ProgressLine from '../ProgressLine/index';
import { LINE_THICKNESS } from '../ProgressLine/constants.js';
import styles from './index.module.css';

import {
  DEFAULT_SIZE,
  DEFAULT_ORIENTATION,
  DEFAULT_SURFACE,
  DEFAULT_LINE_STYLE,
  DEFAULT_STEP_GAP,
  COMPACT_BAR_THICKNESS,
  DEFAULT_IMAGE_FIT,
  DEFAULT_COMPLETED_LABEL,
  DEFAULT_ERROR_LABEL,
  DEFAULT_ARIA_LABEL,
  defaultCompactLabel,
} from './constants.js';

// Indicador de pasos para workflows / wizards (Titular → Ubicación → Servicio → ...).
// Controlado: el padre decide `activeStep` (índice 0-based). Los pasos anteriores se muestran
// completados, el activo resaltado y los siguientes pendientes. Un paso puede marcarse con
// `error`. Si se pasa `onStepClick`, los pasos son botones (por defecto solo los completados,
// con `clickableSteps="all"` también los pendientes).
//
// Responsive por container query (no por viewport): cuando el propio componente es angosto,
// el modo horizontal oculta las etiquetas por paso y muestra una línea de resumen debajo.
// En `orientation="vertical"` las etiquetas y descripciones van al costado.
export default function Stepper({
  steps = [],
  activeStep = 0,
  orientation = DEFAULT_ORIENTATION,
  surface = DEFAULT_SURFACE,
  size = DEFAULT_SIZE,
  imageFit = DEFAULT_IMAGE_FIT,
  onStepClick,
  clickableSteps = 'completed',
  lineStyle = DEFAULT_LINE_STYLE,
  stepGap = DEFAULT_STEP_GAP,
  activeLoading = false,
  completedLabel = DEFAULT_COMPLETED_LABEL,
  errorLabel = DEFAULT_ERROR_LABEL,
  compactLabel = defaultCompactLabel,
  bgColor,
  surfaceColor,
  surfaceBorderColor,
  textColor,
  activeTextColor,
  descriptionColor,
  accentColor,
  iconColor,
  borderColor,
  haloColor,
  lineColor,
  lineActiveColor,
  errorColor,
  successColor,
  className = '',
  style,
  'aria-label': ariaLabel = DEFAULT_ARIA_LABEL,
}) {
  const vertical = orientation === 'vertical';
  const total = steps.length;
  // `activeStep === steps.length` = todos los pasos completados (ej. el proceso ya se entregó).
  const current = Math.min(Math.max(activeStep, 0), total);

  const tokens = {
    '--stepper-size': `${size}px`,
    '--stepper-gap': `${stepGap}px`,
    '--stepper-line-w': `${LINE_THICKNESS[lineStyle === 'dashed' ? 'dashed' : 'solid']}px`,
    ...(bgColor && { '--stepper-bg': bgColor }),
    ...(surfaceColor && { '--stepper-surface': surfaceColor }),
    ...(surfaceBorderColor && { '--stepper-surface-border': surfaceBorderColor }),
    ...(textColor && { '--stepper-text': textColor }),
    ...(activeTextColor && { '--stepper-text-active': activeTextColor }),
    ...(descriptionColor && { '--stepper-description': descriptionColor }),
    ...(accentColor && { '--stepper-accent': accentColor }),
    ...(iconColor && { '--stepper-icon': iconColor }),
    ...(borderColor && { '--stepper-border': borderColor }),
    ...(haloColor && { '--stepper-halo': haloColor }),
    ...(lineActiveColor && { '--stepper-line-active': lineActiveColor }),
    ...(successColor && { '--stepper-success': successColor }),
    ...(errorColor && { '--stepper-error': errorColor }),
    ...style,
  };

  const isClickable = (index, step) => {
    if (!onStepClick || step.disabled) return false;
    if (clickableSteps === 'all') return true;
    return index < current;
  };

  // `icon` acepta: URL / data URI de imagen (string), un elemento (ej. <svg> o un ícono de lucide),
  // o un componente (función/clase). Un string se renderiza como <img>.
  const renderIcon = (icon) => {
    if (typeof icon === 'string') {
      return <img className={styles.markerImg} src={icon} alt="" draggable={false} style={{ objectFit: imageFit }} />;
    }
    if (typeof icon === 'function' || (icon && typeof icon === 'object' && icon.$$typeof && !React.isValidElement(icon))) {
      const Icon = icon;
      return <span className={styles.markerIcon} aria-hidden="true"><Icon /></span>;
    }
    return <span className={styles.markerIcon} aria-hidden="true">{icon}</span>;
  };

  const renderMarker = (step, index, status) => {
    // Paso en curso (proceso corriendo): spinner en vez de número/ícono.
    // Con ícono propio el paso en curso lo conserva y el indicador de carga es un aro que gira
    // alrededor del círculo (CSS, `data-loading`); sin ícono, un spinner reemplaza al número.
    if (status === 'active' && !step.icon && (step.loading ?? activeLoading)) {
      return <span className={styles.spinner} aria-hidden="true" />;
    }
    const custom = step.icon;
    if (custom) {
      // Con ícono propio se conserva siempre; el estado se indica con una insignia en la esquina.
      return (
        <>
          {renderIcon(custom)}
          {status === 'completed' && (
            <span className={`${styles.badge} ${styles.badgeDone}`} aria-hidden="true">
              <Check size="70%" strokeWidth={4} />
            </span>
          )}
          {status === 'error' && (
            <span className={`${styles.badge} ${styles.badgeError}`} aria-hidden="true">
              <X size="70%" strokeWidth={4} />
            </span>
          )}
        </>
      );
    }
    if (status === 'error') return <X className={styles.markerIcon} strokeWidth={3} aria-hidden="true" />;
    if (status === 'completed') return <Check className={styles.markerIcon} strokeWidth={3} aria-hidden="true" />;
    return <span className={styles.number} aria-hidden="true">{index + 1}</span>;
  };

  const items = steps.map((step, index) => {
    const status = step.error
      ? 'error'
      : index < current
        ? 'completed'
        : index === current
          ? 'active'
          : 'upcoming';
    const clickable = isClickable(index, step);
    const Tag = clickable ? 'button' : 'div';
    const statusText = status === 'completed' ? completedLabel : status === 'error' ? errorLabel : '';

    // Conector hacia el paso siguiente: en vertical vive dentro de cada paso (debajo del marcador,
    // ocupando el alto restante), así la línea siempre toca el círculo, sea cual sea el tamaño.
    const filled = index + 1 <= current && !step.error;
    const body = (
      <>
        <span className={vertical ? styles.rail : styles.railFlat}>
          <span className={styles.marker}>{renderMarker(step, index, status)}</span>
          {vertical && index < total - 1 && (
            <ProgressLine
              className={styles.connector}
              orientation="vertical"
              lineStyle={lineStyle}
              progress={filled ? 100 : 0}
              trackColor={lineColor}
              fillColor={lineActiveColor}
            />
          )}
        </span>
        <span className={styles.text}>
          <span className={styles.label}>
            {step.label}
            {statusText && <span className={styles.srOnly}> ({statusText})</span>}
          </span>
          {step.description && <span className={styles.description}>{step.description}</span>}
        </span>
      </>
    );

    return (
      <React.Fragment key={step.id ?? index}>
        {!vertical && index > 0 && (
          <ProgressLine
            as="li"
            className={styles.connector}
            lineStyle={lineStyle}
            progress={index <= current && !steps[index - 1].error ? 100 : 0}
            trackColor={lineColor}
            fillColor={lineActiveColor}
          />
        )}
        <li
          className={styles.step}
          data-status={status}
          data-disabled={step.disabled || undefined}
          data-loading={(status === 'active' && (step.loading ?? activeLoading)) || undefined}
          aria-current={status === 'active' ? 'step' : undefined}
        >
          <Tag
            className={styles.stepBody}
            {...(clickable ? { type: 'button', onClick: () => onStepClick(index, step) } : {})}
          >
            {body}
          </Tag>
        </li>
      </React.Fragment>
    );
  });

  const currentStep = steps[Math.min(current, total - 1)];

  return (
    <div
      className={`${styles.root} ${surface === 'card' ? styles.surfaceCard : styles.surfacePlain} ${vertical ? styles.vertical : styles.horizontal} ${className}`}
      style={tokens}
    >
      <ol className={styles.list} aria-label={ariaLabel}>
        {items}
      </ol>
      {!vertical && total > 0 && (
        <div className={styles.compact} aria-hidden="true">
          <p className={styles.compactText}>{compactLabel(Math.min(current + 1, total), total, currentStep?.label)}</p>
          <ProgressLine
            thickness={COMPACT_BAR_THICKNESS}
            progress={(Math.min(current + 1, total) / total) * 100}
            trackColor={lineColor}
            fillColor={lineActiveColor}
          />
        </div>
      )}
    </div>
  );
}

export { Stepper };
