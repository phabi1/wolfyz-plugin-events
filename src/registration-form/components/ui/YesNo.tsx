export function YesNo( { value }: { value: boolean } ) {
	return <span>{ value ? 'Oui' : 'Non' }</span>;
}
