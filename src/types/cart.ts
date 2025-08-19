import type { TProduct } from "@cTypes/product";

export type TCARTProduct = { product: TProduct; quantity: number };
export type TCart = {
  _id: string;
  products: TCARTProduct[] | [];
  totalQuantity: number;
  totalPrice: number;
};

export type TCartResult = {
  cart?: TCart;
  error?: string;
};

export type TCartProductAction = "increase" | "decrease";
