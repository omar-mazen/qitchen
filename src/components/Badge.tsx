const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className=" h-fit w-fit inline-block cursor-pointer mx-2 border border-border bg-background-muted p-3 rounded-full transition-colors hover:text-background hover:bg-primary group-hover/badge-container:text-background group-hover/badge-container:bg-primary">
      {children}
    </span>
  );
};

export default Badge;
