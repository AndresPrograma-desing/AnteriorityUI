import React from 'react';
import styles from './index.module.css';

export default function GreenHighlight({ children, textColor, bgColor, style }) {
    const cssVarStyle = {
        ...(textColor ? { '--green-highlight-text': textColor } : {}),
        ...(bgColor ? { '--green-highlight-bg': bgColor } : {}),
        ...style,
    };
    return <strong className={styles.greenHighlight} style={cssVarStyle}>{children}</strong>;
}