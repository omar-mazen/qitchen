import { handleError } from "@/utils";
import { privateApi } from "./axios";
import type { TBaseResponse } from "@/types/common";
import type {
  TCreateReservationResult,
  TReservation,
  TReservationsResult,
} from "@/types/reservations";
import type { TGetSlotsForTables, TTableSlots } from "@/types/table";

type GetAllReservations = TBaseResponse & {
  data?: TReservation[] | [];
};
export const getAllReservations = async ({
  date,
}: {
  date: string;
}): Promise<TReservationsResult> => {
  try {
    const { data } = await privateApi.get<GetAllReservations>(
      `reservation/get-all-reservation-day/${date}`
    );
    return { reservations: data?.data };
  } catch (error) {
    return handleError(error);
  }
};
type GetUpdateReservations = {
  reservationId: string;
  status: string;
  date?: string;
  slot?: string;
};
type UpdateReservations = TBaseResponse & {
  data?: TReservation;
};
export const updateReservation = async ({
  reservationId,
  status,
  date,
  slot,
}: GetUpdateReservations) => {
  try {
    const { data } = await privateApi.patch<UpdateReservations>(
      `reservation/update-reservation/${reservationId}`,
      {
        status,
        date,
        slot,
      }
    );
    return { reservation: data.data };
  } catch (error) {
    return handleError(error);
  }
};

type GetSlotsForTablesResponse = TBaseResponse & {
  data?: TTableSlots[] | [];
};
export const getSlotsForTables = async ({
  date,
}: {
  date: string;
}): Promise<TGetSlotsForTables> => {
  console.log(date);
  try {
    const { data } = await privateApi.get<GetSlotsForTablesResponse>(
      `/reservation/get-all-slots-for-all-tables/${date}`
    );
    return { tables: data.data };
  } catch (error) {
    return handleError(error);
  }
};

type CreateReservationProps = {
  tableNumber: number;
  date: string;
  slot: string;
};
type CreateReservationResponse = TBaseResponse & {
  data?: TReservation;
};
export const createReservation = async ({
  tableNumber,
  date,
  slot,
}: CreateReservationProps): Promise<TCreateReservationResult> => {
  try {
    const { data } = await privateApi.post<CreateReservationResponse>(
      "/reservation/create-reservation",
      {
        tableNumber,
        date,
        slot,
      }
    );
    return { reservation: data?.data };
  } catch (error) {
    return handleError(error);
  }
};
