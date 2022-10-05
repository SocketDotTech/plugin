import { Routes } from "@socket.tech/socket-v2-sdk";
import useSWR from "swr";

export const useNextTx = (activeRouteId, shouldFetch, swapSlippage) => {
  const _shouldFetch = shouldFetch && !!activeRouteId;
  async function callBuildNextTx(id, _swapSlippage) {
    const result = await Routes.nextTx({
      activeRouteId: id,
      swapSlippage: _swapSlippage,
    });
    return result;
  }
  const { data, error } = useSWR(
    _shouldFetch ? [activeRouteId, swapSlippage, "build-next-tx"] : null,
    callBuildNextTx,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  return {
    data: data,
    isBuildNextTxLoading: _shouldFetch && !data && !error,
    error: error,
  };
};
