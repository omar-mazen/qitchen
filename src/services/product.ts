import type {
  AddProductResult,
  GetProductByIdResult,
  TProduct,
  UpdateProductResult,
} from "@/types/product";
import { privateApi, publicApi } from "./axios";
import { handleError } from "@/utils";
import type { TBaseResponse } from "@/types/common";
export type GetProductResponse = TBaseResponse & {
  data?: TProduct;
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

type AddProduct = {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  ingredients: string[];
  productImage: File;
};
type AddProductResponse = TBaseResponse & {
  data: TProduct;
};
export const addProduct = async ({
  categoryId,
  name,
  description,
  price,
  ingredients,
  productImage,
}: AddProduct): Promise<AddProductResult> => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("productImages", productImage);
    const res = await privateApi.post<AddProductResponse>(
      `/product/product-listing/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
type UpdateProductResponse = TBaseResponse & {
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
export const toggleProductAvailability = async ({
  productId,
}: {
  productId: string;
}) => {
  try {
    await privateApi.patch(`/product/product-toggle-availability/${productId}`);
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
