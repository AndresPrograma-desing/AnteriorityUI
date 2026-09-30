export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const isValidHex = (value) => /^#?[0-9a-f]{6}$/i.test(value);

export const normalizeHex = (value) => {
    const withHash = value.startsWith('#') ? value : `#${value}`;
    return withHash.toUpperCase();
};

export const hexToRgb = (hex) => {
    const normalized = normalizeHex(hex).slice(1);
    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
    };
};

const rgbToHex = ({ r, g, b }) =>
    normalizeHex(
        [r, g, b].map((c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0')).join(''),
    );

// Hue compartido por HSV y HSL (mismo cálculo sobre max/min/delta).
const getHue = (red, green, blue, max, delta) => {
    if (delta === 0) return 0;
    let hue;
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
    return hue < 0 ? hue + 360 : hue;
};

export const rgbToHsv = ({ r, g, b }) => {
    const [red, green, blue] = [r / 255, g / 255, b / 255];
    const max = Math.max(red, green, blue);
    const delta = max - Math.min(red, green, blue);
    return { h: getHue(red, green, blue, max, delta), s: max === 0 ? 0 : (delta / max) * 100, v: max * 100 };
};

const rgbToHsl = ({ r, g, b }) => {
    const [red, green, blue] = [r / 255, g / 255, b / 255];
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    return { h: getHue(red, green, blue, max, delta), s: saturation * 100, l: lightness * 100 };
};

// Conversión cromática común: chroma + offset → RGB (0-255).
const chromaToRgb = (hue, chroma, offset) => {
    const huePrime = (hue % 360) / 60;
    const second = chroma * (1 - Math.abs((huePrime % 2) - 1));
    const sector = Math.min(5, Math.floor(huePrime));
    const [r, g, b] = [
        [chroma, second, 0],
        [second, chroma, 0],
        [0, chroma, second],
        [0, second, chroma],
        [second, 0, chroma],
        [chroma, 0, second],
    ][sector];
    return { r: (r + offset) * 255, g: (g + offset) * 255, b: (b + offset) * 255 };
};

export const hsvToRgb = ({ h, s, v }) => {
    const chroma = (v / 100) * (s / 100);
    return chromaToRgb(h, chroma, v / 100 - chroma);
};

const hslToRgb = ({ h, s, l }) => {
    const chroma = (1 - Math.abs((2 * l) / 100 - 1)) * (s / 100);
    return chromaToRgb(h, chroma, l / 100 - chroma / 2);
};

export const hexToHsv = (hex) => rgbToHsv(hexToRgb(hex));
export const hsvToHex = (hsv) => rgbToHex(hsvToRgb(hsv));
export const hsvToHsl = (hsv) => rgbToHsl(hsvToRgb(hsv));
export const hslToHsv = (hsl) => rgbToHsv(hslToRgb(hsl));

const roundTo = (value, max) => String(clamp(Math.round(value), 0, max));

export const formatRgbDraft = ({ r, g, b }) => ({ r: roundTo(r, 255), g: roundTo(g, 255), b: roundTo(b, 255) });
export const formatHslDraft = ({ h, s, l }) => ({ h: roundTo(h, 360), s: roundTo(s, 100), l: roundTo(l, 100) });

const isChannelInRange = (value, min, max) =>
    typeof value === 'string' &&
    value.trim() !== '' &&
    Number.isFinite(Number(value)) &&
    Number(value) >= min &&
    Number(value) <= max;

export const parseRgbDraft = ({ r, g, b }) => {
    if (![r, g, b].every((c) => isChannelInRange(c, 0, 255))) return null;
    return rgbToHsv({ r: Number(r), g: Number(g), b: Number(b) });
};

export const parseHslDraft = ({ h, s, l }) => {
    if (!isChannelInRange(h, 0, 360) || !isChannelInRange(s, 0, 100) || !isChannelInRange(l, 0, 100)) return null;
    return hslToHsv({ h: Number(h), s: Number(s), l: Number(l) });
};

export const getRelativePosition = ({ clientX, clientY }, rect) => ({
    x: clamp((clientX - rect.left) / rect.width, 0, 1),
    y: clamp((clientY - rect.top) / rect.height, 0, 1),
});
