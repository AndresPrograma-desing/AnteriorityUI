import * as React from 'react';
import Box from '@mui/material/Box';
import Checks from '../../../../../Checks/index';
import styles from './index.module.css';

// Una fila del listado. Con multiSelect muestra el checkbox (Checks) y pasa
// los colores de check por prop, igual que antes de estar desacoplado.
export default function SelectorOption({
    props,
    option,
    selected,
    multiSelect = false,
    wrapOptions = false,
    checkedBgColor,
    checkedLabelColor,
}) {
    const { key, ...optionProps } = props;
    return (
        <Box
            key={key}
            component="li"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: wrapOptions ? 'normal' : 'nowrap',
                ...optionProps.sx,
            }}
            {...optionProps}
            className={[styles.option, optionProps.className].filter(Boolean).join(' ')}
        >
            {multiSelect && (
                <Checks
                    checked={selected}
                    iconOnly
                    checkedBgColor={checkedBgColor}
                    checkedLabelColor={checkedLabelColor}
                    style={{ pointerEvents: 'none' }}
                />
            )}
            {option.icon && <img src={option.icon} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
            {option.label}
        </Box>
    );
}
