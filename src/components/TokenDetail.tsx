import { formatCurrencyAmount } from "../utils";
import { Currency } from "../utils/types";

interface TokenAssetProps {
  token: Currency;
  rtl?: boolean;
  amount: string;
}
export const TokenDetail = (props: TokenAssetProps) => {
  const { token, rtl = false, amount } = props;
  const formattedAmount = formatCurrencyAmount(amount, token?.decimals, 4);
  return (
    <div>
      <img src={token?.logoURI} className="w-5 h-5 rounded-full"/>
      <span>{formattedAmount} <span>{token?.symbol}</span></span>
    </div>
  );
};
