import { Currency } from "../utils/types";
import { TokenSelect } from "./TokenSelect";

interface TokenInputProps {
  amount: string;
  onChangeInput?: (input: string) => void;
  updateToken: (token: Currency) => void;
  source?: boolean;
  activeToken?: Currency
}

export const TokenInput = (props: TokenInputProps) => {
  const { amount, onChangeInput, updateToken, source = false, activeToken} = props;
  return (
    <div className="flex items-center justify-between">
      <input
        className="h-10 px-2 active:outline-none rounded-md"
        value={amount}
        onChange={(e) => onChangeInput(e.target.value)}
        placeholder="0.0"
        type="number"
        onWheel={(e) => e.target.blur()}
        inputMode="decimal"
        readOnly={!source}
      />
      <TokenSelect source={source} updateToken={updateToken} activeToken={activeToken} />
    </div>
  );
};
