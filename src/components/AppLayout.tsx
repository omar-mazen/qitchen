import React from "react";
import Header from "./Header";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-rows-[auto_1fr] lg:block h-full">
      <Header />
      <>{children}</>
    </div>
  );
};

export default AppLayout;
