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
        className="skt-w skt-w-button skt-w-input flex ml-3"
      >
        <SettingsIcon className="skt-w w-5.5 h-5.5 text-widget-secondary hover:text-widget-primary hover:rotate-45 duration-200 ease-linear" />
      </button>
    </>
  );
};
