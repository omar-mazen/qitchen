import { Suspense, type ReactElement } from "react";
import Loader from "@/components/Loader";

/**
 * Wraps route elements in a Suspense boundary with loader fallback
 * Ensures smooth loading states during code splitting and data fetching
 */
export const RouteWithSuspense = ({ element }: { element: ReactElement }) => (
  <Suspense fallback={<Loader />}>{element}</Suspense>
);
