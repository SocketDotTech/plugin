import { useRoutes } from "../../hooks/apis";
import { useSelector } from "react-redux";
import { Button } from "../Button";
import { useState } from "react";
import { Modal } from "../Modal";
import { TokenDetail } from "../TokenDetail";

export const RouteDetails = () => {
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const { data, isQuotesLoading } = useRoutes(
    sourceToken,
    destToken,
    sourceAmount,
    sortPref
  );
  const shouldFetch = sourceAmount && sourceToken && destToken && sortPref;
  // const quotes = useSelector((state: any) => state.quotes.allQuotes);
  // const toAmount = quotes?.[0]?.route?.toAmount;
  // const selectedRoute = quotes?.[0];
  // const selectedRoute = allQuotes?.[0];
  const selectedRoute = useSelector((state: any) => state.quotes.selectedRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  function quotesStatus() {
    const bridgeName = selectedRoute?.route?.usedBridgeNames?.[0];
    return shouldFetch
      ? isQuotesLoading
        ? "Fetching quotes..."
        : selectedRoute
        ? bridgeName
        : "No routes available"
      : "Enter amount";
  }
  return (
    <div>
      <div className="px-2 py-2 rounded bg-gray-300 mt-4 mb-3">
        {quotesStatus()}
      </div>
      <Button
        onClick={() => setIsReviewOpen(true)}
        disabled={!selectedRoute || isQuotesLoading}
      >
        Review
      </Button>

      {isReviewOpen && (
        <ReviewModal closeModal={() => setIsReviewOpen(false)} />
      )}
    </div>
  );
};

const ReviewModal = ({ closeModal }: { closeModal: () => void }) => {
  const selectedRoute = useSelector((state: any) => state.quotes.selectedRoute);
  return (
    <Modal title="review" closeModal={closeModal}>
      <div className="flex flex-col justify-between flex-1">
        <div className="flex justify-between mt-5 items-center">
          <TokenDetail
            token={selectedRoute?.path?.fromToken}
            amount={selectedRoute?.amount}
          />
          <span>arrow</span>
          <TokenDetail
            token={selectedRoute?.path?.toToken}
            amount={selectedRoute?.route?.toAmount}
          />
        </div>
        details will come here
        <Button onClick={() => console.log("bridge")}>
          {/* {isLoading ? "Loading" : "Bridge"} */}
          Bridge
        </Button>
      </div>
    </Modal>
  );
};
