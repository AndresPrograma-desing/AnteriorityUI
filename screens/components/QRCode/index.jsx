import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.css';
import Button from '../Button/index';
import Skeleton from '../Skeleton/index';

import {
  DEFAULT_SIZE, DEFAULT_MARGIN, DEFAULT_LEVEL, DEFAULT_MODULE_STYLE, DEFAULT_LOGO_RATIO,
  DEFAULT_FG, DEFAULT_BG, DEFAULT_FILE_NAME, DOWNLOAD_SCALE,
  DEFAULT_ANIMATION, DEFAULT_ANIMATION_DURATION, DEFAULT_BLUR,
} from './constants.js';
import downloadBlob from '../../../common/utils/downloadBlob';
import { buildMatrix, isFinder, serializeSvg, svgToPngBlob } from './utils.js';

// Genera un QR funcional como SVG a partir de `value` (URL, texto, WIFI:..., etc.).
// `logo` puede ser una URL/data URI, un elemento React (ícono lucide / react-icons, Avatar, etc.)
// o una función (px) => nodo. Se centra sobre el QR y se fuerza corrección de errores H para que siga escaneable.
// `downloadable` agrega botones para bajar el QR como PNG / SVG.
export default function QRCode({
  value = '',
  size = DEFAULT_SIZE,
  level = DEFAULT_LEVEL,
  margin = DEFAULT_MARGIN,
  moduleStyle = DEFAULT_MODULE_STYLE,
  logo,
  logoRatio = DEFAULT_LOGO_RATIO,
  logoBgColor,
  downloadable = false,
  loading = false,
  blurred = false,
  blurAmount = DEFAULT_BLUR,
  blurOverlay,
  visible = true,
  animation = DEFAULT_ANIMATION,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onExited,
  fileName = DEFAULT_FILE_NAME,
  onError,
  fgColor = DEFAULT_FG,
  bgColor = DEFAULT_BG,
  borderColor,
  borderWidth,
  borderRadius,
  padding,
  frameBgColor,
  buttonBgColor,
  buttonTextColor,
  buttonBorderColor,
  buttonProps,
  errorColor,
  loadingColor,
  overlayTextColor,
  className = '',
  style,
  'aria-label': ariaLabel,
}) {
  const svgRef = useRef(null);

  // Animación de salida: al pasar visible=false se reproduce la salida y recién después se desmonta.
  const [rendered, setRendered] = useState(visible);
  useEffect(() => {
    if (visible) {
      setRendered(true);
      return undefined;
    }
    if (animation === 'none' || !animationDuration) {
      setRendered(false);
      onExited?.();
      return undefined;
    }
    const t = setTimeout(() => {
      setRendered(false);
      onExited?.();
    }, animationDuration);
    return () => clearTimeout(t);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const { matrix, error } = useMemo(() => {
    if (value === '' || value == null) return { matrix: null, error: null };
    try {
      return { matrix: buildMatrix(value, level, Boolean(logo)), error: null };
    } catch (e) {
      return { matrix: null, error: e };
    }
  }, [value, level, logo]);

  const cssVars = {
    ...(borderColor !== undefined && { '--qr-border': borderColor }),
    ...(borderWidth !== undefined && { '--qr-border-width': `${borderWidth}px` }),
    ...(borderRadius !== undefined && { '--qr-radius': `${borderRadius}px` }),
    ...(padding !== undefined && { '--qr-padding': `${padding}px` }),
    ...(frameBgColor !== undefined && { '--qr-frame-bg': frameBgColor }),
    ...(errorColor !== undefined && { '--qr-error': errorColor }),
    ...(overlayTextColor !== undefined && { '--qr-overlay-text': overlayTextColor }),
    '--qr-anim-duration': `${animationDuration}ms`,
    '--qr-blur': `${blurAmount}px`,
    ...style,
  };

  if (!rendered) return null;

  if (error) {
    onError?.(error);
    return (
      <div className={`${styles.error} ${className}`} style={cssVars} role="alert">
        No se pudo generar el QR (contenido demasiado largo).
      </div>
    );
  }
  if (!matrix && !loading) return null;

  const total = matrix ? matrix.size + margin * 2 : 0;
  const logoSize = logo && matrix ? Math.round(matrix.size * Math.min(Math.max(logoRatio, 0.05), 0.3)) : 0;
  const logoPos = (total - logoSize) / 2;
  const logoPx = (logoSize * size) / (total || 1); // lado del logo en px reales
  const inLogoZone = (x, y) => {
    if (!logo) return false;
    const gx = x + margin;
    const gy = y + margin;
    return gx >= logoPos - 1 && gx < logoPos + logoSize + 1 && gy >= logoPos - 1 && gy < logoPos + logoSize + 1;
  };

  const squares = [];
  const shapes = [];
  const msize = matrix ? matrix.size : 0;
  for (let y = 0; y < msize; y++) {
    for (let x = 0; x < msize; x++) {
      if (!matrix.data[y * msize + x] || inLogoZone(x, y)) continue;
      const px = x + margin;
      const py = y + margin;
      if (moduleStyle === 'square' || isFinder(x, y, msize)) {
        squares.push(`M${px} ${py}h1v1h-1z`);
      } else if (moduleStyle === 'dots') {
        shapes.push(<circle key={`${x}-${y}`} cx={px + 0.5} cy={py + 0.5} r={0.5} />);
      } else {
        shapes.push(<rect key={`${x}-${y}`} x={px} y={py} width={1} height={1} rx={0.3} />);
      }
    }
  }

  const btnProps = {
    ...(buttonBgColor !== undefined && { color: buttonBgColor }),
    ...(buttonBorderColor !== undefined && { borderColor: buttonBorderColor }),
    ...(buttonTextColor !== undefined && { style: { color: buttonTextColor } }),
    ...buttonProps,
  };

  const downloadPng = async () => {
    try {
      downloadBlob(await svgToPngBlob(svgRef.current, size * DOWNLOAD_SCALE), `${fileName}.png`);
    } catch (e) {
      onError?.(e);
    }
  };
  const downloadSvg = () => {
    const xml = serializeSvg(svgRef.current);
    downloadBlob(new Blob([xml], { type: 'image/svg+xml' }), `${fileName}.svg`);
  };

  const motion = animation !== 'none' ? styles[`${visible ? 'enter' : 'exit'}_${animation}`] || '' : '';
  const showQr = Boolean(matrix);

  return (
    <div className={`${styles.wrapper} ${motion} ${className}`} style={cssVars} aria-busy={loading || undefined}>
      <div className={styles.frame}>
        {!showQr && <div style={{ width: size, height: size, maxWidth: '100%' }} />}
        {showQr && <svg
          ref={svgRef}
          className={`${styles.svg} ${blurred ? styles.blurred : ''} ${loading ? styles.hidden : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={`0 0 ${total} ${total}`}
          role="img"
          aria-label={ariaLabel || `Código QR: ${value}`}
          shapeRendering="crispEdges"
        >
          <rect width={total} height={total} fill={bgColor} />
          <g fill={fgColor}>
            <path d={squares.join('')} />
            {shapes}
          </g>
          {logo && (
            <>
              <rect
                x={logoPos - 0.5}
                y={logoPos - 0.5}
                width={logoSize + 1}
                height={logoSize + 1}
                rx={logoSize * 0.2}
                fill={logoBgColor ?? bgColor}
              />
              {typeof logo === 'string' ? (
                <image href={logo} x={logoPos} y={logoPos} width={logoSize} height={logoSize} preserveAspectRatio="xMidYMid meet" />
              ) : (
                // El nodo se maqueta a tamaño real en px y se escala al hueco del QR (el SVG está en unidades de módulo).
                <foreignObject
                  x={0}
                  y={0}
                  width={logoPx}
                  height={logoPx}
                  transform={`translate(${logoPos} ${logoPos}) scale(${logoSize / logoPx})`}
                >
                  <div className={styles.logoNode} style={{ width: logoPx, height: logoPx }}>
                    {typeof logo === 'function' ? logo(Math.round(logoPx)) : logo}
                  </div>
                </foreignObject>
              )}
            </>
          )}
        </svg>}
        {loading && (
          <Skeleton
            width="100%"
            height="100%"
            radius="inherit"
            className={styles.loadingLayer}
            style={loadingColor !== undefined ? { background: loadingColor } : undefined}
          />
        )}
        {blurred && !loading && blurOverlay && <div className={styles.overlay}>{blurOverlay}</div>}
      </div>
      {downloadable && showQr && !loading && !blurred && (
        <div className={styles.actions}>
          <Button variant="secondary" size="small" {...btnProps} onClick={downloadPng}>Descargar PNG</Button>
          <Button variant="secondary" size="small" {...btnProps} onClick={downloadSvg}>Descargar SVG</Button>
        </div>
      )}
    </div>
  );
}

export { QRCode };
