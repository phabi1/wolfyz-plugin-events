import type { TicketField } from "../models/ticket-field";

type EventRegistrationInfo = {
	event: {
		id: number;
		title: string;
		event_start: number;
		event_end: number;
		regstration_start?: number;
		regstration_end?: number;
		participant_max: number;
		participant_nb: number;
	};
	tickets: {
		id: number;
		title: string;
		amount: number;
		fields: TicketField[];
		participant_max: number;
		participant_nb: number;
	}[];
};

type EventRegistrationRequest = {
	contact: {
		firstname: string;
		lastname: string;
		email: string;
		phone: string;
	};
	message: string;
	participants: {
		firstname: string;
		lastname: string;
		birthdate: string;
		ticket_id: number;
		fields: Record<string, any>;
	}[];
};

type EventRegistrationResponse = {
	success: boolean;
	payment_url?: string;
	errors: string[];
};

let nonce: string | null = null;

export function setNonce(value: string) {
	nonce = value;
}

const endpoint = "/wp-json/wolf-events/v1/events";

export async function getRegistration(
	eventId: number,
): Promise<EventRegistrationInfo> {
	const response = await fetch(`${endpoint}/${eventId}/registration`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"X-WP-Nonce": nonce || "",
		},
	});

	const data = response.json();
	return data;
}

export async function registerToEvent(
	eventId: number,
	payload: EventRegistrationRequest,
): Promise<EventRegistrationResponse> {
	const response = await fetch(`${endpoint}/${eventId}/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-WP-Nonce": nonce || "",
		},
		body: JSON.stringify(payload),
	});

	const data = response.json();
	return data;
}
