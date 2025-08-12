import type { GetCategoriesResult, TCategory } from "@cTypes/categories";
import { privateApi } from "./axios";
import axios, { AxiosError } from "axios";

interface GetCategoriesParams {
  page?: number;
  pageSize?: number;
}

interface GetCategoriesResponse {
  success: boolean;
  totalPages: number;
  data: TCategory[];
}

export const getCategories = async ({
  page = 1,
  pageSize = 10,
}: GetCategoriesParams = {}): Promise<GetCategoriesResult> => {
  try {
    const res = await privateApi.get<GetCategoriesResponse>(
      "/category/all-categories",
      {
        params: { page, limit: pageSize },
      }
    );

    return {
      totalPages: res.data.totalPages,
      data: res.data.data,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message?: string }>;
      return {
        error:
          axiosError.response?.data?.message ||
          `Request failed with status ${axiosError.response?.status}`,
      };
    }
    return { error: "Unexpected error occurred" };
  }
};
