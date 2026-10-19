import React from 'react';
import { FileWarning } from 'lucide-react';
import ErrorState from './index';

export default {
  title: 'Components/ErrorState',
  component: ErrorState,
};

export const Default = {
  args: {},
};

export const ConAccion = {
  args: {
    errorLabel: 'No se pudo cargar el documento',
    actionLabel: 'Abrir en pestaña nueva',
    onAction: () => window.open('https://example.com', '_blank', 'noopener,noreferrer'),
  },
};

export const IconoYColoresPersonalizados = {
  args: {
    errorLabel: 'Archivo dañado o formato no soportado',
    icon: FileWarning,
    iconColor: '#d97706',
    textColor: '#92400e',
  },
};
