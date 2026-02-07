import type {
  TOrderStatus,
  TPaymentMethod,
  TPaymentStatus,
  TPlaceType,
} from "@/types/orders";

export const PaymentStatus: TPaymentStatus[] = [
  "Pending",
  "Completed",
  "Failed",
  "Cancelled",
];
export const OrderStatus: TOrderStatus[] = [
  "Paid",
  "Processing",
  "Ready",
  "On the way",
  "Recieved",
];
export const PlaceType: TPlaceType[] = ["Online", "In-Place", "Takeaway"];
export const PaymentMethod: TPaymentMethod[] = ["Card", "COD"];
