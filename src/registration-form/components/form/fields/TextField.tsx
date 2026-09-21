import { useController } from 'react-hook-form';
import { FieldProps } from './FieldProps';

type TextFieldProps = FieldProps & {
    type?: string;
    multiline?: boolean;
};

export function TextField({
    name,
    label,
    required,
    control,
    type,
    multiline,
    description,
}: TextFieldProps) {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: {
            required,
        },
    });
    return (
        <div className="field-wrapper">
            <label className="field-label" htmlFor={name}>{label}
                {required && <span className="required">*</span>}
            </label>
            {multiline ? (
                <textarea id={name} className="text-field" {...field} />
            ) : (
                <input id={name} type={type ?? "text"} className="text-field" {...field} />
            )}
            {error && <span className="field-error">{error.message}</span>}
            {description && <p className="field-hint">{description}</p>}
        </div>
    );
}