import { useStepper } from './context';

type StepperLabelProps = {
    index: number;
    active: boolean;
    label: React.ReactNode;
};

export function StepperLabel({ index, label, active }: StepperLabelProps) {
    const { gotToStep } = useStepper();

    const status =
        active ? 'is-active' : index < (active ? index : 0) ? 'is-done' : 'is-upcoming';

    return (
        <li key={index} className={`stepper-step ${status}`} onClick={() => { gotToStep(index); }}>
            <span className="stepper-step-index">{index + 1}</span>
            <span className="stepper-step-label">{label}</span>
        </li>
    );

}