import { setIsTxModalOpen } from "../state/modals";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "./Modal";

export const TxModal = () => {
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  isTxModalOpen && console.log("tx modal is opened");
  const dispatch = useDispatch();
  function closeTxModal() {
    dispatch(setIsTxModalOpen(false));
  }

  if (!isTxModalOpen) return null;
  return (
    <Modal title="Bridging transaction" closeModal={closeTxModal}>
      All details here
    </Modal>
  );
};
