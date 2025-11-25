import { Outlet } from "react-router";

import Header from "@/components/Header";
import VerifyModal from "./VerifyModal";

const UserAppLayout = () => {
  return (
    <>
      <div className="grid grid-rows-[auto_1fr] lg:block h-full">
        <Header />
        {<Outlet />}
      </div>
      <VerifyModal />
    </>
  );
};

export default UserAppLayout;
