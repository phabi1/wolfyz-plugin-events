export type MyRegistration = {
	id: number;
	status: 'pending' | 'paid' | 'cancelled' | string;
	/** In cents. */
	amount: number;
	payed_at: number | null;
	event: {
		id: number;
		title: string;
		/** Unix timestamps. */
		event_start: number | null;
		event_end: number | null;
	} | null;
	participants: {
		firstname: string;
		lastname: string;
		ticket: string | null;
	}[];
};

/** Thrown when the user must sign in again with their club account. */
export class NotConnectedError extends Error {}

export async function getMyRegistrations(
	nonce: string
): Promise< MyRegistration[] > {
	const response = await fetch( '/wp-json/wolf-events/v1/me/registrations', {
		headers: { 'X-WP-Nonce': nonce },
		credentials: 'same-origin',
	} );

	if ( response.status === 401 ) {
		throw new NotConnectedError();
	}
	if ( ! response.ok ) {
		throw new Error( `HTTP ${ response.status }` );
	}

	const data = await response.json();
	return Array.isArray( data.items ) ? data.items : [];
}
