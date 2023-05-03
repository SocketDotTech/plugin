import { setIsSettingsModalOpen } from "../../state/modals";
import { useDispatch } from "react-redux";
import { Settings as SettingsIcon } from "react-feather";

// Component that lets you set the parameters for fetching quotes or building a transaction.
export const Settings = () => {
  const dispatch = useDispatch();

  const toggleSettingsModal = (value: boolean) => {
    dispatch(setIsSettingsModalOpen(value));
  };

  return (
    <>
      <button
        onClick={() => toggleSettingsModal(true)}
        className="skt-w skt-w-button skt-w-input skt-w-flex skt-w-ml-3"
      >
        <SettingsIcon className="skt-w skt-w-w-5.5 skt-w-h-5.5 skt-w-text-widget-secondary hover:skt-w-text-widget-primary hover:skt-w-rotate-45 skt-w-duration-200 skt-w-ease-linear" />
      </button>
    </>
  );
};
