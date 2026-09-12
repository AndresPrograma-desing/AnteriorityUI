import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Barnner from './index';

export default {
  title: 'Components/Barnner',
  component: Barnner,
};

export const Default = {
  args: {
    type: 'default',
    children: 'Default',
  },
};

export const Success = {
  args: {
    type: 'success',
    icon: CheckCircle,
    children: 'Completado',
  },
};

export const Warning = {
  args: {
    type: 'warning',
    icon: AlertTriangle,
    children: 'Pendiente',
  },
};

export const Danger = {
  args: {
    type: 'danger',
    icon: XCircle,
    children: 'Cancelado',
  },
};
