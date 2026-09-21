import React, { createContext } from "react";

type StepperContextType = {
    index: number;
    previousStep: () => void;
    nextStep: () => void;
    gotToStep: (index: number) => void;
}

export const StepperContext = createContext<StepperContextType>({ index: 0, nextStep: () => { }, previousStep: () => { }, gotToStep: (index: number) => { } });

export function useStepper() {
    return React.useContext(StepperContext);
}
