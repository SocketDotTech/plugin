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
      className={`skt-w skt-w-input skt-w-button skt-w-text-widget-primary skt-w-text-opacity-70 skt-w-text-xs skt-w-text-right skt-w-flex skt-w-items-center skt-w-transition-all ${
        onClick ? "hover:skt-w-underline" : ""
      }`}
      onClick={onClick}
    >
      <span className="skt-w-mr-1">Bal: {token && _formattedBalance}</span>
      {isLoading && <Spinner size={3} />}
    </button>
  );
};
