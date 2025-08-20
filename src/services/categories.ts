import type { GetCategoriesResult, TCategory } from "@cTypes/categories";
import { publicApi } from "./axios";
import { handleError } from "@/utils";

type GetCategoriesParams = {
  page?: number;
  pageSize?: number;
};

type GetCategoriesResponse = {
  success: boolean;
  totalPages: number;
  data: TCategory[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const getCategories = async ({
  page = 1,
  pageSize = 10,
}: GetCategoriesParams = {}): Promise<GetCategoriesResult> => {
  try {
    const res = await publicApi.get<GetCategoriesResponse>(
      "/category/all-categories",
      {
        params: { page, limit: pageSize },
      }
    );

    return {
      totalPages: res.data.totalPages,
      data: res.data.data,
    };
  } catch (error) {
    return handleError(error);
  }
};
