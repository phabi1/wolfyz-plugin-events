import { useController } from 'react-hook-form';
import type { FieldProps } from './FieldProps';

type Address = {
    line1?: string;
    line2?: string;
    zipcode?: string;
    city?: string;
    country?: string;
};

export function AddressField({ label, name, control, required, description }: FieldProps) {
    const { field: input } = useController({
        name,
        control,
        rules: { required },
        defaultValue: {},
    });
    const address = (input.value ?? {}) as Address;

    return (
        <div className="field-wrapper">
            <div className="field-label">{label}
                {required && <span className="required">*</span>}
            </div>
            {description && <p className="field-hint">{description}</p>}
            <div className="address-field">
                <input
                    type="text"
                    placeholder="Line 1"
                    value={address.line1 ?? ''}
                    onChange={(event) => input.onChange({ ...address, line1: event.target.value })}
                    className="text-field"
                />
                <input
                    type="text"
                    placeholder="Line 2"
                    value={address.line2 ?? ''}
                    onChange={(event) => input.onChange({ ...address, line2: event.target.value })}
                    className="text-field"
                />
                <div className="address-field-row">
                    <input
                        type="text"
                        placeholder="Postal code"
                        value={address.zipcode ?? ''}
                        onChange={(event) => input.onChange({ ...address, zipcode: event.target.value })}
                        className="text-field"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={address.city ?? ''}
                        onChange={(event) => input.onChange({ ...address, city: event.target.value })}
                        className="text-field"
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={address.country ?? ''}
                        onChange={(event) => input.onChange({ ...address, country: event.target.value })}
                        className="text-field"
                    />
                </div>
            </div>
        </div>
    );
}