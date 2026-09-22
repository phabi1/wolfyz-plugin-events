import { Address as AddressType } from '../../models/address';

export function Address( { address }: { address: AddressType } ) {
	return (
		<p>
			{ address.line1 }
			<br />
			{ address.line2 && (
				<>
					{ address.line2 }
					<br />
				</>
			) }
			{ address.city }, { address.zipcode }
			<br />
			{ address.country }
		</p>
	);
}
