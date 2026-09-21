import { useCallback, useMemo } from "react";

export function Counter({ count, change, max }: { count: number, max: number | null, change: (value: number) => void }) {
    const increment = useCallback(() => {
        if (max === null || count < max) {
            change(count + 1);
        }
    }, [count, change, max]);
    const decrement = useCallback(() => {
        if (count > 0) {
            change(count - 1);
        }
    }, [count, change]);
    const canIncrement = useMemo(() => max === null || count < max, [count, max]);
    const canDecrement = useMemo(() => count > 0, [count]);
    return (
        <div className="counter">
            <button type="button" className="counter-button" onClick={decrement} disabled={!canDecrement}>-</button>
            <span className="counter-value">{count}</span>
            <button type="button" className="counter-button" onClick={increment} disabled={!canIncrement}>+</button>
        </div>
    );
}