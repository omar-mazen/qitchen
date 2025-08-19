import React from "react";
import clsx from "clsx";

const SectionHeader = ({
  children,
  className,
  size = "large",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "large";
}) => {
  return (
    <div className={clsx("!flex items-center justify-center gap-5", className)}>
      <img
        src="./src/assets/images/diamond-line.png"
        alt=""
        className={clsx(
          size == "large" && " w-24 sm:w-32",
          size == "small" && "w-16 sm:w-24 ",
        )}
      />
      {children}
      <img
        src="./src/assets/images/diamond-line.png"
        alt=""
        className={clsx(
          " rotate-180",
          size == "large" && " w-24 sm:w-32",
          size == "small" && "w-16 sm:w-24 ",
        )}
      />
    </div>
  );
};

export default SectionHeader;
