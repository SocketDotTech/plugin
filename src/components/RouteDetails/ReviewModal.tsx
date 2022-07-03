import { useDispatch, useSelector } from "react-redux";

// components
import { Button } from "../Button";
import { Modal } from "../Modal";
import { TokenDetail } from "../TokenDetail";

// actions
import { setIsTxModalOpen } from "../../state/modals";
import { setSelectedRoute } from "../../state/selectedRouteSlice";
import { TxStepDetails } from "../TxModal/TxStepDetails";

export const ReviewModal = ({ closeModal }: { closeModal: () => void }) => {
  const dispatch = useDispatch();
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);

  function updateSelectedRoute() {
    dispatch(setSelectedRoute(bestRoute));
  }

  async function openTxModal() {
    dispatch(setIsTxModalOpen(true));
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
        <TxStepDetails activeRoute={selectedRoute?.route} />
        {bestRoute === selectedRoute ? (
          <Button onClick={openTxModal}>Confirm Bridge</Button>
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
