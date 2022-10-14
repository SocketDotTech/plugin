// A hook to
// 1. mutate build-next-tx with updated swapSlippage
// 2. call active route again with the updated slippage
// 3. update the selectedRoute/activeRoute depending on which one is being used by the transaction modal

import { setSelectedRoute } from "../state/selectedRouteSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNextTx, useActiveRoute } from "./apis";
import { setActiveRoute } from "../state/modals";
import { getSwapTx } from "../utils";

export const updateAndRefetch = (
  activeRouteId,
  inRouteSlippage,
  currentTxIndex
) => {
  const dispatch = useDispatch();
  let build = null;

  // data from store
  const newSwapSlippage = useSelector(
    (state: any) => state.quotes.swapSlippage
  );
  const isSettingsModalOpen = useSelector(
    (state: any) => state.modals.isSettingsModalOpen
  );
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);
  const currentActiveRoute = useSelector((state: any) => state.modals.activeRoute); // running in a loop

  // passing the new slippage to the database: build-next-tx api
  build = useNextTx(
    activeRouteId,
    inRouteSlippage !== newSwapSlippage,
    newSwapSlippage
  );

  // refetching active route data on closing the settings modal: active-routes api
  const shouldUpdate =
    !!build?.data?.result &&
    !build.isBuildNextTxLoading &&
    !isSettingsModalOpen;

  const updatedActiveRoute = useActiveRoute(
    build ? activeRouteId : false,
    shouldUpdate
  );

  useEffect(() => {
    // Get new swap tx, after the slippage is changed
    const newSwapTx = getSwapTx(
      updatedActiveRoute?.data?.result,
      currentTxIndex
    );

    // Get current swap tx (before the slippage is changed)
    const currentSwapTx = getSwapTx(selectedRoute?.route ?? currentActiveRoute, currentTxIndex);

    // shouldDispatch should be true only if the new swap slippage and current swap slippage are different
    const shouldDispatch =
      !!newSwapTx &&
      !!currentSwapTx &&
      newSwapTx?.swapSlippage !== currentSwapTx?.swapSlippage;

    // Setting the selectedRoute/activeRoute (depending on which one's is in use) with the new route data.
    if (shouldDispatch) {
      if(!!currentActiveRoute){
        dispatch(setActiveRoute(updatedActiveRoute?.data?.result));
      } else if (selectedRoute){
        const _update = {
          ...selectedRoute,
          route: updatedActiveRoute?.data?.result,
        }
        dispatch(setSelectedRoute(_update));
      }
    }
  }, [updatedActiveRoute]);

  return {
    loading: updatedActiveRoute.isActiveRoutesLoading,
  };
};
