import type { TProduct } from "./product";

export type TCategory = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  products: TProduct[];
};
export type GetCategoriesResult = {
  error?: string;
  totalPages?: number;
  data?: TCategory[];
};
export type AddCategoryResult = {
  error?: string;
  category?: TCategory;
};
