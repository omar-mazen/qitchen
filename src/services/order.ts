import type { TVerifyPaymentResponse } from "./../types/orders";
import { handleError } from "@/utils";
import { privateApi } from "./axios";
import type {
  TOrdersResult,
  TOrder,
  TOrderDetailsResult,
} from "@cTypes/orders";

type MakeOrderProps = {
  cartId: string;
  addressId: string;
};
type StripeCheckoutResponse = {
  success: boolean;
  session_url: string;
  orderId: string;
  order: TOrder;
  message: string;
};
export const makeOrder = async ({ cartId, addressId }: MakeOrderProps) => {
  try {
    const res = await privateApi.post<StripeCheckoutResponse>(
      `/order/create-order-cart/${cartId}/${addressId}`
    );
    if (res.data.session_url) location.href = res.data.session_url;
  } catch (error) {
    return handleError(error);
  }
};

type OrderResponse = {
  success: boolean;
  order: TOrder;
  message: string;
};
export const getOrderDetails = async (
  orderId: string
): Promise<TOrderDetailsResult> => {
  try {
    const { data } = await privateApi.get<OrderResponse>(`/order/${orderId}`);
    return {
      order: data.order,
    };
  } catch (error) {
    return handleError(error);
  }
};

type OrdersResponse = {
  success: boolean;
  data: TOrder[] | [];
  message: string;
};
export const getCurrentUserOrders = async (): Promise<TOrdersResult> => {
  try {
    const { data } = await privateApi.get<OrdersResponse>(
      `/order/get-all-orders-for-current-user`
    );
    return {
      orders: data.data,
    };
  } catch (error) {
    return handleError(error);
  }
};

type TVerifyPaymentResult = { error?: string; success?: boolean };
export const verifyPament = async ({
  sessionId,
  orderId,
}: {
  sessionId: string;
  orderId: string;
}): Promise<TVerifyPaymentResult> => {
  try {
    const { data } = await privateApi.post<TVerifyPaymentResponse>(
      `order/verify/${sessionId}/${orderId}`
    );
    return { success: data.success };
  } catch (error) {
    return handleError(error);
  }
};
