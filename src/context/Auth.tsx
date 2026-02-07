import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { login as loginAPI, logout as logoutAPI } from "@services/auth";
import { getCurrentUserData } from "@services/user";
import Loader from "@components/Loader";
import { AuthContext } from "./AuthContext";
import type { GetCurrentUserDataResult } from "@cTypes/user";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery<GetCurrentUserDataResult>({
    queryKey: ["user"],
    queryFn: getCurrentUserData,
    staleTime: Infinity,
  });
  const {
    mutateAsync: login,
    isPending: isLoginLoading,
    data: loginData,
  } = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) =>
      queryClient.setQueryData(["user"], { user: data.user }),
  });
  const { mutateAsync: logout, isPending: isLogoutLoading } = useMutation({
    mutationKey: ["user"],
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      window.location.pathname = "/";
    },
  });

  // Show loader while fetching initial auth data
  if (isLoading) {
    return <Loader />;
  }

  const user = data?.user ?? null;
  return (
    <AuthContext
      value={{
        user,
        isLoading: isLoading,
        isAuthenticated: !!user?._id,
        login,
        isLoginLoading,
        logout,
        isLogoutLoading,
        error: loginData?.error || "",
      }}
    >
      {children}
    </AuthContext>
  );
};
export default AuthProvider;
