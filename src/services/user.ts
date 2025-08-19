import type { GetCurrentUserDataResult, TUser } from "@/types/user";
import { privateApi } from "./axios";
import { handleError } from "@/utils";
type UserDataResponse = {
  success: boolean;
  user?: TUser;
};
export const getCurrentUserData =
  async (): Promise<GetCurrentUserDataResult> => {
    try {
      const res = await privateApi.get<UserDataResponse>("/user/current-user");
      return { user: res.data.user };
    } catch (error) {
      return handleError(error);
    }
  };

export const updateUser = async ({
  name,
  phoneNumber,
}: {
  name: string;
  phoneNumber: string;
}): Promise<GetCurrentUserDataResult> => {
  try {
    const res = await privateApi.patch<UserDataResponse>(
      "/user/update-account-details",
      { name, phoneNumber },
    );
    return { user: res.data.user };
  } catch (error) {
    return handleError(error);
  }
};
export const updatePassword = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    await privateApi.patch("/user/update-password", {
      oldPassword,
      newPassword,
    });
  } catch (error) {
    return handleError(error);
  }
};
