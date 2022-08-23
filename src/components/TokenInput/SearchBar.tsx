import React, { SetStateAction, useContext } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Search, XCircle } from "react-feather";

interface SearchBarProps {
  handleInput: (e) => void;
  searchInput: string;
  setSearchInput: React.Dispatch<SetStateAction<string>>;
}

export const SearchBar = React.forwardRef((props: SearchBarProps, ref: any) => {
  const { handleInput, searchInput, setSearchInput } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div
      className="skt-w flex items-center px-2 w-full bg-widget-primary border border-widget-secondary text-widget-primary text-sm overflow-hidden focus-within:border-widget-secondary-text relative"
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <Search className="skt-w w-5 h-5 text-widget-secondary mr-2" />
      <input
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Search Name or Address"
        className="stk-w skt-w-input w-full border-none py-2 bg-transparent"
        ref={ref}
        role="search"
        value={searchInput}
        spellCheck={false}
      />

      {!!searchInput && (
        <XCircle
          className="skt-w w-5 h-5 text-widget-secondary hover:text-secondary absolute right-3 top-.25 cursor-pointer"
          onClick={() => {
            setSearchInput("");
            handleInput("");
          }}
        />
      )}
    </div>
  );
});
