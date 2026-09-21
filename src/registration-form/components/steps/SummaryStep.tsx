import { __ } from '@wordpress/i18n';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TEXT_DOMAIN } from '../../constants';
import { formatPrice, getTicketById } from '../../helpers.ts';
import { registerToEvent } from '../../services/registration';
import { useRegistrationStore } from '../../store';
import { Button } from '../ui/Button';
import { Participant } from './summary/Participant.tsx';


export function SummaryStep() {
	const id = useRegistrationStore((state) => state.id);
	const tickets = useRegistrationStore((state) => state.tickets);
	const participants = useRegistrationStore((state) => state.participants);
	const contact = useRegistrationStore((state) => state.contact);
	const setSubmitted = useRegistrationStore((state) => state.setSubmitted);
	const [submitError, setSubmitError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		handleSubmit,
		register,
		formState: { errors, isValid },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			confirm: false,
		},
	});

	const total = useMemo(() => tickets.reduce((amount, ticketLine) => {
		const ticket = getTicketById(tickets, ticketLine.id);
		if (!ticket) {
			return amount;
		}
		return amount + (ticket.amount || 0) * ticketLine.quantity;
	}, 0), [tickets]);

	const submitSummary = handleSubmit(async () => {
		if (!id) {
			setSubmitError(__('Evenement invalide.', TEXT_DOMAIN));
			return;
		}

		setSubmitError('');
		setIsSubmitting(true);

		const payload = {
			contact: {
				firstname: contact.firstname,
				lastname: contact.lastname,
				email: contact.email,
				phone: contact.phone,
			},
			message: contact.message,
			participants: participants.map((participant) => ({
				firstname: participant.firstname,
				lastname: participant.lastname,
				birthdate: participant.birthdate,
				ticket_id: participant.ticket_id,
				fields: participant.fields,
			})),
		};

		try {

			const data = await registerToEvent(id, payload);

			setSubmitted(true);

			if (data?.payment_url) {
				window.location.assign(data.payment_url);
			}
		} catch (error) {
			setSubmitError(__('Erreur reseau. Veuillez reessayer.', TEXT_DOMAIN));
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<form onSubmit={submitSummary}>
			<h3>{__('Resume et verification', TEXT_DOMAIN)}</h3>
			<p>{__('Verifiez les informations avant validation finale.', TEXT_DOMAIN)}</p>

			<section className="we-registration__summary-section">
				<h4>{__('Participants', TEXT_DOMAIN)}</h4>
				<div className="summary-participant-list">
					{participants.map((participant, index) => {
						const ticket = getTicketById(tickets, participant.ticket_id);
						return (ticket ?
							<Participant key={index} participant={participant} ticket={ticket} />
							: null
						);
					})}
				</div>
			</section>
			<section className="we-registration__summary-section">
				<h4>{__('Contact', TEXT_DOMAIN)}</h4>
				<p>
					{contact.firstname} {contact.lastname}
				</p>
				<p>{contact.email}</p>
				<p>{contact.phone}</p>
				{contact.message && <p>{contact.message}</p>}
			</section>

			<section className="we-registration__summary-total">
				<span>{__('Total', TEXT_DOMAIN)}</span>
				<strong>{formatPrice(total)}</strong>
			</section>

			<div className="we-registration__checkbox-line">
				<input
					id="summary-confirm"
					type="checkbox"
					{...register('confirm', { required: true })}
				/>
				<label htmlFor="summary-confirm">
					{__('Je confirme que les informations sont correctes.', TEXT_DOMAIN)}
				</label>
			</div>

			{errors.confirm && (
				<p className="we-registration__error">
					{__('Veuillez confirmer les informations avant validation.', TEXT_DOMAIN)}
				</p>
			)}

			{submitError && <p className="we-registration__error">{submitError}</p>}
			<div>
				<Button type="submit" disabled={!isValid || isSubmitting}>
					{isSubmitting ? __('Validation...', TEXT_DOMAIN) : __('Valider', TEXT_DOMAIN)}
				</Button>
			</div>
		</form>
	);
}
