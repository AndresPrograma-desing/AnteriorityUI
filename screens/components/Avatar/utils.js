export const getAvatarInitial = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.charAt(0).toUpperCase();
};

const PALETTE = [
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
  '#6366f1',
  '#14b8a6',
  '#f43f5e',
  '#0284c7',
];

export const stringToColor = (str) => {
  if (!str) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
};
