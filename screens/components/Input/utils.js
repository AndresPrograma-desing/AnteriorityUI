
export const isValidNumericText = (text, { allowDecimal = false, allowNegative = false } = {}) => {
    const sign = allowNegative ? '-?' : '';
    const body = allowDecimal ? '\d*\.?\d*' : '\d*';
    return new RegExp(`^${sign}${body}$`).test(text);
};

export const clampNumber = (n, min, max) => {
    let out = n;
    if (min !== undefined && out < min) out = min;
    if (max !== undefined && out > max) out = max;
    return out;
};

export const stepNumber = (current, delta, min, max) => {
    const base = Number(current);
    const empty = current === '' || current === '-' || current === '.' || !Number.isFinite(base);
    const raw = empty ? (min ?? 0) : base + delta;
    const decimals = Math.max(
        (String(delta).split('.')[1] || '').length,
        empty ? 0 : (String(base).split('.')[1] || '').length,
    );
    // toFixed evita errores de punto flotante (0.1 + 0.2)
    return Number(clampNumber(raw, min, max).toFixed(decimals));
};

// Números vecinos al valor actual (de arriba hacia abajo: mayores primero) para el popover.
// `value: null` marca posiciones fuera de [min, max].
export const getNumberWindow = (current, step, min, max, radius = 2) => {
    const num = Number(current);
    const empty = current === '' || current === '-' || current === '.' || !Number.isFinite(num);
    const base = clampNumber(empty ? (min ?? 0) : num, min, max);
    const decimals = Math.max(
        (String(step).split('.')[1] || '').length,
        (String(base).split('.')[1] || '').length,
    );
    const items = [];
    for (let offset = radius; offset >= -radius; offset--) {
        const n = Number((base + offset * step).toFixed(decimals));
        const out = (min !== undefined && n < min) || (max !== undefined && n > max);
        items.push({ offset, value: out ? null : n });
    }
    return items;
};
