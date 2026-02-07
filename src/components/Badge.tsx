import clsx from "clsx";

const Badge = ({
  isActive = false,
  children,
  onClick,
  onPressStart,
  onPressEnd,
  disabled = false,
}: {
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  onPressStart?: () => void;
  onPressEnd?: () => void;
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault();
        onPressStart?.();
      }}
      onPointerUp={onPressEnd}
      onPointerLeave={onPressEnd}
      onClick={() => onClick?.()}
      className={clsx(
        "h-12 aspect-square flex items-center justify-center mx-3 p-3 rounded-full border transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-primary hover:text-background",
        isActive && "bg-primary text-background"
      )}
    >
      {children}
    </button>
  );
};

export default Badge;
