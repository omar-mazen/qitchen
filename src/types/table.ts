import type { TReservation } from "./reservations";

export type TTable = {
  number: number;
  capacity: number;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};
export type TTableWithReservations = {
  number: number;
  capacity: number;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  reservations: TReservation[];
};

export type TGetAllTablesReuslt = {
  tables?: TTableWithReservations[];
  error?: string;
};
