import type {
  AddCategoryResult,
  GetCategoriesResult,
  TCategory,
} from "@cTypes/categories";
import { privateApi, publicApi } from "./axios";
import { handleError } from "@/utils";
import type { TBaseResponse } from "@/types/common";

type GetCategoriesParams = {
  page?: number;
  pageSize?: number;
};

type GetCategoriesResponse = TBaseResponse & {
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

type AddCategoryProps = {
  name: string;
  description: string;
};
type AddCategoryResponse = TBaseResponse & {
  data: TCategory;
};

export const addCategory = async ({
  name,
  description,
}: AddCategoryProps): Promise<AddCategoryResult> => {
  try {
    const { data } = await privateApi.post<AddCategoryResponse>(
      `category/create-category`,
      {
        name,
        description,
      }
    );
    return { category: data.data };
  } catch (error) {
    return handleError(error);
  }
};

type UpdateCategoryProps = {
  categoryId: string;
  name: string;
  description: string;
};
export const updateCategory = async ({
  categoryId,
  name,
  description,
}: UpdateCategoryProps): Promise<AddCategoryResult> => {
  try {
    const { data } = await privateApi.patch<AddCategoryResponse>(
      `category/${categoryId}`,
      {
        name,
        description,
      }
    );
    return { category: data.data };
  } catch (error) {
    return handleError(error);
  }
};
export const deleteCategory = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
  try {
    await privateApi.delete(`category/${categoryId}`);
  } catch (error) {
    return handleError(error);
  }
};
