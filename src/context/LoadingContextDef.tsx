import { createContext } from "react";

export type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  incrementLoading: () => void;
  decrementLoading: () => void;
};

export const LoadingContextImpl = createContext<LoadingContextType | undefined>(
  undefined
);
