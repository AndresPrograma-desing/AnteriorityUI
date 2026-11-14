import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './index.module.css';
import { DEFAULT_POPPER_Z_INDEX, DEFAULT_SELECTED_TOOLTIP_THRESHOLD } from './constants.js';
import ModalTooltip from '../../../ModalTooltip/ModalTooltip';
import { normalizeVal, createFindOption, measureTextPx } from './utils.js';
import { SelectorOption, SelectorInput } from './components/index';

export default function Selector({
    label,
    value,
    onChange,
    options = [],
    id = "custom-autocomplete",
    style = {},
    className = "",
    fullWidth,
    variant = 'outlined',
    textColor,
    iconColor,
    bgColor,
    borderColor,
    wrapOptions = false,
    placeholder,
    required,
    requiredColor = "red",
    disableClearable = false,
    hideScrollbar = true,
    multiSelect = false,
    checkedBgColor,
    checkedLabelColor,
    scrollbarColor,
    chipBgColor,
    chipTextColor,
    chipIconColor,
    popperZIndex = DEFAULT_POPPER_Z_INDEX,
    showSelectedTooltip = true,
    selectedTooltipThreshold = DEFAULT_SELECTED_TOOLTIP_THRESHOLD,
    selectedTooltipPosition = 'top',
    selectedTooltipDelay,
    selectedTooltipBgColor,
    selectedTooltipTextColor,
    selectedTooltipProps,
}) {
    const findOption = createFindOption(options);

    const selectedOption = multiSelect ? undefined : findOption(value);
    const selectedOptions = multiSelect
        ? (Array.isArray(value) ? value : []).map(findOption).filter(Boolean)
        : undefined;

    // variant="flat": sin caja ni borde ni subrayado; el texto se muestra completo
    // (ancho según contenido, sin ellipsis). fullWidth por default es true solo en "outlined".
    const isFlat = variant === 'flat';
    const resolvedFullWidth = fullWidth ?? !isFlat;

    // En flat el input se dimensiona en ch según el texto visible (label seleccionado o
    // placeholder), así el valor se ve completo y no queda cortado.
    const flatText = multiSelect ? (placeholder || '') : (selectedOption?.label || placeholder || '');
    const flatInputWidth = `${Math.ceil(measureTextPx(flatText) + 2)}px`;

    const displayLabel = label ? (
        <span>
            {label}
            {required && <span style={{ color: requiredColor, marginLeft: '4px' }}>**</span>}
        </span>
    ) : undefined;

    // Tooltip con todas las selecciones (solo multiSelect, opt-in por prop) cuando superan el umbral.
    const showTooltipNow = showSelectedTooltip && multiSelect && (selectedOptions?.length ?? 0) > selectedTooltipThreshold;
    const selectedLabelsText = (selectedOptions ?? []).map((opt) => opt.label).join(', ');

    const autocomplete = (
        <Autocomplete
            id={id}
            sx={isFlat
                ? {
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: resolvedFullWidth ? '100%' : 'auto',
                    m: 0,
                    px: '12px',
                    py: '4px',
                    borderRadius: '15px', // badge: pastilla redondeada
                    background: bgColor ?? 'color-mix(in srgb, currentColor 12%, transparent)',
                    border: `1px solid ${borderColor ?? 'transparent'}`,
                    cursor: 'pointer',
                    // "&&" sube la especificidad para ganarle al width/min-width que MUI
                    // le pone al input de Autocomplete.
                    '&& .MuiAutocomplete-input': {
                        ...(textColor ? { color: textColor } : {}),
                        flexGrow: 0,
                        width: flatInputWidth,
                        minWidth: 0,
                        padding: 0,
                        cursor: 'pointer',
                        textOverflow: 'clip',
                        overflow: 'visible',
                    }
                }
                : {
                    width: resolvedFullWidth ? '100%' : 300,
                    m: 0,
                    // multiSelect: los chips no hacen salto de línea (el campo no crece en alto),
                    // los que no entran se recortan y el tooltip lista todos.
                    ...(multiSelect ? {
                        '& .MuiAutocomplete-inputRoot': { flexWrap: 'nowrap', overflow: 'hidden', minWidth: 0 },
                        '& .MuiChip-root': { maxWidth: '100%', minWidth: 0 },
                    } : {}),
                }}
            style={style}
            className={className}
            options={options}
            autoHighlight
            openOnFocus
            disableClearable={disableClearable || isFlat}
            multiple={multiSelect}
            disableCloseOnSelect={multiSelect}
            getOptionLabel={(option) => option.label || ""}
            value={multiSelect ? selectedOptions : selectedOption}
            onChange={(event, newValue) => {
                if (multiSelect) {
                    onChange({ target: { value: newValue.map((opt) => opt.value) } });
                } else {
                    onChange({ target: { value: newValue ? newValue.value : "" } });
                }
            }}
            isOptionEqualToValue={(option, val) =>
                String(option.value) === String(val?.value) ||
                normalizeVal(option.value) === normalizeVal(val?.value) ||
                normalizeVal(option.label) === normalizeVal(val?.label)
            }
            slotProps={{
                popper: {
                    sx: { zIndex: popperZIndex }
                },
                // Sin wrapOptions el listado toma el ancho de su contenido y las opciones no hacen
                // salto de línea, pero nunca más angosto que el input (minWidth 100% del popper, que mide
                // lo mismo que el campo): un selector ancho tiene un desplegable igual de ancho.
                paper: wrapOptions ? undefined : {
                    sx: { width: 'max-content', minWidth: '100%', maxWidth: 'min(90vw, 480px)' }
                },
                popupIndicator: iconColor ? { sx: { color: iconColor } } : undefined,
                chip: (chipBgColor || chipTextColor || chipIconColor) ? {
                    sx: {
                        ...(chipBgColor ? { backgroundColor: chipBgColor } : {}),
                        ...(chipTextColor ? { color: chipTextColor } : {}),
                        ...(chipIconColor ? { '& .MuiChip-deleteIcon': { color: chipIconColor } } : {})
                    }
                } : undefined,
                // hideScrollbar=true (default): la lista sigue haciendo scroll (rueda/teclado/
                // touch), solo se oculta la barra. hideScrollbar=false: barra visible con la
                // misma estética (grosor/color) que el componente ScrollBar de la librería.
                listbox: hideScrollbar
                    ? {
                        sx: {
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            '&::-webkit-scrollbar': { display: 'none' }
                        }
                    }
                    : {
                        className: styles.listbox,
                        style: scrollbarColor ? { '--selector-scrollbar-thumb': scrollbarColor } : undefined
                    }
            }}
            renderOption={(props, option, { selected }) => (
                <SelectorOption
                    key={props.key}
                    props={props}
                    option={option}
                    selected={selected}
                    multiSelect={multiSelect}
                    wrapOptions={wrapOptions}
                    checkedBgColor={checkedBgColor}
                    checkedLabelColor={checkedLabelColor}
                />
            )}
            renderInput={(params) => (
                <SelectorInput
                    params={params}
                    label={displayLabel}
                    placeholder={placeholder}
                    isFlat={isFlat}
                />
            )}
        />
    );

    if (!showTooltipNow) return autocomplete;

    return (
        // selectedTooltipProps va primero: text, children y el ancho del wrapper son del Selector.
        <ModalTooltip
            {...selectedTooltipProps}
            text={selectedLabelsText}
            position={selectedTooltipPosition}
            delay={selectedTooltipDelay}
            bgColor={selectedTooltipBgColor}
            textColor={selectedTooltipTextColor}
            style={{ display: 'block', width: '100%', ...selectedTooltipProps?.style }}
        >
            {autocomplete}
        </ModalTooltip>
    );
}
