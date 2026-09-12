import React from 'react';
import { Star, Clock, AlertTriangle } from 'lucide-react';
import Badge from './index';

export default {
  title: 'Components/Badge',
  component: Badge,
};

export const Default = {
  args: {
    label: 'Estado',
    value: 'Activo',
  },
};

export const WithIcon = {
  args: {
    icon: Star,
    label: 'Puntaje',
    value: '4.8',
    iconColor: '#f59e0b',
  },
};

export const ValueOnly = {
  args: {
    icon: Clock,
    value: '12:30',
  },
};

export const Warning = {
  args: {
    icon: AlertTriangle,
    label: 'Alerta',
    value: 'Revisar',
    iconColor: '#ef4444',
  },
};
