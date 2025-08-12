import type { GetProductByIdResult, TProduct } from "@/types/product";
import { privateApi } from "./axios";
import axios from "axios";
export type GetProductResponse = {
  success: boolean;
  data?: TProduct;
  message: string;
};
export const getProductById = async ({
  id,
}: {
  id: string;
}): Promise<GetProductByIdResult> => {
  try {
    const res = await privateApi.get<GetProductResponse>(
      `/product/get-product/${id}`
    );
    return { product: res.data.data };
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
