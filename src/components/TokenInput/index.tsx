import { Currency } from "../../types";
import { TokenSelect } from "./TokenSelect";
import { TokenChipPlaceholder } from "../common/TokenChipPlaceholder";
import { RefuelAmount } from "./RefuelAmount";

interface TokenInputProps {
  amount: string;
  onChangeInput?: (input: string) => void;
  updateToken: (token: Currency) => void;
  source?: boolean;
  activeToken?: Currency;
  tokens: Currency[];
  noTokens: boolean;
  tokenToDisable?: Currency;
}

export const TokenInput = (props: TokenInputProps) => {
  const {
    amount,
    onChangeInput,
    updateToken,
    source = false,
    activeToken,
    tokens,
    noTokens = false,
    tokenToDisable,
  } = props;
  return (
    <div className="skt-w skt-w-flex skt-w-items-center skt-w-justify-between skt-w-mt-2.5 skt-w-pb-[1.125rem]">
      <div className="skt-w skt-w-flex skt-w-flex-1">
        <div className="stk-w skt-w-flex skt-w-flex-col skt-w-relative">
          <input
            className={`skt-w skt-w-input skt-w-text-widget-primary skt-w-text-3xl focus:skt-w-outline-none skt-w-w-full skt-w-h-full skt-w-overflow-ellipsis skt-w-bg-transparent`}
            value={amount}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder="0.0"
            type={source ? "number" : "string"}
            onWheel={(e) => (document.activeElement as HTMLElement).blur()}
            inputMode="decimal"
            readOnly={!source}
          />
          <RefuelAmount src={source} />
        </div>
      </div>
      {noTokens ? (
        <TokenChipPlaceholder>No Tokens</TokenChipPlaceholder>
      ) : (
        <TokenSelect
          updateToken={updateToken}
          activeToken={activeToken}
          tokens={tokens}
          tokenToDisable={tokenToDisable}
        />
      )}
    </div>
  );
};
