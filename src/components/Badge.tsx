import clsx from "clsx";

const Badge = ({
  isActive = false,
  children,
  onClick,
}: {
  isActive?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div className="inline-block cursor-pointer" onClick={onClick}>
      <span
        className={clsx(
          " h-12 aspect-square flex items-center justify-center cursor-pointe gap-5 border border-border bg-background-muted mx-3 p-3 rounded-full transition-colors hover:text-background hover:bg-primary group-hover/badge-container:text-background group-hover/badge-container:bg-primary ease-in-out",
          isActive &&
            "bg-primary text-background hover:!bg-background-muted hover:text-primary group-hover/badge-container:bg-background group-hover/badge-container:text-primary",
        )}
      >
        {children}
      </span>
    </div>
  );
};

export default Badge;
