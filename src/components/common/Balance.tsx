import { formatCurrencyAmount } from "../../utils";
import { Spinner } from "./Spinner";
import { TokenBalanceReponseDTO } from "@socket.tech/socket-v2-sdk";

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
      className={`skt-w skt-w-input skt-w-button text-widget-primary text-opacity-70 text-xs text-right flex items-center transition-all ${
        onClick ? "hover:underline" : ""
      }`}
      onClick={onClick}
    >
      <span className="mr-1">Bal: {token && _formattedBalance}</span>
      {isLoading && <Spinner size={3} />}
    </button>
  );
};
