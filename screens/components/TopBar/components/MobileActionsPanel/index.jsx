import React from 'react';
import DrawPanel from '../../../DrawPanel/index';
import styles from './index.module.css';
import { DEFAULT_MOBILE_ACTIONS_PANEL_TITLE } from '../../constants.js';

function MobileActionsPanel({ open, onClose, actions, title = DEFAULT_MOBILE_ACTIONS_PANEL_TITLE }) {
    return (
        <DrawPanel isOpen={open} onClose={onClose} title={title} width="300px">
            <div className={styles.list}>
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    const hasBadge = action.badge !== undefined && action.badge !== null && action.badge !== false;
                    const isDotBadge = action.badge === true;

                    return (
                        <button
                            key={action.key ?? index}
                            type="button"
                            className={styles.item}
                            disabled={action.disabled}
                            onClick={() => {
                                onClose();
                                action.onClick && action.onClick();
                            }}
                        >
                            {Icon && <Icon size={18} className={styles.itemIcon} />}
                            <span className={styles.itemLabel}>{action.tooltip}</span>
                            {hasBadge && (
                                <span className={styles.itemBadge}>
                                    {isDotBadge ? '' : action.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </DrawPanel>
    );
}

export default MobileActionsPanel;
