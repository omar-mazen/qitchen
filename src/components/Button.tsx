import clsx from "clsx";
import type React from "react";
import Badge from "./Badge";

interface IBaseProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  withAngle?: boolean;
}
interface IconButtonProps extends IBaseProps {
  type: "icon";
  icon: React.ReactNode;
}
interface PrimaryOrTextButtonProps extends IBaseProps {
  type: "primary" | "text" | "outline";
}
type ButtonProps = IconButtonProps | PrimaryOrTextButtonProps;

const styles = {
  primary:
    "py-2.5 px-4 font-meta rounded-lg border border-border transition-colors bg-primary text-background hover:bg-background hover:text-primary",
  text: "font-heading-6 border-b border-primary hover:drop-shadow-border hover:drop-shadow transition-all",
  icon: "group/badge-container font-heading-6 flex items-center gap-5",
  outline:
    "py-2.5 px-4 font-meta rounded-lg border border-border transition-colors hover:bg-primary hover:text-background",
};
const Button = (props: ButtonProps) => {
  return (
    <button
      className={clsx(
        "h-fit focus:outline-0",
        styles[props.type],
        props.withAngle &&
          "with-angle absolute bottom-0 right-0 bg-background py-4 px-4 rounded-tl-4xl",
        props.className
      )}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
    >
      {props.children}
      {props.type === "icon" && <Badge>{props.icon}</Badge>}
    </button>
  );
};

export default Button;
