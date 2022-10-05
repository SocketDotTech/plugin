import { time } from "../../consts/time";
import { Routes } from "../../lib/src";
import { useContext } from "react";
import useSWR from "swr";
import { Web3Context } from "../../providers/Web3Provider";

// Function to get all the pending routes.
export const usePendingRoutes = () => {
  const web3Context = useContext(Web3Context);
  // const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const { userAddress } = web3Context.web3Provider;

  async function fetchActiveRoutes(address: string) {
    const result = await Routes.getActiveRoutesForUser({
      userAddress: address,
      routeStatus: "PENDING",
      limit: "30",
    });
    return result;
  }

  const { data, error, isValidating, mutate } = useSWR(
    userAddress ? [userAddress, "active-routes"] : null,
    fetchActiveRoutes,
    {
      refreshInterval: time.ACTIVE_ROUTES_REFRESH * 1000, //refresh active routes every 30 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    data: data,
    isQuotesLoading: userAddress && ((!data && !error) || isValidating),
    mutate,
  };
};
