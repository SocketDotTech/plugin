import { useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";

// actions
import { setSelectedRoute } from "../../state/selectedRouteSlice";
import { setBestRoute } from "../../state/quotesSlice";

// components
import { ReviewModal } from "./ReviewModal";
import { Button } from "../Button";
import { Spinner } from "../common/Spinner";
import { InnerCard } from "../common/InnerCard";

import { Web3Context } from "../../providers/Web3Provider";
import { BRIDGE_NAMES } from "../../consts/";

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
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider
  const { data, isQuotesLoading } = useRoutes(
    sourceToken ?? "",
    destToken,
    sourceAmount,
    sortPref,
    userAddress
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
    const bridgeKey = bestRoute?.route?.usedBridgeNames?.[0];
    const bridgeName = BRIDGE_NAMES[bridgeKey] || bridgeKey;
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
      return "Review Quote";
    }
  }

  return (
    <InnerCard>
      <div className="text-widget-secondary mb-3 text-sm flex items-center gap-1">
        {sourceAmount&& isQuotesLoading && <Spinner size={4} />} {quotesStatus()}
      </div>
      <Button
        onClick={review}
        disabled={!bestRoute || isQuotesLoading || !isEnoughBalance}
      >
        {getButtonStatus()}
      </Button>
      <div className="flex items-center justify-between text-widget-secondary mt-2.5 text-xs">
        <a href="http://socket.tech/" target="_blank" rel="noopener noreferrer">
          Powered by Socket Technology
        </a>
        <a
          href="https://socketdottech.zendesk.com/hc/en-us"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support
        </a>
      </div>

      {isReviewOpen && (
        <ReviewModal closeModal={() => setIsReviewOpen(false)} />
      )}
    </InnerCard>
  );
};
