import { create } from "zustand";
import { Ticket } from "./models/ticket";
import { getRegistration } from "./services/registration";
import { Participant } from "./models/participant";
import { Contact } from "./models/contact";

function updateTicketLimit(
	remainingTickets: number | null,
	max: number | null,
	quantity: number,
) {
	let limit = null;
	if (remainingTickets !== null && max !== null) {
		limit = Math.min(remainingTickets, max - quantity);
	} else if (max !== null) {
		limit = max - quantity;
	} else if (remainingTickets !== null) {
		limit = remainingTickets;
	}
	return limit;
}

type State = {
	id: number;
	event: {
		title: string;
		registration_start: number | null;
		registration_end: number | null;
		participant_max: number;
		participant_nb: number;
	};
	loading: boolean;
	saving: boolean;
	error: any;
	step: number;
	tickets: Ticket[];
	remainingTickets: number | null;
	participants: Participant[];
	contact: Contact;
	submitted: boolean;
	paymentUrl: string | null;

	init: (id: number) => void;
	setStep: (index: number) => void;
	setLoading: (value: boolean) => void;
	setSaving: (value: boolean) => void;
	setQuantity: (ticketId: number, quantity: number) => void;
	setParticipants: (value: Participant[]) => void;
	setContact: (value: Contact) => void;
	setSubmitted: (value: boolean) => void;
	setError: (value: any) => void;
};

const store = create<State>((set) => ({
	id: 0,
	event: {
		title: "",
		registration_start: null,
		registration_end: null,
		participant_max: 0,
		participant_nb: 0,
	},
	loading: false,
	saving: false,
	error: null,
	step: 0,
	tickets: [],
	remainingTickets: 0,
	participants: [],
	contact: {
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		message: "",
	},
	submitted: false,
	paymentUrl: null,
	init: (id: number) => {
		set({ id });
		set({
			step: 0,
			tickets: [],
			participants: [],
			contact: {
				firstname: "",
				lastname: "",
				email: "",
				phone: "",
				message: "",
			},
			submitted: false,
			error: null,
			paymentUrl: null,
		});
		set({ loading: true });
		getRegistration(id).then((registration) => {
			set({
				event: {
					title: registration.event.title,
					registration_start: registration.event.regstration_start || null,
					registration_end: registration.event.regstration_end || null,
					participant_max: registration.event.participant_max || 0,
					participant_nb: registration.event.participant_nb,
				},
				loading: false,
			});
			let remainingTickets = null;
			if (registration.event.participant_max > 0) {
				remainingTickets =
					registration.event.participant_max -
					registration.event.participant_nb;
			}
			set({
				tickets: registration.tickets.map((ticket) => {
					let stock = updateTicketLimit(
						remainingTickets,
						ticket.participant_max,
						ticket.participant_nb,
					);

					return {
						id: ticket.id,
						title: ticket.title,
						amount: ticket.amount,
						fields: ticket.fields || [],
						quantity: 0,
						limit: stock,
						stock: stock,
					};
				}),
				remainingTickets,
			});
		});
	},
	setStep: (step) => set({ step }),
	setLoading: (loading) => set({ loading }),
	setSaving: (saving) => set({ saving }),
	setError: (error) => set({ error }),
	setQuantity: (ticketId: number, quantity: number) =>
		set((state) => {
			const nextTickets = state.tickets.map((ticket) => {
				return ticket.id === ticketId
					? {
							...ticket,
							quantity,
					  }
					: ticket;
			});

			return {
				tickets: nextTickets,
				participants: nextTickets.reduce<any[]>((acc, ticket) => {
					for (let i = 0; i < (ticket.quantity || 0); i++) {
						acc.push({
							ticket_id: ticket.id,
							firstname: "",
							lastname: "",
							birthdate: "",
							fields: {},
						});
					}

					return acc;
				}, [] as Participant[]),
			};
		}),
	setParticipants: (participants) => set({ participants }),
	setContact: (contact) => set({ contact }),
	setSubmitted: (submitted) => set({ submitted }),
}));

export const useRegistrationStore = store;
