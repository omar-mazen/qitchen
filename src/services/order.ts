import type {
  TGetAllOrdersResult,
  TOrdersByStatusResponse,
  TOrderStatus,
  TPlaceType,
  TVerifyPaymentResponse,
} from "./../types/orders";
import { extractErrorMessage } from "@/utils";
import { privateApi } from "./axios";
import type {
  TOrdersResult,
  TOrder,
  TOrderDetailsResult,
} from "@cTypes/orders";
import type { TBaseResponse, TPagination } from "@/types/common";
import type { TPaymentMethod } from "@/types/payment-methods";

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
    throw new Error(extractErrorMessage(error));
  }
};

type GetOrdersByStatus = {
  page?: number | string;
  pageSize?: number | string;
  orderStatus: TOrderStatus[];
};
type GetOrdersByStatusResponse = TBaseResponse & {
  data: TOrderStatus[];
};
export const getOrdersByStatus = async ({
  page = 1,
  pageSize = 10,
  orderStatus,
}: GetOrdersByStatus): Promise<TOrdersByStatusResponse> => {
  const status = "orderStatus=" + orderStatus.join("&orderStatus=");
  try {
    const { data } = await privateApi.get<GetOrdersByStatusResponse>(
      `order/get-orders-by-status?${status}`,
      {
        params: {
          page,
          limit: pageSize,
        },
      }
    );
    return {
      orders: data.data,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

type MakeOrderProps = {
  cartId: string;
  addressId: string;
  paymentMethod: TPaymentMethod;
  placeType: TPlaceType;
  governorate?: string;
  city?: string;
  tableId?: string;
};
type StripeCheckoutResponse = TBaseResponse & {
  session_url: string;
  orderId: string;
  order: TOrder;
};
export const makeOrder = async ({
  cartId,
  addressId,
  paymentMethod,
  placeType,
  governorate,
  city,
  tableId,
}: MakeOrderProps) => {
  try {
    const res = await privateApi.post<StripeCheckoutResponse>(
      `/order/create-order-cart/${cartId}/${addressId}`,
      {
        paymentMethod,
        placeType,
        governorate,
        city,
        ...(placeType === "In-Place" && { tableId }),
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
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
    throw new Error(extractErrorMessage(error));
  }
};

type OrdersResponse = TBaseResponse & {
  data: TOrder[];
  pagination: TPagination;
};

export const getCurrentUserOrders = async ({
  page = 1,
}: {
  page: number | string;
}): Promise<TOrdersResult> => {
  try {
    const { data } = await privateApi.get<OrdersResponse>(
      `/order/get-all-orders-for-current-user?page=${page}&limit=10`
    );
    return {
      orders: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
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
    throw new Error(extractErrorMessage(error));
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
    throw new Error(extractErrorMessage(error));
  }
};

type ReorderItem = {
  productId: string;
  quantity: number;
};

type BaseReorderProps = {
  addressId: string;
  items: ReorderItem[];
  paymentMethod: TPaymentMethod;
};

type OnlineReorderProps = BaseReorderProps & {
  placeType: "Online";
  governorate: string;
  city: string;
};

type OfflineReorderProps = BaseReorderProps & {
  placeType: "In-Place" | "Takeaway";
};

export type ReorderProps = OnlineReorderProps | OfflineReorderProps;
export const reorder = async (props: ReorderProps) => {
  const { addressId, items, placeType, paymentMethod } = props;

  const res = await privateApi.post(
    `order/create-order-products-multiple/${addressId}`,
    {
      products: items,
      placeType,
      paymentMethod,
      ...(placeType === "Online" && {
        governorate: props.governorate,
        city: props.city,
      }),
    }
  );

  if (res.data.session_url) {
    location.href = res.data.session_url;
  }

  return res.data;
};
