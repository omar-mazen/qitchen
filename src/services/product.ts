import type {
  GetProductByIdResult,
  TProduct,
  UpdateProductResult,
} from "@/types/product";
import { privateApi, publicApi } from "./axios";
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
      `/product/get-product/${id}`
    );
    return { product: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};

type UpdateProductProps = {
  productId: string;
  name?: string;
  description?: string;
  price?: string;
  ingredients?: string[];
};
type UpdateProductResponse = {
  message: string;
  data?: TProduct;
};
export const updateProduct = async ({
  productId,
  name,
  description,
  price,
  ingredients,
}: UpdateProductProps): Promise<UpdateProductResult> => {
  try {
    const res = await privateApi.patch<UpdateProductResponse>(
      `/product/update-product/${productId}`,
      { name, description, price, ingredients }
    );
    return { product: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteProduct = async ({ productId }: { productId: string }) => {
  try {
    await privateApi.delete(`/product/delete-product/${productId}`);
  } catch (error) {
    return handleError(error);
  }
};
