import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checks from '../../../Checks/index';
import styles from './index.module.css';
import { DEFAULT_POPPER_Z_INDEX } from './constants.js';

export default function Selector({
    label,
    value,
    onChange,
    options = [],
    id = "custom-autocomplete",
    style = {},
    className = "",
    fullWidth = true,
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
    popperZIndex = DEFAULT_POPPER_Z_INDEX
}) {
    const normalizeVal = (val) => String(val || '').toLowerCase().replace(/[_\s\/-]+/g, '');

    const findOption = (val) =>
        (val !== "" && val !== undefined && val !== null)
            ? options.find(opt =>
                String(opt.value) === String(val) ||
                normalizeVal(opt.value) === normalizeVal(val) ||
                normalizeVal(opt.label) === normalizeVal(val)
              ) || null
            : null;

    const selectedOption = multiSelect ? undefined : findOption(value);
    const selectedOptions = multiSelect
        ? (Array.isArray(value) ? value : []).map(findOption).filter(Boolean)
        : undefined;

    const displayLabel = label ? (
        <span>
            {label}
            {required && <span style={{ color: requiredColor, marginLeft: '4px' }}>**</span>}
        </span>
    ) : undefined;

    return (
        <Autocomplete
            id={id}
            sx={{ width: fullWidth ? '100%' : 300, m: 0 }}
            style={style}
            className={className}
            options={options}
            autoHighlight
            openOnFocus
            disableClearable={disableClearable}
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
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                    <Box
                        key={key}
                        component="li"
                        sx={{ display: 'flex', alignItems: 'center', gap: '8px', ...optionProps.sx }}
                        {...optionProps}
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
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={displayLabel}
                    placeholder={placeholder}
                    size="small"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                        form: {
                            autocomplete: 'off',
                        },
                    }}
                    slotProps={{
                        ...params.slotProps,
                        htmlInput: {
                            ...params.slotProps?.htmlInput,
                            autoComplete: 'off',
                            name: 'no-autofill-' + Math.random(),
                        },
                    }}
                />
            )}
        />
    );
}