import type { TTable } from "./table";
import type { TUser } from "./user";

export type TReservationStatus = "Pending" | "Confirmed" | "Cancelled";
export type TReservation = {
  _id: string;
  user: TUser;
  table: TTable;
  reservationDate: string;
  status: TReservationStatus;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};
export type TReservationsResult = {
  reservations?: TReservation[] | [];
  error?: string;
};
export type TCreateReservationResult = {
  reservation?: TReservation;
  error?: string;
};
