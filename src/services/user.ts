import type { GetCurrentUserDataResult, TUser } from "@/types/user";
import { privateApi } from "./axios";
import axios from "axios";
type GetUserDataResponse = {
  success: boolean;
  user?: TUser;
};
export const getCurrentUserData =
  async (): Promise<GetCurrentUserDataResult> => {
    try {
      const res =
        await privateApi.get<GetUserDataResponse>("/user/current-user");
      return { user: res.data.user };
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
