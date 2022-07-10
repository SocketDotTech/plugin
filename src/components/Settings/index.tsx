import { setSortPref } from "../../state/quotesSlice";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "../Modal";
import { ChevronDown, Settings as SettingsIcon } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";

export const Settings = () => {
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [_sortPref, _setSortPref] = useState<string>("output");
  const [dropdown, openDropdown] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  const handleChange = (item) => {
    _setSortPref(item.id);
    dispatch(setSortPref(item.id));
    setLabel(item.label);
    openDropdown(false);
  };

  const LABEL_STATE = {
    OUTPUT: "High Return",
    TIME: "Fastest",
    GAS: "Low Gas Fee",
  };

  const sortOptions = [
    { id: "output", label: LABEL_STATE.OUTPUT },
    { id: "time", label: LABEL_STATE.TIME },
    { id: "gas", label: LABEL_STATE.GAS },
  ];

  useEffect(() => {
    setLabel(LABEL_STATE.OUTPUT);
  }, []);

  if (isSettingsOpen)
    return (
      <Modal title="Settings" closeModal={() => setIsSettingsOpen(false)}>
        <div className="px-3 flex items-center mt-2 gap-2">
          <p className="text-sm text-widget-secondary font-medium my-2 gap-8">
            Sort
          </p>
          <div
            className="relative border border-widget-secondary-text border-opacity-10 flex w-auto"
            style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
          >
            <Option onClick={() => openDropdown(!dropdown)} active>
              {label}{" "}
              <ChevronDown
                className={`w-4 h-4 text-widget-secondary transition-all ${
                  dropdown ? "rotate-180" : ""
                }`}
              />
            </Option>
            {dropdown && (
              <div
                className="absolute top-10 left-0 w-full border border-widget-secondary-text border-opacity-10 overflow-hidden"
                style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
              >
                {sortOptions.map((x) => {
                  return (
                    <Option onClick={() => handleChange(x)}>{x.label}</Option>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    );

  return (
    <button onClick={() => setIsSettingsOpen(true)}>
      <SettingsIcon className="w-5.5 h-5.5 text-widget-secondary hover:text-widget-primary hover:rotate-45 duration-200 ease-linear" />
    </button>
  );
};

const Option = ({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) => {
  return (
    <button
      className={`w-32 px-2 py-2 text-widget-secondary text-sm flex items-center justify-between gap-2 ${
        active ? "" : "hover:bg-widget-secondary"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
