import { useDispatch, useSelector } from "react-redux";
import { SocketTx } from "socket-v2-sdk";
import { useState } from "react";
import { socket } from "../../hooks/apis";

// components
import { Button } from "../Button";
import { Modal } from "../Modal";
import { TokenDetail } from "../TokenDetail";

// actions
import { setIsTxModalOpen } from "../../state/modals";
import { setTxDetails } from "../../state/txDetails";
import { setSelectedRoute } from "../../state/selectedRouteSlice";

export const ReviewModal = ({ closeModal }: { closeModal: () => void }) => {
  const userAddress = process.env.REACT_APP_ADDRESS;
  const dispatch = useDispatch();
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function updateSelectedRoute() {
    dispatch(setSelectedRoute(bestRoute));
  }

  async function executeRoute() {
    const execute = await socket.start(selectedRoute);

    try {
      setIsLoading(true);
      const next: IteratorResult<SocketTx, void> = await execute.next();
      dispatch(
        setTxDetails({
          account: userAddress,
          routeId: next.value.activeRouteId,
          stepIndex: next.value.userTxIndex,
          txHash: next.value.value,
        })
      );
      dispatch(setIsTxModalOpen(true));
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
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
        details will come here {isLoading && "loading"}
        {bestRoute === selectedRoute ? (
          <Button onClick={executeRoute} disabled={isLoading}>
            {isLoading ? "loading..." : "Confirm Bridge"}
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
