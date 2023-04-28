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
        <div className="skt-w skt-w-flex skt-w-flex-col skt-w-flex-1 skt-w-p-3 skt-w-items-center skt-w-justify-between">
          <div className="skt-w skt-w-flex skt-w-flex-col skt-w-items-center">
            <AlertCircle className="skt-w skt-w-text-red-500 skt-w-w-10 skt-w-h-10" />
            <p className="skt-w skt-w-text-sm skt-w-text-widget-secondary skt-w-mt-4 skt-w-text-center">
              {error}
            </p>
          </div>
          <div className="skt-w skt-w-w-full">
            <p className="skt-w skt-w-text-center skt-w-mb-3">
              <a
                href="https://socketdottech.zendesk.com/hc/en-us"
                target="_blank"
                rel="noopener noreferrer"
                className="skt-w skt-w-anchor skt-w-text-sm skt-w-text-widget-secondary skt-w-underline hover:skt-w-text-widget-primary"
              >
                Support
              </a>
            </p>
            <Button
              onClick={close}
              classNames="skt-w-bg-red-500 hover:skt-w-bg-red-600 skt-w-text-white"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Modal>
    );
  else return null;
};
