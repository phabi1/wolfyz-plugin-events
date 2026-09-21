import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { TEXT_DOMAIN } from '../../constants';
import { useRegistrationStore } from '../../store';
import { ParticipantFormValue, findChangedParticipantIndex, validateParticipantIdentityAsync } from '../../validators/participant';
import { Button } from '../ui/Button';
import { useStepper } from '../ui/stepper/context';
import { ParticipantInfo } from './participants/ParticipantInfo';



export function ParticipantsStep() {
	const { nextStep } = useStepper();
	const participants = useRegistrationStore((state) => state.participants);
	const tickets = useRegistrationStore((state) => state.tickets);
	const eventId = useRegistrationStore((state) => state.id);
	const setParticipants = useRegistrationStore((state) => state.setParticipants);
	const {
		control,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors, isValid },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			participants,
		},
	});

	const { fields } = useFieldArray({
		control,
		name: 'participants',
	});

	const onSubmit = handleSubmit((data) => {
		setParticipants(data.participants);
		nextStep();
	});

	return (
		<form onSubmit={onSubmit}>
			<h3>{__('Informations des participants', TEXT_DOMAIN)}</h3>
			<p>
				{__(
					'Chaque billet correspond a un participant avec des informations distinctes.',
					TEXT_DOMAIN
				)}
			</p>

			<div className="we-registration__participant-list">
				{fields.map((participant, index) => (
					<ParticipantInfo
						key={participant.id}
						index={index}
						participant={participant}
						tickets={tickets}
						control={control}
						eventId={eventId}
					/>
				))}
			</div>

			{errors.participants && (
				<p className="we-registration__error">
					{__(
						'Veuillez verifier les informations de chaque participant.',
						TEXT_DOMAIN
					)}
				</p>
			)}
			<div>
				<Button type="submit" disabled={!isValid}>
					{__('Suivant', TEXT_DOMAIN)}
				</Button>
			</div>
		</form>
	);
}
