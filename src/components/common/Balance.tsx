import { formatCurrencyAmount } from "../../utils";
import { Spinner } from "./Spinner";
import { TokenBalanceReponseDTO } from "socket-v2-sdk";

export const Balance = ({
  token,
  isLoading,
  onClick,
}: {
  token: TokenBalanceReponseDTO["result"];
  isLoading: boolean;
  onClick?: () => void;
}) => {
  const _formattedBalance = formatCurrencyAmount(
    token?.balance,
    token?.decimals,
    5
  );
  return (
    <button
      disabled={!onClick}
      className={`text-widget-secondary text-sm text-right flex items-center gap-1 transition-all ${
        onClick ? "hover:underline" : ""
      }`}
      onClick={onClick}
    >
      <span>Bal: {token && _formattedBalance}</span>
      {isLoading && <Spinner size={3} />}
    </button>
  );
};
