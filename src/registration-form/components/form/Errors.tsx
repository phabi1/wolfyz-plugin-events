export function FormErrors( { errors }: { errors: Record< string, any > } ) {
	if ( ! errors || Object.keys( errors ).length === 0 ) {
		return null;
	}

	return (
		<div className="form-errors">
			{ Object.entries( errors ).map( ( [ key, error ] ) => (
				<p key={ key } className="form-error">
					{ error.message || 'Champ invalide' }
				</p>
			) ) }
		</div>
	);
}
