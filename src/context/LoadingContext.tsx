import { useState, useCallback, type ReactNode } from "react";
import { LoadingContextImpl } from "./LoadingContextDef";

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const incrementLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const decrementLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setLoadingCount(loading ? 1 : 0);
  }, []);

  const isLoading = loadingCount > 0;

  return (
    <LoadingContextImpl.Provider
      value={{ isLoading, setIsLoading, incrementLoading, decrementLoading }}
    >
      {children}
    </LoadingContextImpl.Provider>
  );
};
