import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../Button/index';

const DEFAULT_ARROW_SIZE = 40;
const DEFAULT_ICON_SIZE = 20;
const DEFAULT_ARROW_BG = 'color-mix(in srgb, #000 40%, transparent)';

// Flecha prev/next con el Button de la librería, centrada verticalmente sobre el borde
// izquierdo (prev) o derecho (next). Tamaño, colores y el resto de Button llegan por props;
// `buttonProps` pisa cualquier cosa (ej. `disabled`, `ToolTip`).
function CarouselArrow({
  direction = 'next',
  label,
  onClick,
  size = DEFAULT_ARROW_SIZE,
  iconSize = DEFAULT_ICON_SIZE,
  color,
  bgColor,
  borderColor,
  hoverBgColor,
  buttonProps,
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const edgeStyle = direction === 'prev' ? { left: 8 } : { right: 8 };
  return (
    <Button
      variant={Button.VARIANTS.GHOST}
      size="medium"
      circle
      aria-label={label}
      title={label}
      hoverColor={hoverBgColor}
      borderColor={borderColor}
      {...buttonProps}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 3,
        width: size,
        height: size,
        minWidth: size,
        padding: 0,
        background: bgColor ?? DEFAULT_ARROW_BG,
        color: color ?? '#ffffff',
        ...edgeStyle,
        ...(buttonProps?.style ?? {}),
      }}
    >
      <Icon size={iconSize} />
    </Button>
  );
}

export default CarouselArrow;
