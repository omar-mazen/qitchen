import clsx from "clsx";
import type React from "react";

interface IBaseProps {
  children: React.ReactNode;
  onClick?: () => void;
  additionalStyle?: string;
}
interface IconButtonProps extends IBaseProps {
  type: "icon";
  icon: React.ReactNode;
}
interface PrimaryOrTextButtonProps extends IBaseProps {
  type: "primary" | "text";
}
type ButtonProps = IconButtonProps | PrimaryOrTextButtonProps;

const styles = {
  primary:
    "py-2.5 px-4 font-meta rounded-lg border border-border transition-colors hover:bg-primary hover:text-background",
  text: "font-heading-6 border-b border-primary hover:drop-shadow-border hover:drop-shadow transition-all",
  icon: "group/badge-container font-heading-6 flex items-center gap-5",
};
const Button = (props: ButtonProps) => {
  return (
    <button
      className={clsx(
        "h-fit focus:outline-0",
        styles[props.type],
        props.additionalStyle
      )}
      onClick={props.onClick}
    >
      {props.children}
      {props.type === "icon" && props.icon}
    </button>
  );
};

export default Button;
