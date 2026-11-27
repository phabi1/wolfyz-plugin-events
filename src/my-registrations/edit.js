import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<p>
				{ __(
					"Mes inscriptions — la liste des inscriptions aux événements de l'utilisateur connecté s'affiche ici.",
					'wolf-events'
				) }
			</p>
		</div>
	);
}
