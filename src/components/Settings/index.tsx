import { setSortPref } from "../../state/quotesSlice";
import { ReactNode, useContext, useEffect, useState } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";

// hooks
import { useDispatch } from "react-redux";
import { useTransition } from "@react-spring/web";
import useClickOutside from "../../hooks/useClickOutside";

// components
import { Modal } from "../common/Modal";
import { ChevronDown, Settings as SettingsIcon } from "react-feather";
import { SwapSlippage } from "./SwapSlippage";

// Component that lets you set the parameters for fetching quotes or building a transaction.
export const Settings = () => {
  const dispatch = useDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(true);
  const [_sortPref, _setSortPref] = useState<string>("output");
  const [dropdown, openDropdown] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  const transitions = useTransition(isSettingsOpen, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    config: { duration: 200 },
    onReset: () => setIsSettingsOpen(false),
  });

  const handleChange = (item) => {
    _setSortPref(item.id);
    dispatch(setSortPref(item.id));
    setLabel(item.label);
    openDropdown(false);
  };

  // Option Labels
  const LABEL_STATE = {
    OUTPUT: "High Return",
    TIME: "Fastest",
    GAS: "Low Gas Fee",
  };

  // Option Values
  const sortOptions = [
    { id: "output", label: LABEL_STATE.OUTPUT },
    { id: "time", label: LABEL_STATE.TIME },
    { id: "gas", label: LABEL_STATE.GAS },
  ];

  useEffect(() => {
    setLabel(LABEL_STATE.OUTPUT);
  }, []);

  const dropdownRef = useClickOutside(() => openDropdown(false));

  return (
    <>
      {transitions(
        (style, item) =>
          item && (
            <Modal
              title="Settings"
              closeModal={() => setIsSettingsOpen(false)}
              style={style}
            >
              <div className="skt-w px-3 pt-2">
                {/* Sort options */}
                <div className="skt-w flex items-center relative z-30">
                  <p className="skt-w text-sm text-widget-primary font-medium">
                    Preferred Route
                  </p>
                  <div
                    className="skt-w relative border border-widget-secondary-text border-opacity-40 flex w-auto ml-2"
                    style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
                    ref={dropdownRef}
                  >
                    <Option onClick={() => openDropdown(!dropdown)} active>
                      {label}{" "}
                      <ChevronDown
                        className={`skt-w w-4 h-4 text-widget-secondary transition-all ${
                          dropdown ? "rotate-180" : ""
                        }`}
                      />
                    </Option>
                    {dropdown && (
                      <div
                        className="skt-w absolute top-10 left-0 w-full border border-widget-secondary-text border-opacity-40 overflow-hidden bg-widget-primary"
                        style={{
                          borderRadius: `calc(0.5rem * ${borderRadius})`,
                        }}
                      >
                        {sortOptions.map((x) => {
                          return (
                            <Option onClick={() => handleChange(x)} key={x.id}>
                              {x.label}
                            </Option>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap Slippage */}
                <SwapSlippage />
              </div>
            </Modal>
          )
      )}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="skt-w skt-w-button skt-w-input flex"
      >
        <SettingsIcon className="skt-w w-5.5 h-5.5 text-widget-secondary hover:text-widget-primary hover:rotate-45 duration-200 ease-linear" />
      </button>
    </>
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
      className={`skt-w skt-w-input skt-w-button w-32 px-2 py-2 text-widget-secondary text-sm flex items-center justify-between gap-2 ${
        active ? "" : "hover:bg-widget-secondary"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
