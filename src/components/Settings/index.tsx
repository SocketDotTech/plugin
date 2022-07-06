import { setSortPref } from "../../state/quotesSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../Modal";
import { Settings as SettingsIcon } from "react-feather";

export const Settings = () => {
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [_sortPref, _setSortPref] = useState<string>("");
  const handleChange = (id: string) => {
    _setSortPref(id);
    dispatch(setSortPref(id));
  };

  if (isSettingsOpen)
    return (
      <Modal title="Settings" closeModal={() => setIsSettingsOpen(false)}>
        All settings here
        <select
          onChange={(e) => handleChange(e.target.value)}
          value={_sortPref}
        >
          <option value="output">High output</option>
          <option value="time">Time</option>
          <option value="gas">Gas</option>
        </select>
      </Modal>
    );

  return (
    <button onClick={() => setIsSettingsOpen(true)}>
      <SettingsIcon className="w-5.5 h-5.5 text-widget-secondary hover:text-widget-primary hover:rotate-45 duration-200 ease-linear" />
    </button>
  );
};
