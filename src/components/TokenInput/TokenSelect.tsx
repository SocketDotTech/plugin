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
          className={`skt-w skt-w-input skt-w-button skt-w-flex skt-w-items-center skt-w-flex-1 skt-w-bg-widget-interactive skt-w-flex-shrink-0 skt-w-flex-nowrap skt-w-w-auto skt-w-overflow-hidden skt-w-p-1 skt-w-text-widget-on-interactive`}
          style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
        >
          <img
            src={activeToken?.logoURI}
            className="skt-w skt-w-h-6 skt-w-w-6 skt-w-rounded-full skt-w-mr-1.5 skt-w-border"
          />
          <div className="skt-w skt-w-flex skt-w-items-center">
            <span className="skt-w-mr-0.5">{activeToken?.symbol}</span>
            <ChevronDown className="skt-w skt-w-w-4 skt-w-h-4" />
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
              <div className="skt-w skt-w-px-1.5 skt-w-pt-2 skt-w-mb-2">
                <SearchBar
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  handleInput={(e) => handleSearchInput(e)}
                />
              </div>
              <div className="skt-w skt-w-h-full skt-w-overflow-y-auto skt-w-p-1.5">
                {displayTokens?.map((token: Currency) => {
                  return (
                    <button
                      className="skt-w skt-w-input skt-w-button skt-w-flex hover:skt-w-bg-widget-secondary skt-w-items-center skt-w-p-2 skt-w-w-full skt-w-justify-between disabled:skt-w-opacity-60 disabled:skt-w-pointer-events-none"
                      onClick={() => selectToken(token)}
                      key={token?.address}
                      style={{ borderRadius: `calc(0.5rem * ${borderRadius})` }}
                      disabled={tokenToDisable?.address === token?.address}
                    >
                      <div className="skt-w skt-w-flex skt-w-items-center">
                        <img
                          src={token?.logoURI}
                          className="skt-w skt-w-w-6 skt-w-h-6 skt-w-rounded-full"
                        />
                        <div className="skt-w skt-w-flex skt-w-flex-col skt-w-items-start skt-w-ml-2 skt-w-text-widget-secondary">
                          <span className="skt-w skt-w-text-sm">
                            {token?.symbol}
                          </span>
                          <span className="skt-w skt-w-text-xs skt-w--mt-0.5">
                            {token?.name}
                          </span>
                        </div>
                      </div>
                      <span className="skt-w skt-w-text-widget-secondary skt-w-text-xs skt-w-text-right skt-w-font-medium">
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
