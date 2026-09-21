import { createRoot } from 'react-dom/client';
import { RegistrationApp } from './RegistrationApp';
import {setNonce} from './services/registration';

document
	.querySelectorAll( '.wp-block-wolf-events-registration-form' )
	.forEach( ( element ) => {
		const eventId = Number.parseInt( element.dataset.eventId, 10 ) || null;
		const restNonce = element.dataset.nonce || '';
		const mountNode = document.createElement( 'div' );

		mountNode.className = 'we-registration__mount';
		element.appendChild( mountNode );

		const root = createRoot( mountNode );

		setNonce( restNonce );

		root.render( <RegistrationApp eventId={ eventId } /> );
	} );
