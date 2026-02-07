import { privateApi } from "./axios";
import type { TBaseResponse } from "@/types/common";
import { extractErrorMessage } from "@/utils";
import type {
  TPaymentMethodResult,
  TPaymentMethod,
  TUpdatePaymentMethodResult,
} from "@/types/payment-methods";

type TGetPaymentMethodsResponse = TBaseResponse & {
  data: TPaymentMethod[];
};

export const getPaymentMethods = async (): Promise<TPaymentMethodResult> => {
  try {
    const res = await privateApi.get<TGetPaymentMethodsResponse>(
      `admin/payment-methods`
    );
    return {
      methods: res.data.data,
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getActivePaymentMethods =
  async (): Promise<TPaymentMethodResult> => {
    try {
      const res = await privateApi.get<TGetPaymentMethodsResponse>(
        `admin/payment-methods/active`
      );
      return {
        methods: res.data.data,
        message: res.data.message,
        success: res.data.success,
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

type TUpdatePaymentMethodProps = {
  id: string;
  displayName?: string;
  description?: string;
  isActive?: boolean;
};
type TUpdatePaymentMethodsResponse = TBaseResponse & {
  data: TPaymentMethod;
};
export const updatePaymentMethods = async ({
  id,
  isActive,
  displayName,
  description,
}: TUpdatePaymentMethodProps): Promise<TUpdatePaymentMethodResult> => {
  try {
    const res = await privateApi.patch<TUpdatePaymentMethodsResponse>(
      `admin/payment-method/${id}`,
      { id, isActive, displayName, description }
    );
    return {
      method: res.data.data,
      message: res.data.message,
      success: res.data.success,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
