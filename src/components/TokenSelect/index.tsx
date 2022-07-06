import { Currency } from "@/utils/types";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import { useSelector } from "react-redux";
import { CustomizeContext } from "../CustomizeProvider";
import { Modal } from "../Modal";

interface Props {
  source: boolean;
  activeToken: Currency;
  updateToken: (token: Currency) => void;
}

export const TokenSelect = (props: Props) => {
  const { source = false, activeToken, updateToken } = props;
  const [openTokenList, setOpenTokenList] = useState<boolean>(false);
  const [tokens, setTokens] = useState<any>(null);
  const allTokens = useSelector((state: any) => state.tokens.tokens);
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  useEffect(() => {
    setTokens(source ? allTokens?.from : allTokens?.to);
  }, [allTokens]);

  function selectToken(token: Currency) {
    updateToken(token);
    setOpenTokenList(false);
  }
  return (
    <div>
      {activeToken ? (
        <button
          onClick={() => setOpenTokenList(!openTokenList)}
          className="flex items-center flex-1 bg-widget-secondary flex-shrink-0 flex-nowrap w-auto overflow-hidden p-1 gap-1"
          style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
        >
          <img
            src={activeToken?.logoURI}
            className="h-6 w-6 rounded-full mr-1"
          />
          <div className="flex items-center gap-0.5">
            <span className="text-widget-primary">{activeToken?.symbol}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>
      ) : (
        <button
          className="flex items-center flex-1 bg-widget-secondary flex-shrink-0 flex-nowrap w-auto overflow-hidden py-1 px-3 gap-1"
          onClick={() => setOpenTokenList(!openTokenList)}
          style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
        >
          Select Token
        </button>
      )}

      {openTokenList && (
        <Modal
          title="Token selector"
          closeModal={() => setOpenTokenList(false)}
        >
          <div className="h-full overflow-y-auto p-1.5">
            {tokens?.map((token: Currency) => {
              return (
                <button
                  className="flex hover:bg-widget-secondary items-center p-2 w-full"
                  onClick={() => selectToken(token)}
                  key={token?.address}
                  style={{borderRadius: `calc(0.5rem * ${borderRadius})`}}
                >
                  <img src={token?.logoURI} className="w-6 h-6 rounded-full" />
                  <div className="flex flex-col items-start ml-2 text-widget-secondary">
                    <span className="text-sm">{token?.symbol}</span>
                    <span className="text-xs -mt-0.5">{token?.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};
