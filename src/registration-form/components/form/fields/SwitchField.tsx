import { useController } from 'react-hook-form';
import type { FieldProps } from './FieldProps';

export function SwitchField({ label, name, required, control, description }: FieldProps) {

    const { field: input } = useController({
        name,
        control,
        rules: { required },
        defaultValue: false,
    });

    return (
        <div className="field-wrapper">
            <label className="field-label" htmlFor={name}>
                <input
                    id={name}
                    type="checkbox"
                    checked={Boolean(input.value)}
                    onBlur={input.onBlur}
                    onChange={(event) => input.onChange(event.target.checked)}
                    ref={input.ref}
                />{' '}
                {label}
                {required && <span className="field-required">*</span>}
            </label>
            {description && <p className="field-hint">{description}</p>}
        </div>
    );
}