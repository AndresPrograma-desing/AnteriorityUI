export const normalizeVal = (val) =>
    String(val || '').toLowerCase().replace(/[_\s\/-]+/g, '');

// Ancho real (px) del texto con la fuente del body, medido con canvas. Fallback a una
// aproximación en ch si no hay DOM (SSR). Se usa para dimensionar el badge "flat" sin
// dejar espacio de más (ch sobrestima porque "0" es más ancho que la mayoría de letras).
let measureCanvas;
export const measureTextPx = (text, fontSizePx = 16) => {
    if (typeof document === 'undefined') return String(text).length * 0.6 * fontSizePx;
    try {
        measureCanvas = measureCanvas || document.createElement('canvas');
        const ctx = measureCanvas.getContext('2d');
        const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
        ctx.font = `${fontSizePx}px ${family}`;
        return ctx.measureText(String(text)).width;
    } catch {
        return String(text).length * 0.6 * fontSizePx;
    }
};

// Devuelve un finder que busca una opción por value exacto o normalizado (value o label).
export const createFindOption = (options) => (val) =>
    (val !== "" && val !== undefined && val !== null)
        ? options.find(opt =>
            String(opt.value) === String(val) ||
            normalizeVal(opt.value) === normalizeVal(val) ||
            normalizeVal(opt.label) === normalizeVal(val)
          ) || null
        : null;
