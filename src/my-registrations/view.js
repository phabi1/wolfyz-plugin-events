import { createRoot } from 'react-dom/client';
import { MyRegistrationsApp } from './MyRegistrationsApp';

document
	.querySelectorAll( '.wp-block-wolf-events-my-registrations[data-nonce]' )
	.forEach( ( element ) => {
		const mountNode = document.createElement( 'div' );
		element.appendChild( mountNode );

		createRoot( mountNode ).render(
			<MyRegistrationsApp
				nonce={ element.dataset.nonce || '' }
				loginUrl={ element.dataset.loginUrl || '' }
			/>
		);
	} );
