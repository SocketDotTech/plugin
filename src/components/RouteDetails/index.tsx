import { useRoutes } from "../../hooks/apis";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Button";
import { useState } from "react";
import { Modal } from "../Modal";
import { TokenDetail } from "../TokenDetail";
import { setSelectedRoute } from "../../state/selectedRouteSlice";

export const RouteDetails = () => {
  const dispatch = useDispatch();
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
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

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

const ReviewModal = ({ closeModal }: { closeModal: () => void }) => {
  const dispatch = useDispatch();
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);
  function updateSelectedRoute() {
    dispatch(setSelectedRoute(bestRoute));
  }
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
        {bestRoute === selectedRoute ? (
          <Button onClick={() => console.log("bridge")}>
            Bridge
          </Button>
        ) : (
          <div className="flex">
            <span>Quote updated</span>
            <Button onClick={updateSelectedRoute}>Accept</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
