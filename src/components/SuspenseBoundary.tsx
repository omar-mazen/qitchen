import { Suspense, type ReactNode } from "react";
import Loader from "@/components/Loader";

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps components in a Suspense boundary with a consistent loader
 * Used for lazy-loaded routes and React Query suspense
 */
export const SuspenseBoundary = ({
  children,
  fallback = <Loader />,
}: SuspenseBoundaryProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseBoundary;
