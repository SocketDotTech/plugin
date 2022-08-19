import { setError } from "../../state/modals";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "./Modal";
import { AlertCircle } from "react-feather";
import { Button } from "./Button";

export const ErrorModal = () => {
  const dispatch = useDispatch();
  const error = useSelector((state: any) => state.modals.error);
  function close() {
    dispatch(setError(null));
  }
  if (error)
    return (
      <Modal title="Error" closeModal={close}>
        <div className="skt-w flex flex-col flex-1 p-3 items-center justify-between">
          <div className="skt-w flex flex-col items-center">
            <AlertCircle className="skt-w text-red-500 w-10 h-10" />
            <p className="skt-w text-sm text-widget-secondary mt-4 text-center">
              {error}
            </p>
          </div>
          <div className="skt-w w-full">
            <p className="skt-w text-center mb-3">
              <a
                href="https://socketdottech.zendesk.com/hc/en-us"
                target="_blank"
                rel="noopener noreferrer"
                className="skt-w skt-w-anchor text-sm text-widget-secondary underline hover:text-widget-primary"
              >
                Support
              </a>
            </p>
            <Button
              onClick={close}
              classNames="bg-red-500 hover:bg-red-600 text-white"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Modal>
    );
  else return null;
};
