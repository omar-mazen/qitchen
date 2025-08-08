import React from "react";

const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center gap-5">
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
