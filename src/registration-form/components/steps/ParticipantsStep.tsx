import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Participant } from '../../models/participant';
import type { Ticket } from '../../models/ticket';
import { TEXT_DOMAIN } from '../../constants';
import { checkMemberExists } from '../../services/registration';
import { useRegistrationStore } from '../../store';
import { Button } from '../ui/Button';
import { useStepper } from '../ui/stepper/context';
import { ParticipantInfo } from './participants/ParticipantInfo';

type ParticipantsForm = {
	participants: Participant[];
};

const REQUIRED_MESSAGE = 'Ce champ est requis';
const BIRTHDATE_FORMAT_MESSAGE = 'La date doit etre au format DD/MM/YYYY';
const MEMBER_CHECK_DEBOUNCE_MS = 400;

type MemberCheckPayload = {
	firstname: string;
	lastname: string;
	birthdate: string;
};

function isMemberTicket(
	ticket: Pick< Ticket, 'member_only' > | undefined
): boolean {
	return Boolean( ticket?.member_only );
}

function hasValue( value: unknown ): boolean {
	if ( typeof value === 'string' ) {
		return value.trim().length > 0;
	}

	if ( typeof value === 'boolean' ) {
		return value;
	}

	if ( Array.isArray( value ) ) {
		return value.length > 0;
	}

	if ( value && typeof value === 'object' ) {
		return Object.values( value as Record< string, unknown > ).some(
			( item ) => hasValue( item )
		);
	}

	return value !== null && value !== undefined;
}

