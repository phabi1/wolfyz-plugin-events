import type { Participant } from '../../../models/participant';
import type { TicketField } from '../../../models/ticket-field';
import { AddressField } from '../../form/fields/AddressField';
import { DateField } from '../../form/fields/DateField';
import { FileField } from '../../form/fields/FileField';
import { NumberField } from '../../form/fields/NumberField';
import { PhoneField } from '../../form/fields/PhoneField';
import { SelectField } from '../../form/fields/SelectField';
import { SwitchField } from '../../form/fields/SwitchField';
import { TextField } from '../../form/fields/TextField';

function ParticipantField(
	field: TicketField,
	index: number,
	control: any,
	eventId: number
) {
	const name = `participants.${ index }.fields.${ field.id }`;

	switch ( field.type ) {
		case 'text':
			return (
				<TextField
					name={ name }
					label={ field.label }
					required={ field.required }
					control={ control }
				/>
			);
		case 'date':
			return (
				<DateField
					name={ name }
					label={ field.label }
					required={ field.required }
					control={ control }
				/>
			);
		case 'number':
			return (
				<NumberField
					name={ name }
					label={ field.label }
					required={ field.required }
					control={ control }
				/>
			);
		case 'phone':
			return (
				<PhoneField
					name={ name }
					label={ field.label }
					required={ field.required }
					control={ control }
				/>
			);
		case 'address':
			return (
				<AddressField
					name={ name }
					label={ field.label }
					required={ field.required }
					control={ control }
				/>
			);
		case 'file':
			return (
				<FileField
					name={ name }
					label={ field.label }
					required={ field.required }
					uploadUrl={ `/wp-json/wolf-events/v1/events/${ eventId }/upload-file` }
					removeUrl={ `/wp-json/wolf-events/v1/events/${ eventId }/remove-file` }
					downloadUrl={ `/wp-json/wolf-events/v1/events/${ eventId }/download-file` }
					control={ control }
				/>
			);
		case 'options':
			return (
				<SelectField
					name={ name }
					label={ field.label }
					options={ field.options.values }
					required={ field.required }
					control={ control }
				/>
			);
		case 'boolean':
			return (
				<SwitchField
					name={ name }
					label={ field.label }
					required={ field.required }
					control={ control }
				/>
			);
		default:
			return <></>;
	}
}

export function ParticipantFields( {
	index,
	fields,
	control,
	eventId,
}: {
	index: number;
	fields: TicketField[];
	control: any;
	eventId: number;
} ) {
	return (
		<div>
			{ fields.map( ( field ) => (
				<div key={ field.id }>
					{ ParticipantField( field, index, control, eventId ) }
				</div>
			) ) }
		</div>
	);
}
