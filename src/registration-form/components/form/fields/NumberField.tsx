import { useController } from 'react-hook-form';
import type { FieldProps } from './FieldProps';

export function NumberField({ label, name, required, control, description }: FieldProps) {
    const { field: input } = useController({
        name,
        control,
        rules: { required },
    });

    return (
        <div className="field-wrapper">
            <label className="field-label" htmlFor={name}>{label}
                {required && <span className="required">*</span>}
            </label>
            <input
                id={name}
                type="number"
                className="text-field"
                required={required}
                {...input}
                onChange={(event) => input.onChange(event.target.value === '' ? '' : Number(event.target.value))}
            />
            {description && <p className="field-hint">{description}</p>}
        </div>
    );
}