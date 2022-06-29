import { useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedRoute } from "../../state/selectedRouteSlice";

// components
import { ReviewModal } from "./ReviewModal";
import { Button } from "../Button";

// make a common route detail component with completed boolean param.
// can be used in review and txmodal

export const RouteDetails = () => {
  const dispatch = useDispatch();
  // const sourceChainId = useSelector(
  //   (state: any) => state.networks.sourceChainId
  // );
  // const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const { data, isQuotesLoading } = useRoutes(
    sourceToken,
    destToken,
    sourceAmount,
    sortPref
  );
  const shouldFetch = sourceAmount && sourceToken && destToken && sortPref;
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  useEffect(() => {
    isTxModalOpen && setIsReviewOpen(false);
  }, [isTxModalOpen])

  function review() {
    dispatch(setSelectedRoute(bestRoute));
    setIsReviewOpen(true);
  }

  function quotesStatus() {
    const bridgeName = bestRoute?.route?.usedBridgeNames?.[0];
    return shouldFetch
      ? isQuotesLoading
        ? "Fetching best quote..."
        : bestRoute
        ? bridgeName
        : "No routes available"
      : "Enter amount";
  }
  return (
    <div>
      <div className="px-2 py-2 rounded bg-gray-300 mt-4 mb-3">
        {quotesStatus()}
      </div>
      <Button onClick={review} disabled={!bestRoute || isQuotesLoading}>
        Review Bridge
      </Button>

      {isReviewOpen && (
        <ReviewModal closeModal={() => setIsReviewOpen(false)} />
      )}
    </div>
  );
};
