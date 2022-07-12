import { Currency } from "../../utils/types";
import { TokenSelect } from "./TokenSelect";

interface TokenInputProps {
  amount: string;
  onChangeInput?: (input: string) => void;
  updateToken: (token: Currency) => void;
  source?: boolean;
  activeToken?: Currency;
  tokens: Currency[];
}

export const TokenInput = (props: TokenInputProps) => {
  const {
    amount,
    onChangeInput,
    updateToken,
    source = false,
    activeToken,
    tokens,
  } = props;
  return (
    <div className="flex items-center justify-between mt-2.5 overflow-hidden">
      <div className="flex flex-1">
        <input
          className={`text-widget-primary text-3xl focus:outline-none w-full h-full overflow-ellipsis bg-transparent`}
          value={amount}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder="0.0"
          type={source ? "number" : "string"}
          onWheel={(e) => (document.activeElement as HTMLElement).blur()}
          inputMode="decimal"
          readOnly={!source}
        />
      </div>
      <TokenSelect
        updateToken={updateToken}
        activeToken={activeToken}
        tokens={tokens}
      />
    </div>
  );
};
