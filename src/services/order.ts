import type {
  TGetAllOrdersResult,
  TOrderStatus,
  TVerifyPaymentResponse,
} from "./../types/orders";
import { handleError } from "@/utils";
import { privateApi } from "./axios";
import type {
  TOrdersResult,
  TOrder,
  TOrderDetailsResult,
} from "@cTypes/orders";
import type { TBaseResponse, TPagination } from "@/types/common";

type GetAllOrderProps = {
  page?: number | string;
  pageSize?: number | string;
  orderStatus: TOrderStatus | undefined;
};
type GetAllOrdersResonse = TBaseResponse & {
  data: TOrder[];
  pagination: TPagination;
};
export const getAllOrders = async ({
  page = 1,
  pageSize = 20,
  orderStatus,
}: GetAllOrderProps): Promise<TGetAllOrdersResult> => {
  try {
    const { data } = await privateApi.get<GetAllOrdersResonse>(
      "order/get-all-orders",
      {
        params: {
          page,
          limit: pageSize,
          orderStatus,
        },
      }
    );
    return {
      orders: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    return handleError(error);
  }
};
type MakeOrderProps = {
  cartId: string;
  addressId: string;
};
type StripeCheckoutResponse = TBaseResponse & {
  session_url: string;
  orderId: string;
  order: TOrder;
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

type OrderResponse = TBaseResponse & {
  order: TOrder;
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

type OrdersResponse = TBaseResponse & {
  data: TOrder[] | [];
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

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: TOrderStatus;
}) => {
  try {
    await privateApi.patch(`order/update-order-status/${orderId}`, {
      orderStatus: status,
    });
  } catch (error) {
    return handleError(error);
  }
};
