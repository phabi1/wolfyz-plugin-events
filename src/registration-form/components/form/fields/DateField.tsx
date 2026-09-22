import { useController } from 'react-hook-form';
import type { FieldProps } from './FieldProps';
import { FormErrors } from '../Errors';

export function DateField( {
	label,
	name,
	required,
	control,
	description,
}: FieldProps ) {
	const {
		field,
		fieldState: { error },
	} = useController( {
		name,
		control,
		rules: { required },
	} );

	return (
		<div className="field-wrapper">
			<label className="field-label" htmlFor={ name }>
				{ label }
				{ required && <span className="required">*</span> }
			</label>
			<input
				id={ name }
				type="date"
				className="text-field"
				required={ required }
				{ ...field }
			/>
			{ error && <span className="field-error">{ error.message }</span> }
			{ description && <p className="field-hint">{ description }</p> }
		</div>
	);
}
