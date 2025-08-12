import { getCurrentUserData } from "@/services/user";
import type { GetCurrentUserDataResult, TUser } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
type AuthContextType = {
  user: TUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, data } = useQuery<GetCurrentUserDataResult>({
    queryKey: ["user"],
    queryFn: getCurrentUserData,
  });
  if (isLoading) return null;
  const { user = null } = data as GetCurrentUserDataResult;
  return (
    <AuthContext value={{ user, isLoading, isAuthenticated: !!user?._id }}>
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
  const { user, isAuthenticated, isLoading } = context;
  return { user, isAuthenticated, isLoading };
};
