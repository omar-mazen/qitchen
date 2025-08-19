import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../Auth";

import type { TProduct } from "@/types/product";
import type { TCartResult, TCart, TCartProductAction } from "@cTypes/cart";

import {
  addProductToCart,
  getCurrentUserCart,
  removeCartProduct,
  updateCartProductQuantity as updateCartProduct,
} from "@services/cart";

interface IAddProps {
  product: TProduct;
  quantity: number;
}
interface IRemoveProps {
  product: TProduct;
  quantity: number;
}
interface IUpdateProps {
  action: TCartProductAction;
  product: TProduct;
  quantity: number;
}
interface ICartContext {
  isLoading: boolean;
  cart: TCart;
  addToCart: ({ product, quantity }: IAddProps) => void;
  removeFromCart: ({ product, quantity }: IRemoveProps) => void;
  updateCartProductQuantity: ({ product, quantity }: IUpdateProps) => void;
}

const initialCart: TCart = {
  _id: "",
  products: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const CartContext = createContext<ICartContext>({
  isLoading: false,
  cart: initialCart,
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartProductQuantity: () => {},
});

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [guestCart, setGuestCart] = useState<TCart>(() => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : initialCart;
  });
  // remote cart
  const { data, isLoading } = useQuery<TCartResult>({
    queryKey: ["cart"],
    queryFn: getCurrentUserCart,
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
  const userCart = { ...data?.cart, id: data?.cart?._id };
  const { mutate: addToCartAPI, isPending: isAdding } = useMutation({
    mutationKey: ["cart"],
    mutationFn: addProductToCart,
    onSuccess: (data) => queryClient.setQueryData(["cart"], data),
  });
  const { mutate: updateCartProductQuantityAPI, isPending: isUpdating } =
    useMutation({
      mutationKey: ["cart"],
      mutationFn: updateCartProduct,
      onSuccess: (data) => queryClient.setQueryData(["cart"], data),
    });
  const { mutate: removeFromCartAPI, isPending: isRemoving } = useMutation({
    mutationKey: ["cart"],
    mutationFn: removeCartProduct,
    onSuccess: (data) => queryClient.setQueryData(["cart"], data),
  });

  useEffect(() => {
    if (!isAuthenticated)
      localStorage.setItem("cart", JSON.stringify(guestCart));
  }, [guestCart, isAuthenticated]);

  const addToCart = useCallback(
    ({ product, quantity }: IAddProps) => {
      if (isAuthenticated) {
        addToCartAPI({ productId: product._id, quantity });
      } else {
        const isExist = guestCart.products.some(
          (cartProduct) => cartProduct.product._id === product._id,
        );
        if (!isExist) {
          setGuestCart((state) => {
            return {
              ...state,
              products: [...state.products, { product, quantity }],
              totalPrice: Number(state.totalPrice) + product.price * quantity,
              totalQuantity: Number(state.totalQuantity) + quantity,
            };
          });
        }
      }
    },
    [isAuthenticated, guestCart, addToCartAPI],
  );

  const removeFromCart = useCallback(
    ({ product, quantity }: IRemoveProps) => {
      if (isAuthenticated) {
        removeFromCartAPI(product._id);
      } else {
        setGuestCart((state) => ({
          ...state,
          products: state.products.filter(
            (localProduct) => localProduct.product._id != product._id,
          ),
          totalPrice: Number(state.totalPrice) - product.price * quantity,
          totalQuantity: Number(state.totalQuantity) - quantity,
        }));
      }
    },
    [isAuthenticated, removeFromCartAPI],
  );

  const updateCartProductQuantity = useCallback(
    ({ action, product, quantity }: IUpdateProps) => {
      if (isAuthenticated) {
        updateCartProductQuantityAPI({ productId: product._id, action });
      } else {
        setGuestCart((state) => ({
          ...state,
          products: state.products.map((localProduct) =>
            localProduct.product._id == product._id
              ? {
                  ...localProduct,
                  quantity:
                    action == "increase"
                      ? localProduct.quantity + 1
                      : localProduct.quantity <= 1
                        ? localProduct.quantity
                        : localProduct.quantity - 1,
                }
              : localProduct,
          ),
          totalQuantity:
            action == "increase"
              ? state.totalQuantity + 1
              : quantity <= 1
                ? quantity
                : state.totalQuantity - 1,
          totalPrice:
            action == "increase"
              ? state.totalPrice + product.price
              : quantity <= 1
                ? state.totalPrice
                : state.totalPrice - product.price,
        }));
      }
    },
    [isAuthenticated, updateCartProductQuantityAPI],
  );

  return (
    <CartContext
      value={{
        isLoading: isLoading || isAdding || isRemoving || isUpdating,
        cart: isAuthenticated && userCart ? userCart : guestCart,
        addToCart,
        removeFromCart,
        updateCartProductQuantity,
      }}
    >
      {children}
    </CartContext>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useAuth must be used within an CartProvider");
  const {
    isLoading,
    cart,
    addToCart,
    updateCartProductQuantity,
    removeFromCart,
  } = context;
  return {
    isLoading,
    cart,
    addToCart,
    updateCartProductQuantity,
    removeFromCart,
  };
};

export default CartProvider;
