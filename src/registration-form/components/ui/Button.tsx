export function Button({
    type,
    children,
    onClick,
    disabled,
}: {
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button type={type ?? "button"} className='wp-element-button' onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}