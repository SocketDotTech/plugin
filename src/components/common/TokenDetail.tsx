import { Token } from "socket-v2-sdk";
import useMappedChainData from "../../hooks/useMappedChainData";
import { formatCurrencyAmount } from "../../utils";
import { Currency } from "../../utils/types";

interface TokenAssetProps {
  token: Currency | Token;
  rtl?: boolean;
  amount: string;
  small?: boolean;
}
export const TokenDetail = (props: TokenAssetProps) => {
  const { token, rtl = false, amount, small = false } = props;
  const mappedChaindata = useMappedChainData();
  const chain = mappedChaindata?.[token.chainId];
  const formattedAmount = formatCurrencyAmount(amount, token?.decimals, 4);
  return (
    <div
      className={`flex items-center gap-2 flex-1 max-w-[140px] overflow-hidden ${
        rtl ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className={`relative flex-shrink-0 ${small ? "w-5 h-5" : "h-6 w-6"}`}>
        <img
          src={token?.logoURI}
          className="w-full h-full rounded-full absolute top-0 left-0"
        />
        <img
          src={chain?.icon}
          className="h-3 w-3 rounded-sm absolute -bottom-0.5 -right-0.5"
        />
      </div>

      <div className={`flex flex-col flex-auto overflow-hidden ${rtl ? "items-end" : "items-start"}`}>
        <span
          className={`text-widget-secondary w-full font-medium overflow-hidden whitespace-nowrap text-ellipsis ${rtl ? "text-right" : "text-left"} ${
            small ? "text-xs" : "text-sm"
          }`}
        >
          {formattedAmount} <span>{token?.symbol}</span>
        </span>
        <span className="text-xs text-widget-secondary">on {chain?.name}</span>
      </div>
    </div>
  );
};
