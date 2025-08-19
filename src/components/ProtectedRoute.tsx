import { Outlet } from "react-router";

import { useAuth } from "@/context/Auth";

import Error from "./Error";

import type { TRoles } from "@cTypes/user";

const ProtectedRoute = ({ role }: { role: TRoles }) => {
  const { isAuthenticated, user } = useAuth();
  console.log(user?.role == role);
  if (isAuthenticated && user?.role == role) return <Outlet />;
  else
    return (
      <Error statusCode="401" message="You do not have access to this page." />
    );
};

export default ProtectedRoute;
