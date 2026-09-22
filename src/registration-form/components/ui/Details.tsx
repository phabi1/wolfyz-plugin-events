import {
	Children,
	isValidElement,
	PropsWithChildren,
	ReactElement,
	useMemo,
} from 'react';

interface DetailItemProps {
	label: string;
}

export function DetailItem( {
	children,
}: PropsWithChildren< DetailItemProps > ) {
	return <>{ children }</>;
}

export function Details( {
	children,
	cols,
}: PropsWithChildren< { cols?: number } > ) {
	const items: ReactElement< DetailItemProps >[] = useMemo(
		() =>
			Children.toArray( children ).filter(
				( child ) =>
					isValidElement( child ) && child.type === DetailItem
			) as ReactElement< DetailItemProps >[],
		[ children ]
	);

	return (
		<div className={ `ui-details${ cols ? ` columns-${ cols }` : '' }` }>
			{ items.map( ( item, index ) => (
				<div key={ index } className="ui-detail-item">
					<div className="ui-detail-item-label">
						{ item.props.label }
					</div>
					<div className="ui-detail-item-value">{ item }</div>
				</div>
			) ) }
		</div>
	);
}
