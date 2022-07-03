import { useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

// actions
import { setSelectedRoute } from "../../state/selectedRouteSlice";
import { setBestRoute } from "../../state/quotesSlice";

// components
import { ReviewModal } from "./ReviewModal";
import { Button } from "../Button";

export const RouteDetails = () => {
  const dispatch = useDispatch();
  
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const isEnoughBalance = useSelector(
    (state: any) => state.amount.isEnoughBalance
  );
  const { data, isQuotesLoading } = useRoutes(
    sourceToken ?? "",
    destToken,
    sourceAmount,
    sortPref
  );
  const shouldFetch = sourceAmount && sourceToken && destToken && sortPref;
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  useEffect(() => {
    isTxModalOpen && setIsReviewOpen(false);
  }, [isTxModalOpen]);

  useEffect(() => {
    if (data) {
      dispatch(setBestRoute(data?.[0]));
    } else {
      dispatch(setBestRoute(null));
    }
  }, [data]);

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

  function getButtonStatus() {
    if (!isEnoughBalance) {
      return "Not enough balance";
    } else {
      return "Review Bridge";
    }
  }

  return (
    <div>
      <div className="px-2 py-2 rounded bg-gray-300 mt-4 mb-3">
        {quotesStatus()}
      </div>
      <Button
        onClick={review}
        disabled={!bestRoute || isQuotesLoading || !isEnoughBalance}
      >
        {getButtonStatus()}
      </Button>

      {isReviewOpen && (
        <ReviewModal closeModal={() => setIsReviewOpen(false)} />
      )}
    </div>
  );
};
