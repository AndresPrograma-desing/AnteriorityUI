export function getNextFilterValue(options, currentValue) {
  if (!Array.isArray(options) || options.length === 0) return currentValue;
  const currentIndex = options.findIndex((option) => option.value === currentValue);
  const nextIndex = (currentIndex + 1) % options.length;
  return options[nextIndex].value;
}

export function getFilterOptionLabel(options, value) {
  if (!Array.isArray(options)) return undefined;
  return options.find((option) => option.value === value)?.label;
}
