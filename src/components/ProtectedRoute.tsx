import { Outlet } from "react-router";

import { useAuth } from "@/context/Auth";

import Error from "./Error";

import type { TRoles } from "@cTypes/user";
import Loader from "./Loader";

const ProtectedRoute = ({ role }: { role: TRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isAuthenticated && user?.role == role) return <Outlet />;
  if (isLoading) return <Loader />;
  else
    return (
      <Error statusCode="401" message="You do not have access to this page." />
    );
};

export default ProtectedRoute;
