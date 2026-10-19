import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import Button from '../Button/index';
import styles from './index.module.css';
import { DEFAULT_ERROR_LABEL, DEFAULT_ACTION_LABEL, DEFAULT_ICON_COLOR } from './constants.js';

// Estado de error genérico (ícono + mensaje + acción opcional) para cualquier caso donde algo
// no pudo cargarse/completarse (fetch fallido, archivo corrupto, url bloqueada por CORS, etc.)
// — usado internamente por MediaViewer (PdfViewer, DocxViewer), pero es un componente
// standalone que cualquier consumidor puede usar para sus propios estados de error.
const ErrorState = ({
  errorLabel = DEFAULT_ERROR_LABEL,
  actionLabel = DEFAULT_ACTION_LABEL,
  actionIcon: ActionIcon = ExternalLink,
  onAction,
  icon: Icon = AlertCircle,
  iconColor = DEFAULT_ICON_COLOR,
  textColor,
  className = '',
  style,
}) => (
  <div className={`${styles.errorState} ${className}`} style={style}>
    <Icon size={32} className={styles.errorIcon} style={{ color: iconColor }} />
    <p className={styles.errorMsg} style={{ color: textColor }}>{errorLabel}</p>
    {onAction && (
      <Button variant="outline" size="small" icon={ActionIcon} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default ErrorState;
