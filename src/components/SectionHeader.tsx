import clsx from "clsx";
import React from "react";

const SectionHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx("flex items-center justify-center gap-5", className)}>
      <img src="./src/assets/images/diamond-line.png" alt="" className="w-32" />
      {children}
      <img
        src="./src/assets/images/diamond-line.png"
        alt=""
        className=" rotate-180 w-32"
      />
    </div>
  );
};

export default SectionHeader;
