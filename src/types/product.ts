export type TProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  ingredients: string[];
  category: string;
  images: string[];
  imagesPublicId: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type GetProductByIdResult = {
  error?: string;
  product?: TProduct | undefined;
};
