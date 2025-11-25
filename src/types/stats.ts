export type TDashboardStats = {
  activeOrdersCount: number;
  todayTotalRevenue: number;
  todayOrderCount: number;
  todayReservationCount: number;
  totalProductsCount: number;
  totalCategoriesCount: number;
  availableTablesCount: number;
  totalUsersCount: number;
  mostOrderdProducts:
    | {
        totalSold: number;
        productId: string;
        name: string;
        price: number;
        image: string;
      }[]
    | [];
};
export type TGetDashboardStats = {
  data?: TDashboardStats;
  error?: string;
};
