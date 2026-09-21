import { __, _n, sprintf } from '@wordpress/i18n';
import { TEXT_DOMAIN, } from '../../constants';
import { useRegistrationStore } from '../../store';
import { useMemo } from 'react';
import { useStepper } from '../ui/stepper/context';
import { Button } from '../ui/Button';
import { useForm } from 'react-hook-form';
import { formatPrice } from '../../helpers';
import { Counter } from '../ui/Counter';

type TicketSelectionForm = {
	quantities: Record<number, number>;
};

function normalizeQuantity(quantity: number): number {
	if (!Number.isFinite(quantity)) {
		return 0;
	}

	return Math.max(0, Math.floor(quantity));
}

export function TicketSelectionStep() {

	const { nextStep } = useStepper();
	const remainingTickets = useRegistrationStore((state) => state.remainingTickets);
	const tickets = useRegistrationStore((state) => state.tickets);
	const setQuantity = useRegistrationStore((state) => state.setQuantity);
	const {
		handleSubmit,
		setValue,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<TicketSelectionForm>({
		mode: 'onChange',
		defaultValues: {
			quantities: tickets.reduce<Record<number, number>>((acc, ticket) => {
				acc[ticket.id] = ticket.quantity;
				return acc;
			}, {}),
		},
	});

	const quantities = watch('quantities');

	const ticketsWithSelection = useMemo(() => {
		const normalizedQuantities = tickets.reduce<Record<number, number>>((acc, ticket) => {
			acc[ticket.id] = normalizeQuantity(Number(quantities?.[ticket.id] ?? 0));
			return acc;
		}, {});

		const totalSelected = tickets.reduce((acc, ticket) => {
			return acc + normalizedQuantities[ticket.id];
		}, 0);

		if (remainingTickets !== null) {
			if (totalSelected > remainingTickets) {
				setError('quantities', {
					type: 'max',
					message: __('Le nombre total de billets selectionnes depasse le nombre de places restantes.', TEXT_DOMAIN),
				});
			} else {
				clearErrors('quantities');
			}
		}

		const remainingAfterSelection = remainingTickets === null
			? null
			: Math.max(0, remainingTickets - totalSelected);

		return tickets.map((ticket) => {
			const quantity = normalizedQuantities[ticket.id];
			const availableFromGlobal = remainingAfterSelection === null
				? null
				: quantity + remainingAfterSelection;
			const ticketStock = ticket.stock ?? null;
			const dynamicLimit = ticketStock === null
				? availableFromGlobal
				: availableFromGlobal === null
					? ticketStock
					: Math.min(ticketStock, availableFromGlobal);

			return {
				...ticket,
				quantity,
				limit: dynamicLimit,
			};
		});
	}, [clearErrors, quantities, remainingTickets, setError, tickets]);


	const canNext = useMemo(() => {
		return ticketsWithSelection.some((ticket) => ticket.quantity > 0);
	}, [ticketsWithSelection]);


	const onQuantityChange = (ticketId: number, quantity: number) => {
		const normalized = normalizeQuantity(quantity);
		const currentTicket = ticketsWithSelection.find((ticket) => ticket.id === ticketId);
		const ticketMax = currentTicket?.limit ?? null;
		const nextQuantity = ticketMax === null ? normalized : Math.min(normalized, ticketMax);

		setValue('quantities', {
			...(quantities || {}),
			[ticketId]: nextQuantity,
		}, {
			shouldDirty: true,
			shouldValidate: true,
		});

		if (ticketMax !== null && normalized > ticketMax) {
			setError('quantities', {
				type: 'max',
				message: __('La quantite maximale pour ce billet est depassee.', TEXT_DOMAIN),
			});
			return;
		}

		clearErrors('quantities');
	};

	const onSubmit = handleSubmit((data) => {
		const hasAtLeastOneTicket = tickets.some(
			(ticket) => normalizeQuantity(Number(data.quantities?.[ticket.id] ?? 0)) > 0,
		);

		if (!hasAtLeastOneTicket) {
			setError('quantities', {
				type: 'required',
				message: __('Selectionnez au moins un billet.', TEXT_DOMAIN),
			});
			return;
		}

		const hasMaxError = tickets.some((ticket) => {
			const selectedTicket = ticketsWithSelection.find((line) => line.id === ticket.id);
			const ticketMax = selectedTicket?.limit ?? null;
			if (ticketMax === null) {
				return false;
			}

			const value = normalizeQuantity(Number(data.quantities?.[ticket.id] ?? 0));
			return value > ticketMax;
		});

		if (hasMaxError) {
			setError('quantities', {
				type: 'max',
				message: __('Une quantite depasse la limite autorisee.', TEXT_DOMAIN),
			});
			return;
		}

		clearErrors('quantities');
		tickets.forEach((ticket) => {
			setQuantity(ticket.id, normalizeQuantity(Number(data.quantities?.[ticket.id] ?? 0)));
		});
		nextStep();
	});

	return (
		<form onSubmit={onSubmit}>
			<h3>{__('Choix des billets', TEXT_DOMAIN)}</h3>
			{remainingTickets !== null && (
				<div>{sprintf(_n('%d place restante', '%d places restantes', remainingTickets, TEXT_DOMAIN), remainingTickets)}</div>
			)}
			<p>
				{__(
					'Selection billet = 1 participant. Vous pouvez ajouter autant de billets que necessaire.',
					TEXT_DOMAIN
				)}
			</p>
			<ul className='ticket-list'>
				{ticketsWithSelection.map((ticket) => {
					return (
						<li key={ticket.id} className='ticket-item'>
							<div className='ticket-item-details'>
								<div>{ticket.title}</div>
								{ticket.limit !== null && (
									<div className='ticket-item-limit'>
										{sprintf(_n('Max', 'Max', ticket.limit, TEXT_DOMAIN))}: {ticket.limit}
									</div>
								)}
							</div>
							<div className='ticket-item-counter'>
								<div className='ticket-item-amount'>
									{formatPrice(ticket.amount)}
								</div>
								<Counter
									count={ticket.quantity}
									max={ticket.limit}
									change={(quantity) => onQuantityChange(ticket.id, quantity)}
								/>
							</div>
						</li>
					);
				})}
			</ul>
			{errors.quantities?.message && (
				<p className="we-registration__error">{errors.quantities.message}</p>
			)}
			<div>
				<Button type="submit" disabled={!canNext}>
					{__('Suivant', TEXT_DOMAIN)}
				</Button>
			</div>
		</form>
	);
}
