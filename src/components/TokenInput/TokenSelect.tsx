import { useAllTokenBalances } from "../../hooks/apis";
import { Currency } from "../../types";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Modal } from "../common/Modal";
import { useTransition } from "@react-spring/web";
import { SearchBar } from "./SearchBar";

interface Props {
  activeToken: Currency;
  updateToken: (token: Currency) => void;
  tokens: Currency[];
  tokenToDisable?: Currency;
}

export const TokenSelect = (props: Props) => {
  const { activeToken, updateToken, tokens, tokenToDisable } = props;
  const [openTokenList, setOpenTokenList] = useState<boolean>(false);
  const [filteredTokens, setFilteredTokens] = useState(null);
  const [displayTokens, setDisplayTokens] = useState(null);
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  const transitions = useTransition(openTokenList, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    config: { duration: 200 },
    onReset: () => setOpenTokenList(false),
  });

  // Hook that gives you all the balances for a user on all chains.
  const { data: tokensWithBalances } = useAllTokenBalances();

  function selectToken(token: Currency) {
    updateToken(token);
    setOpenTokenList(false);
  }

  function showBalance(token: Currency) {
    const _token = tokensWithBalances?.filter(
      (x) =>
        x.address.toLowerCase() === token.address.toLowerCase() &&
        x.chainId === token.chainId
    );
    if (_token?.[0]) {
      return _token[0].amount.toFixed(5);
    } else return "";
  }

  // compare tokens with tokensWithBalances and return the tokens with balance
  function getTokenWithBalance(token: Currency) {
    const filteredTokens = tokensWithBalances?.filter(
      (x) =>
        x.address.toLowerCase() === token.address.toLowerCase() &&
        x.chainId === token.chainId
    );
    return filteredTokens?.length > 0;
  }

  useEffect(() => {
    // Filtering out tokens with balance
    const tokensWithBalance = tokens?.filter((token: Currency) =>
      getTokenWithBalance(token)
    );

    // Sorting the tokens as per amount
    const sortedTokens = tokensWithBalance?.sort((a, b) => {
      // corresponding tokens with balances
      const _tokenA = tokensWithBalances.filter(
        (x) => x.address === a.address
      )[0];
      const _tokenB = tokensWithBalances.filter(
        (x) => x.address === b.address
      )[0];

      return _tokenB?.amount - _tokenA?.amount;
    });

    // Filtering out tokens without balance
    const restTokens = tokens?.filter((x) => !sortedTokens?.includes(x));

    // Merging both the lists
    const _filteredTokens = sortedTokens &&
      restTokens && [...sortedTokens, ...restTokens];

    setFilteredTokens(_filteredTokens);
    setDisplayTokens(_filteredTokens);
  }, [tokens, tokensWithBalances]);

  const [searchInput, setSearchInput] = useState<string>("");

  function handleSearchInput(searchKeyword) {
    setSearchInput(searchKeyword);
  }

  useEffect(() => {
    const _filteredTokens = filteredTokens?.filter(
      (x: Currency) =>
        x?.symbol?.toLowerCase()?.includes(searchInput.toLowerCase()) ||
        x?.address?.toLowerCase() === searchInput.toLowerCase()
    );
    setDisplayTokens(_filteredTokens);
  }, [searchInput]);

  return (
    <div>
      {activeToken && (
        <button
          onClick={() => setOpenTokenList(!openTokenList)}
          className={`skt-w skt-w-input skt-w-button flex items-center flex-1 bg-widget-interactive flex-shrink-0 flex-nowrap w-auto overflow-hidden p-1 gap-1 text-widget-on-interactive`}
          style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
        >
          <img
            src={activeToken?.logoURI}
            className="skt-w h-6 w-6 rounded-full mr-1 border"
          />
          <div className="skt-w flex items-center gap-0.5">
            <span>{activeToken?.symbol}</span>
            <ChevronDown className="skt-w w-4 h-4" />
          </div>
        </button>
      )}

      {transitions(
        (style, item) =>
          item && (
            <Modal
              title="Select Token"
              closeModal={() => {
                setOpenTokenList(false);
                handleSearchInput("");
              }}
              style={style}
            >
              <div className="skt-w px-1.5 pt-2 mb-2">
                <SearchBar
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleInput={(e) => handleSearchInput(e)}
                />
              </div>
              <div className="skt-w h-full overflow-y-auto p-1.5">
                {displayTokens?.map((token: Currency) => {
                  return (
                    <button
                      className="skt-w skt-w-input skt-w-button flex hover:bg-widget-secondary items-center p-2 w-full justify-between disabled:opacity-60 disabled:pointer-events-none"
                      onClick={() => selectToken(token)}
                      key={token?.address}
                      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
                      disabled={tokenToDisable?.address === token?.address}
                    >
                      <div className="skt-w flex items-center">
                        <img
                          src={token?.logoURI}
                          className="skt-w w-6 h-6 rounded-full"
                        />
                        <div className="skt-w flex flex-col items-start ml-2 text-widget-secondary">
                          <span className="skt-w text-sm">{token?.symbol}</span>
                          <span className="skt-w text-xs -mt-0.5">
                            {token?.name}
                          </span>
                        </div>
                      </div>
                      <span className="skt-w text-widget-secondary text-xs text-right font-medium">
                        {showBalance(token)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Modal>
          )
      )}
    </div>
  );
};
