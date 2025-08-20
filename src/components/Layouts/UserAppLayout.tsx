import { Suspense } from "react";
import { Outlet } from "react-router";

import Header from "@/components/Header";
import Loader from "@components/Loader";

const UserAppLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr] lg:block h-full">
      <Header />
      <Suspense fallback={<Loader />}>{<Outlet />}</Suspense>
    </div>
  );
};

export default UserAppLayout;
