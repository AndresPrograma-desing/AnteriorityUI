import * as React from 'react';
import TextField from '@mui/material/TextField';

// Input del Autocomplete. En variant="flat" usa TextField "standard" sin subrayado
// (sin caja ni borde). En "outlined" queda igual que antes.
export default function SelectorInput({
    params,
    label,
    placeholder,
    isFlat = false,
}) {
    return (
        <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            size="small"
            variant={isFlat ? 'standard' : 'outlined'}
            sx={isFlat ? { width: 'auto', '& .MuiInputBase-root': { width: 'auto', flexWrap: 'nowrap' } } : undefined}
            inputProps={{
                ...params.inputProps,
                // flat = badge de estado: el texto no es editable; el listado igual se abre al clickear.
                readOnly: isFlat,
                autoComplete: 'off',
                form: {
                    autocomplete: 'off',
                },
            }}
            slotProps={{
                ...params.slotProps,
                ...(isFlat ? { input: { ...params.slotProps?.input, disableUnderline: true } } : {}),
                htmlInput: {
                    ...params.slotProps?.htmlInput,
                    autoComplete: 'off',
                    name: 'no-autofill-' + Math.random(),
                },
            }}
        />
    );
}
