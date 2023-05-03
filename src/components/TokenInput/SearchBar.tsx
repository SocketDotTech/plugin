import { SetStateAction, useContext } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Search, XCircle } from "react-feather";

interface SearchBarProps {
  handleInput: (e) => void;
  searchInput: string;
  setSearchInput: React.Dispatch<SetStateAction<string>>;
}

export const SearchBar = (props: SearchBarProps) => {
  const { handleInput, searchInput, setSearchInput } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div
      className="skt-w skt-w-flex skt-w-items-center skt-w-px-2 skt-w-w-full skt-w-bg-widget-primary skt-w-border skt-w-border-widget-secondary-text/30 skt-w-text-widget-primary skt-w-text-sm skt-w-overflow-hidden focus-within:skt-w-border-widget-secondary-text skt-w-relative"
      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
    >
      <Search className="skt-w skt-w-w-5 skt-w-h-5 skt-w-text-widget-secondary skt-w-mr-2" />
      <input
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Search Name or Address"
        className="stk-w skt-w-input skt-w-w-full skt-w-border-none skt-w-py-2 skt-w-pr-7 skt-w-bg-transparent skt-w-overflow-x-hidden skt-w-overflow-ellipsis"
        role="search"
        value={searchInput}
        spellCheck={false}
      />

      {!!searchInput && (
        <XCircle
          className="skt-w skt-w-bg-widget-primary skt-w-w-5 skt-w-h-5 skt-w-text-widget-secondary hover:skt-w-text-secondary skt-w-absolute skt-w-right-3 skt-w-top-.25 skt-w-cursor-pointer"
          onClick={() => {
            setSearchInput("");
            handleInput("");
          }}
        />
      )}
    </div>
  );
};
