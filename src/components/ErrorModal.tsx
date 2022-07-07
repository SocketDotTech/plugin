import { setError } from "../state/modals";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "./Modal";

export const ErrorModal = () => {
  const dispatch = useDispatch();
  const error = useSelector((state: any) => state.modals.error);
  function close() {
    dispatch(setError(null));
  }
  if (error)
    return (
      <Modal title="Error" closeModal={close}>
        <div className="flex flex-col flex-1 p-3">
          <p className="text-sm text-widget-secondary">{error}</p>
        </div>
      </Modal>
    );
  else return null;
};
