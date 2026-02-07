import { Outlet } from "react-router";

import Header from "@/components/Header";
import VerifyModal from "./VerifyModal";
import Loader from "../Loader";
import { useNavigationLoader } from "@/hooks/useNavigationLoader";
import { useLoading } from "@/hooks/useLoading";

const UserAppLayout = () => {
  useNavigationLoader();
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <Loader />}
      <div className="grid grid-rows-[auto_1fr] lg:block h-full">
        <Header />
        <Outlet />
      </div>
      <VerifyModal />
    </>
  );
};

export default UserAppLayout;
