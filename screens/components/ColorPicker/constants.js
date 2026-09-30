export const SATURATION_OVERLAY_BACKGROUND =
    'linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, transparent)';

export const HUE_TRACK_BACKGROUND =
    'linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), ' +
    'hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))';

export const HUE_MAX = 360;
export const PERCENT_MAX = 100;
export const HUE_KEYBOARD_STEP = 2;
export const PERCENT_KEYBOARD_STEP = 2;

// Ventana en la que se agrupan los onChange mientras se arrastra (se hace flush al soltar).
export const COMMIT_THROTTLE_MS = 80;

export const COLOR_FORMATS = { HEX: 'HEX', RGB: 'RGB', HSL: 'HSL' };
export const COLOR_FORMAT_OPTIONS = [COLOR_FORMATS.HEX, COLOR_FORMATS.RGB, COLOR_FORMATS.HSL];
export const RGB_CHANNEL_KEYS = ['r', 'g', 'b'];
export const HSL_CHANNEL_KEYS = ['h', 's', 'l'];

export const DEFAULT_LABELS = {
    saturation: 'Saturación y brillo',
    hue: 'Matiz',
    invalidHex: 'Color hexadecimal inválido',
    invalidRgb: 'Valores RGB inválidos (0-255)',
    invalidHsl: 'Valores HSL inválidos (H 0-360, S/L 0-100)',
    channels: { r: 'R', g: 'G', b: 'B', h: 'H', s: 'S', l: 'L' },
};
