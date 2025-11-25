import type { LoginParams, LoginResult, TUser } from "@/types/user";
import { privateApi, publicApi } from "./axios";
import { handleError } from "@/utils";
import type { TBaseResponse } from "@/types/common";

type RegisterProps = Omit<TUser, "_id"> & { password: string };
type RegisterResult = {
  message?: string;
  success?: boolean;
  error?: string;
};
export const register = async ({
  name,
  email,
  phoneNumber,
  role,
  password,
}: RegisterProps): Promise<RegisterResult> => {
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
    throw new Error(handleError(error).error);
  }
};

type LoginResponse = TBaseResponse & {
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
      { withCredentials: true }
    );
    return {
      user: res.data.user,
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};

export const logout = async () => {
  try {
    const res = await privateApi.post<TBaseResponse>("/user/logout");
    return {
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};

export const refreshToken = async () => {
  try {
    const res = await privateApi.post("/user/refresh-token");
    return res.data.success;
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};

type SendVerificationCodeProps = {
  userId: string;
};
type VerfiyEmailProps = {
  userId: string;
  otp: string;
};
type VerfiyEmailResult = {
  error?: string;
  data?: { success: boolean; message: string };
};

export const sendVerfictionCode = async ({
  userId,
}: SendVerificationCodeProps): Promise<VerfiyEmailResult> => {
  try {
    const response = await publicApi.post<TBaseResponse>(
      "user/send-verify-otp",
      {
        userId,
      }
    );
    if (!response.data.success) throw new Error(response.data.message);
    return { data: response.data };
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};
export const verfiyEmail = async ({
  userId,
  otp,
}: VerfiyEmailProps): Promise<VerfiyEmailResult> => {
  try {
    const response = await publicApi.post<TBaseResponse>(
      "user/verify-account",
      {
        userId,
        otp,
      }
    );
    return { data: response.data };
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};

type SendResetCodeProps = { email: string };
export const sendResetCode = async ({
  email,
}: SendResetCodeProps): Promise<VerfiyEmailResult> => {
  try {
    const response = await publicApi.post<TBaseResponse>(
      "user/send-reset-otp",
      {
        email,
      }
    );
    return { data: response.data };
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};

type RestPasswordProp = {
  email: string;
  newPassword: string;
  otp: string;
};
export const resetPassword = async ({
  email,
  newPassword,
  otp,
}: RestPasswordProp): Promise<VerfiyEmailResult> => {
  try {
    const response = await publicApi.post<TBaseResponse>(
      "user/reset-password",
      {
        email,
        newPassword,
        otp,
      }
    );
    if (!response.data.success) throw new Error(response.data.message);
    return { data: response.data };
  } catch (error) {
    throw new Error(handleError(error).error);
  }
};
