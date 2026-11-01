import React, { Suspense, useEffect, useMemo, useState } from 'react';
import styles from './index.module.css';
import {
  VARIANT_TAGS,
  DEFAULT_VARIANT,
  DEFAULT_ALIGN,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_GAP,
  DEFAULT_ICON_POSITION,
} from './constants.js';
import DynamicIcon from '../DynamicIcon/index';
import { splitIconTokens } from '../../../common/icons/iconTokens.js';

// MarkdownContent (react-markdown, remark-gfm, mermaid) se carga solo cuando se usa `markdown`.
const MarkdownContent = React.lazy(() => import('../MarkdownContent/index'));

// Divide en grafemas (un emoji con modificadores/ZWJ cuenta como UNA letra) para las
// animaciones letra por letra; sin Intl.Segmenter cae a code points.
const segmentGraphemes = (text) => {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
};

// Unidades animables del texto: cada carácter/emoji y cada {icon:...} cuentan como una.
const toUnits = (text) =>
  splitIconTokens(text).flatMap((part) =>
    part.icon ? [{ icon: part.icon, color: part.color }] : segmentGraphemes(part.text).map((char) => ({ char }))
  );

export default function Text({
  children,
  variant = DEFAULT_VARIANT,
  color,
  align = DEFAULT_ALIGN,
  className = '',
  style,
  // Ícono (nombre de react-icons) o emoji, ej. el valor que devuelve EmojiPicker
  icon,
  iconColor,
  iconSize = DEFAULT_ICON_SIZE,
  iconGap = DEFAULT_ICON_GAP,
  iconPosition = DEFAULT_ICON_POSITION, // 'start' | 'end'
  // Renderiza `children` (string) como markdown vía MarkdownContent
  markdown = false,
  // Props de animación y control de tiempos
  animate, // 'fade-in' | 'fade-out' | 'letter-fade-in' | 'letter-fade-out' | 'typing' | 'rise-and-fade'
  duration = 800, // Duración total para fade / letter-fade en ms
  typingSpeed = 50, // Milisegundos entre letras para 'typing'
  riseDuration = 1000, // Duración de la subida y desvanecimiento en ms
  riseDelay = 400, // Tiempo de espera antes de empezar a subir y desaparecer en ms
}) {
  const isMarkdown = markdown && typeof children === 'string';
  const Tag = isMarkdown ? 'div' : VARIANT_TAGS[variant] || VARIANT_TAGS[DEFAULT_VARIANT];
  const textContent = typeof children === 'string' ? children : '';
  // Las animaciones por letra no tienen sentido sobre bloques de markdown: se muestra estático.
  const effectiveAnimate =
    isMarkdown && (animate === 'typing' || animate === 'letter-fade-in' || animate === 'letter-fade-out')
      ? undefined
      : animate;

  const units = useMemo(() => toUnits(textContent), [textContent]);
  const [shownUnits, setShownUnits] = useState(effectiveAnimate === 'typing' ? 0 : units.length);

  // Animación tipo máquina de escribir
  useEffect(() => {
    if (effectiveAnimate !== 'typing' || !units.length) {
      setShownUnits(units.length);
      return;
    }

    let i = 0;
    setShownUnits(0);
    const timer = setInterval(() => {
      if (i < units.length) {
        i++;
        setShownUnits(i);
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [effectiveAnimate, units, typingSpeed]);

  // Clases CSS según la animación seleccionada
  const getAnimationClass = () => {
    switch (effectiveAnimate) {
      case 'fade-in':
        return styles.animateFadeIn;
      case 'fade-out':
        return styles.animateFadeOut;
      case 'typing':
        return styles.animateTyping;
      case 'rise-and-fade':
        return styles.animateRiseAndFade;
      case 'letter-fade-in':
      case 'letter-fade-out':
        return styles.letterFadeContainer;
      default:
        return '';
    }
  };

  const isLetterFade = effectiveAnimate === 'letter-fade-in' || effectiveAnimate === 'letter-fade-out';
  const hasInlineIcons = units.some((u) => u.icon);

  const renderUnit = (unit, key) =>
    unit.icon ? (
      <DynamicIcon key={key} name={unit.icon} color={unit.color} size={iconSize} />
    ) : (
      <React.Fragment key={key}>{unit.char}</React.Fragment>
    );

  const renderBody = () => {
    if (effectiveAnimate === 'typing') {
      return units.slice(0, shownUnits).map((unit, index) => renderUnit(unit, index));
    }

    if (isLetterFade && textContent) {
      const isOut = effectiveAnimate === 'letter-fade-out';
      const stepDelay = duration / Math.max(units.length, 1);

      return units.map((unit, index) => {
        // Si es salida, invertimos el orden para que desaparezca de atrás hacia adelante
        const targetIndex = isOut ? units.length - 1 - index : index;

        return (
          <span
            key={index}
            className={isOut ? styles.letterFadeOut : styles.letterFadeIn}
            style={{
              animationDuration: `${Math.min(stepDelay * 4, 600)}ms`,
              animationDelay: `${targetIndex * stepDelay}ms`,
            }}
          >
            {unit.char === ' ' ? '\u00A0' : unit.icon ? <DynamicIcon name={unit.icon} color={unit.color} size={iconSize} /> : unit.char}
          </span>
        );
      });
    }

    // Texto con {icon:Nombre} / {icon:Nombre:color} intercalados
    if (hasInlineIcons) {
      return units.map((unit, index) => renderUnit(unit, index));
    }

    return children;
  };

  const leadingIcon = icon && iconPosition !== 'end';
  const trailingIcon = icon && iconPosition === 'end';
  const iconNode = icon ? (
    <DynamicIcon
      name={icon}
      color={iconColor}
      size={iconSize}
      style={{ [trailingIcon ? 'marginLeft' : 'marginRight']: iconGap }}
    />
  ) : null;

  const containerStyle = {
    textAlign: align,
    ...(color ? { '--text-color': color } : {}),
    '--anim-duration': `${duration}ms`,
    '--rise-duration': `${riseDuration}ms`,
    '--rise-delay': `${riseDelay}ms`,
    ...style,
  };

  const classes = `${styles.text} ${styles[variant] || ''} ${getAnimationClass()} ${className}`.trim();

  if (isMarkdown) {
    return (
      <Tag className={`${classes} ${styles.markdown} ${icon ? styles.markdownWithIcon : ''}`.trim()} style={containerStyle}>
        {leadingIcon && iconNode}
        <div className={styles.markdownBody}>
          <Suspense fallback={children}>
            <MarkdownContent>{children}</MarkdownContent>
          </Suspense>
        </div>
        {trailingIcon && iconNode}
      </Tag>
    );
  }

  return (
    <Tag className={classes} style={containerStyle}>
      {leadingIcon && iconNode}
      {renderBody()}
      {trailingIcon && iconNode}
    </Tag>
  );
}
