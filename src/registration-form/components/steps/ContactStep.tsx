import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';
import { TEXT_DOMAIN } from '../../constants';
import { useRegistrationStore } from '../../store';
import { TextField } from '../form/fields/TextField';
import { Button } from '../ui/Button';
import { useStepper } from '../ui/stepper/context';

export function ContactStep() {
	const { nextStep } = useStepper();
	const contact = useRegistrationStore( ( state ) => state.contact );
	const setContact = useRegistrationStore( ( state ) => state.setContact );
	const {
		handleSubmit,
		control,
		formState: { errors, isValid },
	} = useForm( {
		mode: 'onChange',
		defaultValues: contact,
	} );

	const onSubmit = handleSubmit( ( data ) => {
		setContact( data );
		nextStep();
	} );

	return (
		<form onSubmit={ onSubmit }>
			<h3>{ __( 'Informations de contact', TEXT_DOMAIN ) }</h3>
			<p>
				{ __(
					'Personne de contact principale pour cette reservation.',
					TEXT_DOMAIN
				) }
			</p>

			<div className="we-registration__grid">
				<TextField
					name="firstname"
					label={ __( 'Prenom', TEXT_DOMAIN ) }
					required
					control={ control }
				/>

				<TextField
					name="lastname"
					label={ __( 'Nom', TEXT_DOMAIN ) }
					required
					control={ control }
				/>

				<TextField
					name="email"
					label={ __( 'Email', TEXT_DOMAIN ) }
					required
					control={ control }
					type="email"
				/>

				<TextField
					name="phone"
					label={ __( 'Telephone', TEXT_DOMAIN ) }
					required
					control={ control }
					type="tel"
				/>
			</div>

			<TextField
				name="message"
				label={ __( 'Message (optionnel)', TEXT_DOMAIN ) }
				control={ control }
				multiline
			/>

			{ Object.keys( errors ).length > 0 && (
				<p className="we-registration__error">
					{ __(
						'Veuillez completer les informations obligatoires.',
						TEXT_DOMAIN
					) }
				</p>
			) }
			<div>
				<Button type="submit" disabled={ ! isValid }>
					{ __( 'Suivant', TEXT_DOMAIN ) }
				</Button>
			</div>
		</form>
	);
}
