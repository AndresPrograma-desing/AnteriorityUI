import { Info, AlertTriangle, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react';

export const DEFAULT_VARIANT = 'info';

export const VARIANT_PALETTE = {
  info: {
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#1d4ed8',
    iconColor: '#2563eb',
    icon: Info,
  },
  warning: {
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    textColor: '#b45309',
    iconColor: '#d97706',
    icon: AlertTriangle,
  },
  danger: {
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    textColor: '#b91c1c',
    iconColor: '#dc2626',
    icon: AlertCircle,
  },
  success: {
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    textColor: '#15803d',
    iconColor: '#22c55e',
    icon: CheckCircle,
  },
  neutral: {
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    textColor: '#334155',
    iconColor: '#64748b',
    icon: MessageCircle,
  },
};
