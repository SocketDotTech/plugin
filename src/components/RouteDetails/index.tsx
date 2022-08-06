import { useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";

// actions
import { setSelectedRoute } from "../../state/selectedRouteSlice";
import { setBestRoute } from "../../state/quotesSlice";
import { setTxDetails } from "../../state/txDetails";

// components
import { ReviewModal } from "./ReviewModal";
import { Button } from "../common/Button";
import { Spinner } from "../common/Spinner";
import { InnerCard } from "../common/InnerCard";

import { Web3Context } from "../../providers/Web3Provider";
import { BRIDGE_DISPLAY_NAMES, QuoteStatus, ButtonTexts } from "../../consts";
import { useTransition } from "@react-spring/web";

export const RouteDetails = () => {
  const dispatch = useDispatch();

  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const refuelEnabled = useSelector((state: any) => state.quotes.refuelEnabled);
  const isEnoughBalance = useSelector(
    (state: any) => state.amount.isEnoughBalance
  );
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;

  // Hook to fetch the quotes for given params.
  const { data, isQuotesLoading } = useRoutes(
    sourceToken ?? "",
    destToken,
    sourceAmount,
    sortPref,
    userAddress,
    refuelEnabled
  );

  // Boolean variable to fill all condition before the api call is made to fetch quotes.
  const shouldFetch = sourceAmount && sourceToken && destToken && sortPref;

  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  // SetTxDetails from local storage to state
  useEffect(() => {
    if (localStorage) {
      const prevTxDetails = JSON.parse(localStorage.getItem("txData")) ?? {};
      dispatch(
        setTxDetails({
          prevTxDetails,
        })
      );
    }
  }, []);

  useEffect(() => {
    isTxModalOpen && setIsReviewOpen(false);
  }, [isTxModalOpen]);

  useEffect(() => {
    if (data) {
      const bestRoute = data?.[0];
      dispatch(setBestRoute(bestRoute));

      // if refuel object is available, check the total native token required is available or not. 
      // const nativeTokenAmount = bestRoute?.refuel?.fromAmount;
      // Check the native token. See if that much balance is availabe and then disable button.
      // Also, you need to store the native token balance instead of selected token balance. 
    } else {
      dispatch(setBestRoute(null));
    }
  }, [data]);

  function review() {
    dispatch(setSelectedRoute(bestRoute));
    setIsReviewOpen(true);
  }

  // Function that returns status once the fetching has started to get quotes.
  function quotesStatus() {
    const bridgeKey = bestRoute?.route?.usedBridgeNames?.[0];
    const bridgeName = BRIDGE_DISPLAY_NAMES[bridgeKey] || bridgeKey;
    return shouldFetch
      ? isQuotesLoading
        ? QuoteStatus.FETCHING_QUOTE
        : bestRoute
        ? bridgeName
        : QuoteStatus.NO_ROUTES_AVAILABLE
      : QuoteStatus.ENTER_AMOUNT;
  }

  // Returns the text shown on the button depending on the status.
  function getButtonStatus() {
    if (!isEnoughBalance) {
      return ButtonTexts.NOT_ENOUGH_BALANCE;
    } else {
      return ButtonTexts.REVIEW_QUOTE;
    }
  }

  const transitions = useTransition(isReviewOpen, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    config: { duration: 200 },
    onReset: () => setIsReviewOpen(false),
  });

  return (
    <InnerCard>
      <div className="skt-w text-widget-secondary mb-3 text-sm flex items-center gap-1">
        {sourceAmount && sourceAmount !== "0" && isQuotesLoading && (
          <Spinner size={4} />
        )}{" "}
        {quotesStatus()}
      </div>
      <Button
        onClick={review}
        disabled={!bestRoute || isQuotesLoading || !isEnoughBalance}
      >
        {getButtonStatus()}
      </Button>
      <div className="skt-w flex items-center justify-between text-widget-secondary mt-2.5 text-xs">
        <a href="http://socket.tech/" target="_blank" rel="noopener noreferrer" className="skt-w skt-w-anchor">
          Powered by Socket
        </a>
        <a
          href="https://socketdottech.zendesk.com/hc/en-us"
          target="_blank"
          rel="noopener noreferrer"
          className="skt-w skt-w-anchor"
        >
          Support
        </a>
      </div>

      {transitions(
        (style, item) =>
          item && (
            <ReviewModal
              closeModal={() => setIsReviewOpen(false)}
              style={style}
            />
          )
      )}
    </InnerCard>
  );
};
