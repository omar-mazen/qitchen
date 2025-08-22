export type TBaseResponse = {
  success: boolean;
  message: string;
};
export type TPagination = {
  currentPage: number | string;
  totalPages: number | string;
  totalOrders: number | string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
