import clsx from "clsx";
import type React from "react";

interface IProps {
  children: React.ReactNode;
  isActive: boolean;
}
const Label = ({ children, isActive }: IProps) => {
  return (
    <div
      className={clsx(
        "inline-block cursor-pointer w-fit py-2 px-3 font-meta rounded-lg border border-border transition-colors",
        isActive &&
          "bg-primary text-background hover:text-primary hover:bg-background",
        !isActive && "hover:bg-primary hover:text-background",
      )}
    >
      {children}
    </div>
  );
};

export default Label;
