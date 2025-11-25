import type { TAddress } from "./address";
import type { TCARTProduct } from "./cart";
import type { TBaseResponse, TPagination } from "./common";

export type TPaymentStatus = "Pending" | "Completed" | "Failed" | "Cancelled";
export type TOrderStatus =
  | "Processing"
  | "Paid"
  | "Ready"
  | "On the way"
  | "Recieved";

export const TOrderStatusColors: Record<TOrderStatus, string> = {
  Paid: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 hover:text-green-800 transition-colors duration-200",
  Processing:
    "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-800 transition-colors duration-200",
  Ready:
    "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 hover:text-blue-800 transition-colors duration-200",
  "On the way":
    "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 hover:text-purple-800 transition-colors duration-200",
  Recieved:
    "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200",
};

export const TPaymentStatusColors: Record<TPaymentStatus, string> = {
  Pending:
    "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-800 transition-colors duration-200",
  Completed:
    "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 hover:text-green-800 transition-colors duration-200",
  Failed:
    "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 hover:text-red-800 transition-colors duration-200",
  Cancelled:
    "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200",
};

export type TOrder = {
  _id: string;
  stripeSessionID: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  products: TCARTProduct[] | [];
  totalPrice: number;
  totalQuantity: number;
  paymentStatus: TPaymentStatus;
  orderStatus: TOrderStatus;
  address: TAddress;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type TOrderDetailsResult = {
  order?: TOrder;
  error?: string;
};
export type TGetAllOrdersResult = {
  orders?: TOrder[] | [];
  pagination?: TPagination;
  error?: string;
};
export type TOrdersResult = {
  orders?: TOrder[] | [];
  error?: string;
};

export type TVerifyPaymentResponse = TBaseResponse & {
  paymentStatus: string;
  orderStatus: string;
  order: TOrder[];
};

export type TOrdersByStatus = {
  status: string;
  orders: TOrder[];
};

export type TOrdersByStatusResponse = {
  orders?: TOrderStatus[];
  error?: string;
};
