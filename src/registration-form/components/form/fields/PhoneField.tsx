import { useController } from 'react-hook-form';
import type { FieldProps } from './FieldProps';

export function PhoneField( {
	label,
	name,
	required,
	control,
	description,
}: FieldProps ) {
	const {
		field: input,
		fieldState: { error },
	} = useController( {
		name,
		control,
		rules: {
			required,
			pattern: {
				value: /^(\+33|0)[1-9](\d{2}){4}$/, // Format french
				message: 'Format invalide',
			},
		},
	} );

	return (
		<div className="field-wrapper">
			<label className="field-label" htmlFor={ name }>
				{ label }
				{ required && <span className="required">*</span> }
			</label>
			<input
				id={ name }
				type="tel"
				className="text-field"
				required={ required }
				{ ...input }
			/>
			{ error && <span className="field-error">{ error.message }</span> }
			{ description && <p className="field-hint">{ description }</p> }
		</div>
	);
}
