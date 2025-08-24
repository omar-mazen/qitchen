import type { TUser } from "./user";

export type TReservation = {
  _id: string;
  user: Omit<TUser, "phoneNumber" | "address" | "role">;
  table: string;
  reservationDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
