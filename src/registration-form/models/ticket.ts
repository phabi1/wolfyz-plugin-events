import { TicketField } from "./ticket-field";

export type Ticket = {
	id: number;
	title: string;
	quantity: number;
	stock: number | null;
	amount: number;
	fields: TicketField[]
};