function isValidBirthdate( value: string ): boolean {
	const normalized = value.trim();
	const match = normalized.match( /^(\d{2})\/(\d{2})\/(\d{4})$/ );
	if ( ! match ) {
		return false;
	}

	const day = Number( match[ 1 ] );
	const month = Number( match[ 2 ] );
	const year = Number( match[ 3 ] );

	const date = new Date( Date.UTC( year, month - 1, day ) );

	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

function toApiBirthdate( value: string ): string {
	const match = value.trim().match( /^(\d{2})\/(\d{2})\/(\d{4})$/ );
	if ( ! match ) {
		return value;
	}

	const day = match[ 1 ];
	const month = match[ 2 ];
	const year = match[ 3 ];

	return `${ year }-${ month }-${ day }`;
}

function buildParticipantSchema(
	ticketId: number,
	ticketFields: Ticket[ 'fields' ],
	isMemberOnlyTicket: boolean,
	memberExistsChecker: ( payload: MemberCheckPayload ) => Promise< boolean >,
	eventId: number
) {
	return z
		.object( {
			ticket_id: z.literal( ticketId ),
			firstname: z.string().trim().min( 1, REQUIRED_MESSAGE ),
			lastname: z.string().trim().min( 1, REQUIRED_MESSAGE ),
			birthdate: z
				.string()
				.trim()
				.min( 1, REQUIRED_MESSAGE )
				.refine( isValidBirthdate, BIRTHDATE_FORMAT_MESSAGE ),
			fields: z.record( z.string(), z.any() ).default( {} ),
		} )
		.superRefine( async ( participant, ctx ) => {
			for ( const field of ticketFields ?? [] ) {
				if ( ! field.required ) {
					continue;
				}

				if (
					! hasValue( participant.fields?.[ String( field.id ) ] )
				) {
					ctx.addIssue( {
						code: z.ZodIssueCode.custom,
						path: [ 'fields', String( field.id ) ],
						message: REQUIRED_MESSAGE,
					} );
				}
			}

			if ( ! isMemberOnlyTicket ) {
				return;
			}

			if (
				! participant.firstname ||
				! participant.lastname ||
				! participant.birthdate
			) {
				return;
			}

			if ( ! isValidBirthdate( participant.birthdate ) ) {
				return;
			}

			try {
				const exists = await memberExistsChecker( {
					firstname: participant.firstname,
					lastname: participant.lastname,
					birthdate: toApiBirthdate( participant.birthdate ),
				} );

				if ( ! exists ) {
					ctx.addIssue( {
						code: z.ZodIssueCode.custom,
						path: [ 'birthdate' ],
						message: "Aucun adherent correspondant n'a ete trouve",
					} );
				}
			} catch ( _error ) {
				ctx.addIssue( {
					code: z.ZodIssueCode.custom,
					path: [ 'birthdate' ],
					message: 'Verification adherent indisponible',
				} );
			}
		} );
}

function buildFormSchema(
	tickets: Ticket[],
	eventId: number,
	memberExistsChecker: ( payload: MemberCheckPayload ) => Promise< boolean >
) {
	const participantSchemas = tickets.map( ( ticket ) =>
		buildParticipantSchema(
			ticket.id,
			ticket.fields ?? [],
			isMemberTicket( ticket ),
			memberExistsChecker,
			eventId
		)
	);

	const participantSchema = participantSchemas.length
		? z.discriminatedUnion( 'ticket_id', participantSchemas as any )
		: z.object( {
				ticket_id: z.number().int().positive( 'Le billet est requis' ),
				firstname: z.string().trim().min( 1, REQUIRED_MESSAGE ),
				lastname: z.string().trim().min( 1, REQUIRED_MESSAGE ),
				birthdate: z
					.string()
					.trim()
					.min( 1, REQUIRED_MESSAGE )
					.refine( isValidBirthdate, BIRTHDATE_FORMAT_MESSAGE ),
				fields: z.record( z.string(), z.any() ).default( {} ),
		  } );

	return z.object( {
		participants: z
			.array( participantSchema )
			.min( 1, 'Au moins un participant est requis' )
			.superRefine( ( participants, ctx ) => {
				const byTicket = new Map< number, number >();
				for ( const participant of participants ) {
					byTicket.set(
						participant.ticket_id,
						( byTicket.get( participant.ticket_id ) ?? 0 ) + 1
					);
				}

				for ( const ticket of tickets ) {
					const expected = ticket.quantity || 0;
					const current = byTicket.get( ticket.id ) ?? 0;

					if ( expected !== current ) {
						ctx.addIssue( {
							code: z.ZodIssueCode.custom,
							message:
								'Le nombre de participants ne correspond pas aux billets selectionnes.',
						} );
						break;
					}
				}
			} ),
	} );
}

export function ParticipantsStep() {
	const { nextStep } = useStepper();
	const participants = useRegistrationStore(
		( state ) => state.participants
	);
	const tickets = useRegistrationStore( ( state ) => state.tickets );
	const eventId = useRegistrationStore( ( state ) => state.id );
	const setParticipants = useRegistrationStore(
		( state ) => state.setParticipants
	);
	const requestCounterRef = useRef< Map< number, number > >( new Map() );
	const memberCheckTimersRef = useRef<
		Map< string, ReturnType< typeof setTimeout > >
	>( new Map() );
	const memberCheckWaitersRef = useRef<
		Map<
			string,
			Array< {
				resolve: ( value: boolean ) => void;
				reject: ( reason?: unknown ) => void;
			} >
		>
	>( new Map() );
	const {
		control,
		handleSubmit,
		watch,
		getValues,
		setError,
		clearErrors,
		formState: { errors, isValid },
	} = useForm< ParticipantsForm >( {
		mode: 'onChange',
		defaultValues: {
			participants,
		},
	} );

	const { fields } = useFieldArray( {
		control,
		name: 'participants',
	} );

	const memberExistsChecker = useMemo( () => {
		return ( payload: MemberCheckPayload ) => {
			const key = [
				payload.firstname.trim().toLowerCase(),
				payload.lastname.trim().toLowerCase(),
				payload.birthdate.trim(),
			].join( '|' );

			return new Promise< boolean >( ( resolve, reject ) => {
				const existingTimer = memberCheckTimersRef.current.get( key );
				if ( existingTimer ) {
					clearTimeout( existingTimer );
				}

				const waiters = memberCheckWaitersRef.current.get( key ) ?? [];
				waiters.push( { resolve, reject } );
				memberCheckWaitersRef.current.set( key, waiters );

				const nextTimer = setTimeout( async () => {
					try {
						const response = await checkMemberExists(
							eventId,
							payload
						);
						const currentWaiters =
							memberCheckWaitersRef.current.get( key ) ?? [];
						for ( const waiter of currentWaiters ) {
							waiter.resolve( Boolean( response.exists ) );
						}
					} catch ( error ) {
						const currentWaiters =
							memberCheckWaitersRef.current.get( key ) ?? [];
						for ( const waiter of currentWaiters ) {
							waiter.reject( error );
						}
					} finally {
						memberCheckTimersRef.current.delete( key );
						memberCheckWaitersRef.current.delete( key );
					}
				}, MEMBER_CHECK_DEBOUNCE_MS );

				memberCheckTimersRef.current.set( key, nextTimer );
			} );
		};
	}, [ eventId ] );

	const formSchema = useMemo(
		() => buildFormSchema( tickets, eventId, memberExistsChecker ),
		[ tickets, eventId, memberExistsChecker ]
	);

	useEffect( () => {
		return () => {
			for ( const timer of memberCheckTimersRef.current.values() ) {
				clearTimeout( timer );
			}
			memberCheckTimersRef.current.clear();
			memberCheckWaitersRef.current.clear();
		};
	}, [] );

	async function validateParticipant( index: number ): Promise< boolean > {
		const participant = getValues( `participants.${ index }` as const );
		if ( ! participant ) {
			return false;
		}

		const nextRequestId =
			( requestCounterRef.current.get( index ) ?? 0 ) + 1;
		requestCounterRef.current.set( index, nextRequestId );

		clearErrors( `participants.${ index }` as any );

		const oneParticipantSchema = z.object( {
			participants: z.tuple( [ formSchema.shape.participants.element ] ),
		} );

		const result = await oneParticipantSchema.safeParseAsync( {
			participants: [ participant ],
		} );

		if ( requestCounterRef.current.get( index ) !== nextRequestId ) {
			return false;
		}

		if ( result.success ) {
			return true;
		}

		for ( const issue of result.error.issues ) {
			const issuePath = issue.path.join( '.' );
			const participantScopedPath = issuePath.replace(
				/^participants\.0/,
				`participants.${ index }`
			);
			setError( participantScopedPath as any, {
				type: 'manual',
				message: issue.message,
			} );
		}

		return false;
	}

	useEffect( () => {
		const subscription = watch( ( _value, { name } ) => {
			if ( ! name || ! name.startsWith( 'participants.' ) ) {
				return;
			}

			const [ , indexValue ] = name.split( '.' );
			const index = Number( indexValue );
			if ( Number.isNaN( index ) ) {
				return;
			}

			void validateParticipant( index );
		} );

		return () => subscription.unsubscribe();
	}, [ watch, tickets, eventId ] );

	async function validateAll( data: ParticipantsForm ): Promise< boolean > {
		const result = await formSchema.safeParseAsync( data );
		if ( result.success ) {
			return true;
		}

		for ( const issue of result.error.issues ) {
			const path = issue.path.length
				? issue.path.join( '.' )
				: 'participants';
			setError( path as any, {
				type: 'manual',
				message: issue.message,
			} );
		}

		return false;
	}

	const onSubmit = handleSubmit( async ( data ) => {
		clearErrors();

		if ( ! ( await validateAll( data ) ) ) {
			return;
		}

		setParticipants( data.participants );
		nextStep();
	} );

	return (
		<form onSubmit={ onSubmit }>
			<h3>{ __( 'Informations des participants', TEXT_DOMAIN ) }</h3>
			<p>
				{ __(
					'Chaque billet correspond a un participant avec des informations distinctes.',
					TEXT_DOMAIN
				) }
			</p>

			<div className="we-registration__participant-list">
				{ fields.map( ( participant, index ) => (
					<ParticipantInfo
						key={ participant.id }
						index={ index }
						participant={ {
							...participant,
							fields: participant.fields ?? {},
						} }
						tickets={ tickets }
						control={ control }
						eventId={ eventId }
					/>
				) ) }
			</div>
			<div>
				<Button type="submit" disabled={ ! isValid }>
					{ __( 'Suivant', TEXT_DOMAIN ) }
				</Button>
			</div>
		</form>
	);
}
