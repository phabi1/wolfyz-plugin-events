import { useController } from 'react-hook-form';
import type { FieldProps } from './FieldProps';

type SelectFieldProps = FieldProps & {
	options: string[];
};

function getOptions( settings: Record< string, any > ): string[] {
	const options = settings.options ?? [];
	return Array.isArray( options ) ? options : Object.keys( options );
}

export function SelectField( {
	label,
	name,
	required,
	control,
	options,
	description,
}: SelectFieldProps ) {
	const { field: input } = useController( {
		name,
		control,
		rules: { required },
	} );
	// const options = getOptions(field.options);

	return (
		<div className="field-wrapper">
			<label className="field-label" htmlFor={ name }>
				{ label }
				{ required && <span className="required">*</span> }
			</label>
			<select
				id={ name }
				className="text-field"
				required={ required }
				{ ...input }
			>
				<option value="">-</option>
				{ options.map( ( option ) => (
					<option key={ option } value={ option }>
						{ option }
					</option>
				) ) }
			</select>
			{ description && <p className="field-hint">{ description }</p> }
		</div>
	);
}
