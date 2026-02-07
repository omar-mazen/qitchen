import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    isLoginLoading,
    logout,
    isLogoutLoading,
    error,
  } = context;
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    isLoginLoading,
    logout,
    isLogoutLoading,
    error,
  };
};
