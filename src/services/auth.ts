import type { LoginParams, LoginResult, TUser } from "@/types/user";
import { privateApi, publicApi } from "./axios";
import { handleError } from "@/utils";

type RegisterProps = Omit<TUser, "_id"> & { password: string };
export const register = async ({
  name,
  email,
  phoneNumber,
  role,
  password,
}: RegisterProps) => {
  try {
    const res = await publicApi.post("/user/register", {
      name,
      email,
      phoneNumber,
      role,
      password,
    });
    return {
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    return handleError(error);
  }
};

type LoginResponse = {
  success: boolean;
  message: string;
  user?: TUser;
};
export const login = async ({
  email,
  password,
}: LoginParams): Promise<LoginResult> => {
  try {
    const res = await publicApi.post<LoginResponse>(
      "/user/login",
      { email, password },
      { withCredentials: true },
    );
    return {
      user: res.data.user,
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    return handleError(error);
  }
};

type LogoutResponse = {
  success: boolean;
  message: string;
};
export const logout = async () => {
  try {
    const res = await privateApi.post<LogoutResponse>("/user/logout");
    return {
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    return handleError(error);
  }
};

export const refreshToken = async () => {
  try {
    const res = await privateApi.post("/user/refresh-token");
    return res.data.success;
  } catch (error) {
    return handleError(error);
  }
};
