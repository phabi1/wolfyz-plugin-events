import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { ContactStep } from './components/steps/ContactStep';
import { ParticipantsStep } from './components/steps/ParticipantsStep';
import { SummaryStep } from './components/steps/SummaryStep';
import { TicketSelectionStep } from './components/steps/TicketSelectionStep';
import { Step } from './components/ui/stepper/Step';
import { Stepper } from './components/ui/stepper/Stepper';
import { TEXT_DOMAIN } from './constants';
import { useRegistrationStore } from './store';

export function RegistrationApp( { eventId }: { eventId: string } ) {
	const loading = useRegistrationStore( ( state ) => state.loading );
	const event = useRegistrationStore( ( state ) => state.event );
	const submitted = useRegistrationStore( ( state ) => state.submitted );
	const init = useRegistrationStore( ( state ) => state.init );

	useEffect( () => {
		init( +eventId );
	}, [ eventId ] );

	if ( loading ) {
		return <p>{ __( 'Loading...', TEXT_DOMAIN ) }</p>;
	}

	if ( ! event ) {
		return <p>{ __( 'Event not found', TEXT_DOMAIN ) }</p>;
	}

	const now = Date.now() / 1000;
	if ( event.registration_start && now < event.registration_start ) {
		return <p>{ __( 'Registration has not started yet', TEXT_DOMAIN ) }</p>;
	}
	if ( event.registration_end && now > event.registration_end ) {
		return <p>{ __( 'Registration has ended', TEXT_DOMAIN ) }</p>;
	}

	return (
		<>
			<div>{ event.title }</div>
			<Stepper>
				<Step label={ __( 'Tickets', TEXT_DOMAIN ) }>
					<TicketSelectionStep />
				</Step>
				<Step label={ __( 'Participants', TEXT_DOMAIN ) }>
					<ParticipantsStep />
				</Step>
				<Step label={ __( 'Contact', TEXT_DOMAIN ) }>
					<ContactStep />
				</Step>
				<Step label={ __( 'Summary', TEXT_DOMAIN ) }>
					<SummaryStep />
				</Step>
			</Stepper>
		</>
	);
}
