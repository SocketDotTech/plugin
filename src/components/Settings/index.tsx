import { setSortPref } from "../../state/quotesSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../Modal";

export const Settings = () => {
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [_sortPref, _setSortPref] = useState<string>("");
  const handleChange = (id: "time" | "output" | "gas") => {
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
    <button
      className="hover:text-blue-500"
      onClick={() => setIsSettingsOpen(true)}
    >
      settings
    </button>
  );
};
