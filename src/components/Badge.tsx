const Badge = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div className="inline-block cursor-pointer" onClick={onClick}>
      <span className=" h-14 aspect-square flex items-center justify-center cursor-pointe gap-5 border border-border bg-background-muted mx-3 p-3 rounded-full transition-colors hover:text-background hover:bg-primary group-hover/badge-container:text-background group-hover/badge-container:bg-primary">
        {children}
      </span>
    </div>
  );
};

export default Badge;
