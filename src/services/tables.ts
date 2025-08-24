import { handleError } from "@/utils";
import { privateApi } from "./axios";
import type { TBaseResponse } from "@/types/common";
import type {
  TTable,
  TTableWithReservations,
  TGetAllTablesReuslt,
} from "@/types/table";

// get all tables
type GetAllTablesResponse = TBaseResponse & {
  data: TTableWithReservations[];
};
export const getAllTables = async (): Promise<TGetAllTablesReuslt> => {
  try {
    const { data } = await privateApi.get<GetAllTablesResponse>(
      "/table/get-all-tables"
    );
    return {
      tables: data.data,
    };
  } catch (error) {
    return handleError(error);
  }
};

// add table
type AddTableProps = {
  number: number;
  capacity: number;
};
type AddTableResponse = TBaseResponse & {
  data: TTable;
};
export const addTable = async ({ number, capacity }: AddTableProps) => {
  try {
    const { data } = await privateApi.post<AddTableResponse>(
      "table/create-table",
      { number, capacity }
    );
    return { table: data.data };
  } catch (error) {
    return handleError(error);
  }
};

// update table
type UpdateTableProps = {
  tableId: string;
  capacity?: number;
  number?: number;
  isActive?: boolean;
};
export const updateTable = async ({
  tableId,
  capacity,
  number,
  isActive,
}: UpdateTableProps) => {
  try {
    const { data } = await privateApi.patch<AddTableResponse>(
      `/table/update-table/${tableId}`,
      {
        capacity,
        number,
        isActive,
      }
    );
    return { table: data.data };
  } catch (error) {
    return handleError(error);
  }
};

// delete table
export const deleteTable = async ({ tableId }: { tableId: string }) => {
  try {
    const { data } = await privateApi.delete<TBaseResponse>(
      `table/delete-table/${tableId}`
    );
    return {
      success: data.success,
    };
  } catch (error) {
    handleError(error);
  }
};
