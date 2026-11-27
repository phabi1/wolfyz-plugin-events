import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { getMyRegistrations, MyRegistration, NotConnectedError } from './api';

const TEXT_DOMAIN = 'wolf-events';

type State =
	| { kind: 'loading' }
	| { kind: 'not-connected' }
	| { kind: 'error' }
	| { kind: 'loaded'; items: MyRegistration[] };

function formatPrice( amount: number ): string {
	return new Intl.NumberFormat( 'fr-FR', {
		style: 'currency',
		currency: 'EUR',
	} ).format( amount / 100 );
}

function formatDate( timestamp: number ): string {
	return new Intl.DateTimeFormat( 'fr-FR', { dateStyle: 'long' } ).format(
		new Date( timestamp * 1000 )
	);
}

function formatDates( event: MyRegistration[ 'event' ] ): string {
	if ( ! event?.event_start ) {
		return '';
	}
	const start = formatDate( event.event_start );
	const end = event.event_end ? formatDate( event.event_end ) : start;
	return start === end ? start : sprintf(
		/* translators: 1: start date, 2: end date */
		__( 'du %1$s au %2$s', TEXT_DOMAIN ),
		start,
		end
	);
}

const STATUS_LABELS: Record< string, string > = {
	pending: __( 'En attente de paiement', TEXT_DOMAIN ),
	paid: __( 'Payée', TEXT_DOMAIN ),
	cancelled: __( 'Annulée', TEXT_DOMAIN ),
};

/** Still to come: the event has not ended yet (or has no date). */
function isUpcoming( registration: MyRegistration, now: number ): boolean {
	const end = registration.event?.event_end ?? registration.event?.event_start;
	return ! end || end >= now;
}

function RegistrationCard( { registration }: { registration: MyRegistration } ) {
	const dates = formatDates( registration.event );

	return (
		<li className="we-my-registrations__item">
			<div className="we-my-registrations__header">
				<h4 className="we-my-registrations__title">
					{ registration.event?.title ??
						__( 'Événement supprimé', TEXT_DOMAIN ) }
				</h4>
				<span
					className={ `we-my-registrations__status is-${ registration.status }` }
				>
					{ STATUS_LABELS[ registration.status ] ?? registration.status }
				</span>
			</div>
			{ dates && <p className="we-my-registrations__dates">{ dates }</p> }
			<ul className="we-my-registrations__participants">
				{ registration.participants.map( ( participant, index ) => (
					<li key={ index }>
						{ participant.firstname } { participant.lastname }
						{ participant.ticket && (
							<span className="we-my-registrations__ticket">
								{ ' — ' }
								{ participant.ticket }
							</span>
						) }
					</li>
				) ) }
			</ul>
			<p className="we-my-registrations__amount">
				{ __( 'Montant :', TEXT_DOMAIN ) }{ ' ' }
				<strong>{ formatPrice( registration.amount ) }</strong>
			</p>
		</li>
	);
}

function Section( { title, items }: { title: string; items: MyRegistration[] } ) {
	if ( items.length === 0 ) {
		return null;
	}
	return (
		<section className="we-my-registrations__section">
			<h3>{ title }</h3>
			<ul className="we-my-registrations__list">
				{ items.map( ( registration ) => (
					<RegistrationCard key={ registration.id } registration={ registration } />
				) ) }
			</ul>
		</section>
	);
}

export function MyRegistrationsApp( {
	nonce,
	loginUrl,
}: {
	nonce: string;
	loginUrl: string;
} ) {
	const [ state, setState ] = useState< State >( { kind: 'loading' } );

	useEffect( () => {
		getMyRegistrations( nonce )
			.then( ( items ) => setState( { kind: 'loaded', items } ) )
			.catch( ( error ) =>
				setState( {
					kind: error instanceof NotConnectedError ? 'not-connected' : 'error',
				} )
			);
	}, [ nonce ] );

	switch ( state.kind ) {
		case 'loading':
			return <p>{ __( 'Chargement de vos inscriptions…', TEXT_DOMAIN ) }</p>;
		case 'not-connected':
			return (
				<p className="we-my-registrations__message">
					{ __(
						'Votre session du club a expiré ou votre compte WordPress n’est pas lié au compte du club.',
						TEXT_DOMAIN
					) }{ ' ' }
					<a href={ loginUrl }>{ __( 'Se reconnecter', TEXT_DOMAIN ) }</a>
				</p>
			);
		case 'error':
			return (
				<p className="we-my-registrations__message is-error">
					{ __(
						'Impossible de charger vos inscriptions. Réessayez plus tard.',
						TEXT_DOMAIN
					) }
				</p>
			);
	}

	if ( state.items.length === 0 ) {
		return (
			<p className="we-my-registrations__message">
				{ __( 'Vous n’avez aucune inscription à un événement.', TEXT_DOMAIN ) }
			</p>
		);
	}

	const now = Date.now() / 1000;
	const upcoming = state.items
		.filter( ( item ) => isUpcoming( item, now ) )
		.sort( ( a, b ) => ( a.event?.event_start ?? 0 ) - ( b.event?.event_start ?? 0 ) );
	const past = state.items.filter( ( item ) => ! isUpcoming( item, now ) );

	return (
		<>
			<Section title={ __( 'À venir', TEXT_DOMAIN ) } items={ upcoming } />
			<Section title={ __( 'Passées', TEXT_DOMAIN ) } items={ past } />
		</>
	);
}
