import { useNavigation } from "react-router";
import { useEffect } from "react";
import { useLoading } from "@/hooks/useLoading";

/**
 * Hook to automatically manage global loading state during React Router navigation
 * Triggers loader on:
 * - Route transitions
 * - Form submissions
 * - Redirects
 */
export const useNavigationLoader = () => {
  const navigation = useNavigation();
  const { incrementLoading, decrementLoading } = useLoading();

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      incrementLoading();
    } else {
      decrementLoading();
    }

    return () => {
      if (navigation.state === "loading" || navigation.state === "submitting") {
        decrementLoading();
      }
    };
  }, [navigation.state, incrementLoading, decrementLoading]);

  return navigation;
};
