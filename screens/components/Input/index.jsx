import React, { forwardRef } from 'react';
import TextField from '../Material-UI/Components/TextField/index';
import NumericInput from './NumericInput';

const Input = forwardRef(({ 
    label, 
    id, 
    className = '', 
    error, 
    helperText, 
    required, 
    requiredColor = 'red',
    numeric = false,
    ...props 
}, ref) => {
    const displayLabel = label ? (
        <span>
            {label}
            {required && <span style={{ color: requiredColor, marginLeft: '4px' }}>**</span>}
        </span>
    ) : undefined;

    const Field = numeric ? NumericInput : TextField;

    return (
        <Field
            id={id}
            label={displayLabel}
            error={error}
            helperText={error || helperText}
            ref={ref}
            className={className}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export default Input;