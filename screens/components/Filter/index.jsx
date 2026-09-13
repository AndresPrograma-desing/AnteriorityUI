import React, { useState } from 'react';
import { Filter as FilterIcon, Trash2, Search } from 'lucide-react';
import DrawPanel from '../DrawPanel/index';
import Button from '../Button/index';
import styles from './index.module.css';
import ModalTooltip from '../ModalTooltip/ModalTooltip';

const Filter = ({
    children,
    onClear,
    onApply,
    searchTerm = '',
    width = '350px',
    title = 'Filtros',
    activeFiltersCount = 0,
    badgeColor,
    confirmText = 'Aplicar',
    cancelText = 'Cancelar',
    loading = false,
    panelColor,
    borderColor,
    textColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleApply = () => {
        setIsOpen(false);
        if (onApply) onApply();
    };

    const handleClear = () => {
        if (onClear) onClear();
    };

    return (
        <div className={styles.filterWrapper}>
            <div className={styles.filterBar}>
                <div className={styles.actions}>
                    <div className={styles.filterButtonWrapper}>
                        <Button
                            onClick={() => setIsOpen(true)}
                            variant={Button.VARIANTS.PRIMARY}
                        >
                            <FilterIcon size={18} /> Filtrar
                        </Button>
                        {activeFiltersCount > 0 && (
                            <div className={styles.badgeWrapper}>
                                <ModalTooltip text="Filtros aplicados" position="top">
                                    <span
                                        className={styles.filterBadge}
                                        style={badgeColor ? { '--filter-badge-bg': badgeColor } : undefined}
                                    >
                                        {activeFiltersCount}
                                    </span>
                                </ModalTooltip>
                            </div>
                        )}
                    </div>
                    {onClear && (
                        <Button
                            onClick={handleClear}
                            variant={Button.VARIANTS.DANGER}
                            color={Button.COLORS.TRANSPARENT}
                            borderColor="var(--border-gray-low)"
                        >
                            <Trash2 size={18} /> Limpiar
                        </Button>
                    )}
                </div>
                {searchTerm !== undefined && searchTerm !== null && searchTerm !== '' && (
                    <div className={styles.searchIndicator}>
                        <Search size={16} />
                        <span>Buscar: {searchTerm}</span>
                    </div>
                )}
            </div>

            <DrawPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={title}
                width={width}
                showActions
                onConfirm={handleApply}
                confirmText={confirmText}
                cancelText={cancelText}
                loading={loading}
                panelColor={panelColor}
                borderColor={borderColor}
                textColor={textColor}
            >
                <div className={styles.fields}>
                    {children}
                </div>
            </DrawPanel>
        </div>
    );
};

export default Filter;