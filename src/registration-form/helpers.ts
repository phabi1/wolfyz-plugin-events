import { Ticket } from "./models/ticket";

export function formatPrice(amount: number): string {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(amount / 100);
}

export function getTicketById(
	ticketCatalog: Ticket[],
	ticketId: string | number,
): Ticket | undefined {
	return (ticketCatalog || []).find(
		(ticket) => String(ticket.id) === String(ticketId),
	);
}
