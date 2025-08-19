export type TAddress = {
  _id: string;
  owner: string;
  governorate: string;
  city: string;
  street: string;
  buildingNumber: number | string;
  flatNumber: number | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type TGetUserAdresses = {
  addresses?: TAddress[];
  error?: string;
};
export type TAddAddressResult = {
  address?: TAddress;
  error?: string;
};
