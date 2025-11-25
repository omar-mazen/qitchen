import type { TOrderStatus, TPaymentStatus } from "@/types/orders";

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
