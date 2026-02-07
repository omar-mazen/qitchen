import type { TBaseResponse } from "@/types/common";
import { privateApi } from "./axios";
import { extractErrorMessage } from "@/utils";
import type { TDashboardStats, TGetDashboardStats } from "@/types/stats";

type GetStatsResponse = TBaseResponse & {
  data: TDashboardStats;
};

export const getStats = async (): Promise<TGetDashboardStats> => {
  try {
    const { data } = await privateApi.get<GetStatsResponse>("home/home-data");
    return { data: data.data };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
