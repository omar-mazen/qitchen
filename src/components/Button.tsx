import type React from "react";
import clsx from "clsx";

import Badge from "./Badge";
import type { ButtonHTMLAttributes } from "react";

interface IBaseProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  withAngle?: boolean;
  disabled?: boolean;
  id?: string;
  rest?: ButtonHTMLAttributes<HTMLButtonElement>;
}
interface IconButtonProps extends IBaseProps {
  type: "icon";
  icon: React.ReactNode;
}
interface PrimaryOrTextButtonProps extends IBaseProps {
  type?: "primary" | "text" | "outline";
}
type ButtonProps = IconButtonProps | PrimaryOrTextButtonProps;

const styles = {
  primary:
    "group flex items-center justify-center py-2.5 px-4 font-meta rounded-lg border border-border transition-colors bg-primary text-background hover:bg-background hover:text-primary",
  text: "group font-heading-6 border-b border-primary hover:drop-shadow-border hover:drop-shadow transition-all",
  icon: "group/badge-container font-heading-6 flex items-center gap-5",
  outline:
    "group py-2.5 px-4 font-meta rounded-lg border border-border transition-colors hover:bg-primary hover:text-background",
};
const Button = (props: ButtonProps) => {
  return (
    <button
      {...props.rest}
      disabled={props.disabled}
      id={props.id}
      className={clsx(
        "h-fit focus:outline-0 font-normal",
        styles[props.type || "primary"],
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
