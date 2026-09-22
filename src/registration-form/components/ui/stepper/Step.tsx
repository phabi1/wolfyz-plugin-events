export type StepProps = {
	label: React.ReactNode;
};

export const Step: React.FC< React.PropsWithChildren< StepProps > > = ( {
	children,
} ) => {
	return <>{ children }</>;
};
