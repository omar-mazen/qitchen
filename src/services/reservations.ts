import { extractErrorMessage } from "@/utils";
import { privateApi } from "./axios";
import type { TBaseResponse } from "@/types/common";
import type {
  TCreateReservationResult,
  TReservation,
  TReservationsResult,
} from "@/types/reservations";
import type { TGetSlotsForTables, TTableSlots } from "@/types/table";
type GetUserReservationsResponse = TBaseResponse & {
  data?: TReservation[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

export const getUserReservations = async ({
  page = 1,
}: {
  page: number;
}): Promise<{
  reservations?: TReservation[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  error?: string;
}> => {
  try {
    const { data } = await privateApi.get<GetUserReservationsResponse>(
      `reservation/get-all-reservation-for-user?page=${page}`
    );
    return {
      reservations: data?.data,
      pagination: data?.pagination,
    };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
};

type GetAllReservationsByDate = TBaseResponse & {
  data?: TReservation[] | [];
};
export const getAllReservationsByDate = async ({
  date,
}: {
  date: string;
}): Promise<TReservationsResult> => {
  try {
    const { data } = await privateApi.get<GetAllReservationsByDate>(
      `reservation/get-all-reservation-day/${date}`
    );
    return { reservations: data?.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
};
type UpdateReservationsProps = {
  reservationId: string;
  status: string;
  date?: string;
  slot?: string;
};
type UpdateReservationsResponse = TBaseResponse & {
  data?: TReservation;
};
export const updateReservation = async ({
  reservationId,
  status,
  date,
  slot,
}: UpdateReservationsProps) => {
  try {
    const { data } = await privateApi.patch<UpdateReservationsResponse>(
      `reservation/update-reservation/${reservationId}`,
      {
        status,
        date,
        slot,
      }
    );
    return { reservation: data.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
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
  try {
    const { data } = await privateApi.get<GetSlotsForTablesResponse>(
      `/reservation/get-all-slots-for-all-tables/${date}`
    );
    return { tables: data.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
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
    return { error: extractErrorMessage(error) };
  }
};

// Delete reservation
type DeleteReservationResponse = TBaseResponse & {
  message?: string;
};

export const deleteReservation = async (
  reservationId: string
): Promise<{ success?: boolean; error?: string }> => {
  try {
    const { data } = await privateApi.delete<DeleteReservationResponse>(
      `reservation/delete-reservation/${reservationId}`
    );
    return { success: true };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
};
