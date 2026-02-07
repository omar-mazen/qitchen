import { useContext } from "react";
import { LoadingContextImpl } from "@/context/LoadingContextDef";

export const useLoading = () => {
  const context = useContext(LoadingContextImpl);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
