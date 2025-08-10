import { Suspense } from "react";
import Header from "./Header";
import { Outlet } from "react-router";
import Loader from "./Loader";

const AppLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr] lg:block h-full">
      <Header />
      <Suspense fallback={<Loader />}>{<Outlet />}</Suspense>
    </div>
  );
};

export default AppLayout;
