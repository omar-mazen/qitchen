import type { TGetUserAdresses } from "./../types/address";
import { handleError } from "@/utils";
import { privateApi } from "./axios";
import type { TAddAddressResult, TAddress } from "@/types/address";
import type { TBaseResponse } from "@/types/common";

// get addresses
type GetUserAdressesResponse = TBaseResponse & {
  data: TAddress[];
};
export const getUserAdresses = async (): Promise<TGetUserAdresses> => {
  try {
    const res = await privateApi.get<GetUserAdressesResponse>(
      "/address/get-user-addresses"
    );
    return { addresses: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};

// add address
type AddAddressProps = {
  governorate: string;
  city: string;
  street: string;
  buildingNumber: number | string;
  flatNumber: number | string;
};
type AddAddress = TBaseResponse & {
  data: TAddress;
};
export const addAddress = async ({
  governorate,
  city,
  street,
  flatNumber,
  buildingNumber,
}: AddAddressProps): Promise<TAddAddressResult> => {
  try {
    const res = await privateApi.post<AddAddress>("/address/add-address", {
      governorate,
      city,
      street,
      flatNumber,
      buildingNumber,
    });
    return { address: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};

// update address
type UpdateAddressProps = AddAddressProps & { addressId: string };
export const updateAddress = async ({
  addressId,
  governorate,
  city,
  street,
  flatNumber,
  buildingNumber,
}: UpdateAddressProps): Promise<TAddAddressResult> => {
  try {
    const res = await privateApi.patch<AddAddress>(`/address/${addressId}`, {
      governorate,
      city,
      street,
      flatNumber,
      buildingNumber,
    });
    return { address: res.data.data };
  } catch (error) {
    return handleError(error);
  }
};
// remove address
export const removeAddress = async ({ addressId }: { addressId: string }) => {
  try {
    await privateApi.delete(`/address/${addressId}`);
  } catch (error) {
    return handleError(error);
  }
};
