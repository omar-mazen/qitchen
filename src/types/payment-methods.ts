import type { TBaseResponse } from "./common";

export type TPaymentMethod = {
  _id: string;
  name: string;
  isActive: boolean;
  displayName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TPaymentMethodResult = TBaseResponse & {
  methods: TPaymentMethod[];
};

export type TUpdatePaymentMethodResult = TBaseResponse & {
  method: TPaymentMethod;
};
