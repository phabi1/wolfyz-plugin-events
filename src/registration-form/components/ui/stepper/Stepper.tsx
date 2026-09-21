import React, { Children, ReactElement, useCallback, useMemo, useState } from "react";
import { Step, StepProps } from './Step';
import { StepperLabel } from './StepLabel';
import { StepperContext } from './context';

export function Stepper({ children}: React.PropsWithChildren<{ }>) {

    const [stepIndex, setStepIndex] = useState(0);

    const steps = useMemo<ReactElement<StepProps>[]>(() => {
        return Children.toArray(children).filter(child => React.isValidElement(child) && child.type === Step) as ReactElement<StepProps>[];

    }, [children]);

    const activeStep = useMemo(() => steps[stepIndex], [steps, stepIndex]);

    const canPrevious = useMemo(() => {
        if (stepIndex === 0) return false;
        return true;
    }, [activeStep, stepIndex]);

    const canNext = useMemo(() => {
        if (stepIndex >= steps.length - 1) return false;
        return true;
    }, [activeStep, stepIndex, steps.length]);

    const previousStep = useCallback(() => {
        if (canPrevious) {
            setStepIndex(stepIndex - 1);
        }
    }, [canPrevious, stepIndex]);

    const nextStep = useCallback(() => {
        if (canNext) {
            setStepIndex(stepIndex + 1);
        }
    }, [canNext, stepIndex]);

    return <StepperContext.Provider value={{
        index: stepIndex, nextStep, previousStep, gotToStep: (index: number) => setStepIndex(index)
    }}>
        <div className="stepper">
            <ol className="stepper-header">
                {steps.map((step, index) => (<StepperLabel index={index} label={step.props.label} active={index === stepIndex} />))}
            </ol>
            <div className="stepper-content">
                {activeStep}
            </div>
        </div>
    </StepperContext.Provider>;
}