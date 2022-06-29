import { Currency } from "@/utils/types";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
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
          className="flex items-center"
        >
          <img
            src={activeToken?.logoURI}
            className="h-6 w-6 rounded-full mr-1"
          />
          <span>{activeToken?.symbol}</span>
        </button>
      ) : (
        <button
          className="bg-red-400 px-2 py-1 rounded"
          onClick={() => setOpenTokenList(!openTokenList)}
        >
          Select Token
        </button>
      )}

      {openTokenList && (
        <Modal
          title="token selector"
          closeModal={() => setOpenTokenList(false)}
        >
          <div className="h-full overflow-y-auto">
            {tokens?.map((token: Currency) => {
              return (
                <button
                  className="flex hover:bg-gray-300 items-center rounded p-1 w-full"
                  onClick={() => selectToken(token)}
                  key={token?.address}
                >
                  <img src={token?.logoURI} className="w-5 h-5 rounded" />
                  <div className="flex flex-col items-start ml-2">
                    <span>{token?.symbol}</span>
                    <span>{token?.name}</span>
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
