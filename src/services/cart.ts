import { handleError } from "@/utils";
import { privateApi } from "./axios";
import type { TCart, TCartProductAction, TCartResult } from "@cTypes/cart";

// get cart
type GetCurrentUserCartResponse = {
  success: boolean;
  cart: TCart;
};
export const getCurrentUserCart = async (): Promise<TCartResult> => {
  try {
    const res =
      await privateApi.get<GetCurrentUserCartResponse>("/cart/get-cart");
    return { cart: res.data.cart };
  } catch (error) {
    return handleError(error);
  }
};

// add product to cart
type AddProductToCartProps = {
  productId: string;
  quantity: number;
};

type AddProductToCartResponse = {
  success: boolean;
  data: TCart;
};
export const addProductToCart = async ({
  productId,
  quantity,
}: AddProductToCartProps): Promise<TCartResult> => {
  try {
    const res = await privateApi.post<AddProductToCartResponse>(
      `/cart/add-product/${productId}`,
      {
        quantity,
      },
    );
    return { cart: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};

// update product qunatity
type UpdateCartProductQuantityProps = {
  productId: string;
  action: TCartProductAction;
};
export const updateCartProductQuantity = async ({
  productId,
  action,
}: UpdateCartProductQuantityProps): Promise<TCartResult> => {
  try {
    const res = await privateApi.patch<AddProductToCartResponse>(
      `/cart/adjust-quantity/${productId}`,
      {
        action,
      },
    );
    return { cart: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};

// remove product
export const removeCartProduct = async (
  productId: string,
): Promise<TCartResult> => {
  try {
    const res = await privateApi.patch<AddProductToCartResponse>(
      `/cart/remove-all-same-products/${productId}`,
    );
    return { cart: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};
