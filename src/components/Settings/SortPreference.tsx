import { useState, useContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "react-feather";

import { CustomizeContext } from "../../providers/CustomizeProvider";
import useClickOutside from "../../hooks/useClickOutside";
import { setSortPref } from "../../state/quotesSlice";
import { SubTitle } from "./SubTitle";

export const SortPreference = () => {
  const dispatch = useDispatch();
  const sortPref = useSelector((state: any) => state.quotes.sortPref);
  const [dropdown, openDropdown] = useState<boolean>(false);

  const dropdownRef = useClickOutside(() => openDropdown(false));

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  // Option Labels
  const LABEL_STATE = {
    OUTPUT: "High Return",
    TIME: "Fastest",
  };

  // Option Values
  const sortOptions = [
    { id: "output", label: LABEL_STATE.OUTPUT },
    { id: "time", label: LABEL_STATE.TIME },
  ];

  const handleChange = (item) => {
    dispatch(setSortPref(item.id));
    openDropdown(false);
  };

  function getSortOption(id) {
    return sortOptions.filter((x) => x.id === id)?.[0];
  }

  return (
    <div className="skt-w skt-w-flex skt-w-items-center skt-w-relative skt-w-z-30 skt-w-justify-between">
      <SubTitle>Preferred Route</SubTitle>
      <div
        className="skt-w skt-w-relative skt-w-border skt-w-border-widget-secondary-text skt-w-border-opacity-40 skt-w-flex skt-w-w-auto skt-w-ml-2"
        style={{ borderRadius: `calc(0.375rem * ${borderRadius})` }}
        ref={dropdownRef}
      >
        <Option onClick={() => openDropdown(!dropdown)} active>
          {getSortOption(sortPref)?.label}{" "}
          <ChevronDown
            className={`skt-w skt-w-w-4 skt-w-h-4 skt-w-text-widget-secondary skt-w-transition-all ${
              dropdown ? "rotate-180" : ""
            }`}
          />
        </Option>
        {dropdown && (
          <div
            className="skt-w skt-w-absolute skt-w-top-10 skt-w-left-0 skt-w-w-full skt-w-border skt-w-border-widget-secondary-text skt-w-border-opacity-40 skt-w-overflow-hidden skt-w-bg-widget-primary"
            style={{
              borderRadius: `calc(0.375rem * ${borderRadius})`,
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
      className={`skt-w skt-w-input skt-w-button skt-w-w-32 skt-w-px-2 skt-w-py-2 skt-w-text-widget-secondary skt-w-text-sm skt-w-flex skt-w-items-center skt-w-justify-between ${
        active ? "" : "hover:skt-w-bg-widget-secondary"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
