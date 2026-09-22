export type TicketField = {
	id: number;
	type: string;
	label: string;
	description: string;
	required: boolean;
	options: Record< string, any >;
};
