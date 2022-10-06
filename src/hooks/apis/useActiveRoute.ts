import { Routes } from "@socket.tech/socket-v2-sdk";
import useSWR from "swr";

// Function to get current activeRoute details
export const useActiveRoute = (activeRouteId, shouldFetch) => {
  async function fetchActiveRouteDetails(_activeRouteId: number) {
    const result = await Routes.getActiveRoute({
      activeRouteId: _activeRouteId,
    });
    return result;
  }
  const { data, error, isValidating, mutate } = useSWR(
    activeRouteId && shouldFetch
      ? [activeRouteId, "current-active-route"]
      : null,
    fetchActiveRouteDetails,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  return {
    data: data,
    mutate,
    error: error,
    isActiveRoutesLoading: isValidating || (shouldFetch && !data && !error),
  };
};
