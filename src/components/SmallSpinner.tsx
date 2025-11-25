import clsx from "clsx";

export default function SmallSpinner({
  color = "white",
  className,
}: {
  color?: "black" | "white";
  className?: string;
}) {
  return <div className={clsx("small-spinner", color, className)}></div>;
}
