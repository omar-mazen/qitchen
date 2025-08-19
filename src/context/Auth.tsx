import React, { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { login as loginAPI, logout as logoutAPI } from "@services/auth";
import { getCurrentUserData } from "@services/user";
import type {
  GetCurrentUserDataResult,
  LoginParams,
  LoginResult,
  TUser,
} from "@cTypes/user";

type AuthContextType = {
  user: TUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<LoginResult>;
  logout: () => void;
  error: string;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async (_: LoginParams): Promise<LoginResult> => {
    throw new Error("AuthContext not initialized");
  },
  logout: () => {},
  error: "",
});

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
    onSuccess: () => queryClient.removeQueries({ queryKey: ["user"] }),
  });
  if (isLoading || isLoginLoading || isLogoutLoading) return null;
  const user = data?.user ?? null;
  return (
    <AuthContext
      value={{
        user,
        isLoading: isLoading || isLoginLoading || isLogoutLoading,
        isAuthenticated: !!user?._id,
        login,
        logout,
        error: loginData?.error || "",
      }}
    >
      {children}
    </AuthContext>
  );
};
export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, isAuthenticated, isLoading, login, logout, error } = context;
  return { user, isAuthenticated, isLoading, login, logout, error };
};
