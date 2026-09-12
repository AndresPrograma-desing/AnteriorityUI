import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import CardV1 from './index';

export default {
  title: 'Components/CardV1',
  component: CardV1,
};

export const Default = {
  args: {
    badgeIcon: DollarSign,
    badgeText: 'Ingresos',
    badgeBgColor: '#dbeafe',
    badgeTextColor: '#1e40af',
    primaryText: 'Total del mes',
    secondaryText: '$12,450',
    footerIcon: TrendingUp,
    footerIconColor: '#22c55e',
    footerContent: '+12% vs mes anterior',
    actionIcon: RefreshCw,
    onActionClick: () => console.log('refresh clicked'),
    actionTooltip: 'Actualizar',
  },
};

export const WithExtraBadges = {
  args: {
    badgeIcon: DollarSign,
    badgeText: 'Ingresos',
    badgeBgColor: '#dbeafe',
    badgeTextColor: '#1e40af',
    extraBadges: [
      { text: 'Nuevo', bgColor: '#fef3c7', textColor: '#92400e' },
      { text: 'VIP', bgColor: '#fce7f3', textColor: '#9d174d' },
    ],
    primaryText: 'Total del mes',
    secondaryText: '$8,920',
    footerIcon: TrendingDown,
    footerIconColor: '#ef4444',
    footerContent: '-5% vs mes anterior',
  },
};

export const Loading = {
  args: {
    badgeText: 'Ingresos',
    isLoading: true,
    primaryText: 'Total del mes',
  },
};

export const ErrorState = {
  args: {
    badgeText: 'Ingresos',
    isError: true,
    errorText: 'No se pudo cargar',
    actionIcon: RefreshCw,
    onActionClick: () => console.log('retry clicked'),
    isSpinning: false,
  },
};
