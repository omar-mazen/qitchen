import type { TUser } from "@/types/user";
import { privateApi, publicApi } from "./axios";
import axios from "axios";

interface LoginParams {
  email: string;
  password: string;
}
interface LoginResponse {
  success: boolean;
  message: string;
  user?: TUser;
}
interface LoginResult {
  success?: boolean;
  message?: string;
  user?: TUser;
  error?: string;
}
export const login = async ({
  email,
  password,
}: LoginParams): Promise<LoginResult> => {
  try {
    const res = await publicApi.post<LoginResponse>(
      "/user/login",
      { email, password },
      { withCredentials: true }
    );
    return {
      user: res.data.user,
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.message ||
          `Request failed with status ${error.response?.status}`,
      };
    }
    return { error: "Unexpected error occurred" };
  }
};
export const refreshToken = async () => {
  try {
    const res = await privateApi.post("/user/refresh-token");
    return res.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.message ||
          `Request failed with status ${error.response?.status}`,
      };
    }
    return { error: "Unexpected error occurred" };
  }
};
