import { createContext } from "react";
import type { LoginParams, LoginResult, TUser } from "@cTypes/user";

export type AuthContextType = {
  user: TUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<LoginResult>;
  isLoginLoading: boolean;
  logout: () => void;
  isLogoutLoading: boolean;
  error: string;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async (): Promise<LoginResult> => {
    throw new Error("AuthContext not initialized");
  },
  isLoginLoading: false,
  logout: () => {},
  isLogoutLoading: false,
  error: "",
});
