import type { TOrderStatus, TPaymentStatus } from "@/types/orders";

export const PaymentStatus: TPaymentStatus[] = [
  "Pending",
  "Completed",
  "Failed",
  "Cancelled",
];
export const OrderStatus: TOrderStatus[] = [
  "Processing",
  "Paid",
  "Ready",
  "On the way",
  "Recieved",
];
