import type { GetProductByIdResult, TProduct } from "@/types/product";
import { publicApi } from "./axios";
import { handleError } from "@/utils";
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
    const res = await publicApi.get<GetProductResponse>(
      `/product/get-product/${id}`,
    );
    return { product: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};
