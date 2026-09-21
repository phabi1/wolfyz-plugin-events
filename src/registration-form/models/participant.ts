export type Participant = {
	ticket_id: number;
	firstname: string;
	lastname: string;
	birthdate: string;
	fields: Record<string, any>;
};
