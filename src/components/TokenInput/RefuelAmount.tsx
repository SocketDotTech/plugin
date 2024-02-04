import { Info } from "react-feather";
import { formatCurrencyAmount, truncateDecimalValue } from "../../utils/";
import { useSelector } from "react-redux";
import { Tooltip } from "../common/Tooltip";

export const RefuelAmount = ({ src = false }: { src?: boolean }) => {
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const refuel = bestRoute?.refuel;
  const amount = formatCurrencyAmount(
    src ? refuel?.fromAmount : refuel?.toAmount,
    src ? refuel?.fromAsset?.decimals : refuel?.toAsset?.decimals,
    4
  );

  // OP Rebates data
  const opRebateData = bestRoute?.route?.extraData?.rewards?.[0];
  const opToken = opRebateData?.asset;
  const opRebateAmountFormatted =
    opRebateData && formatCurrencyAmount(opRebateData.amount, opToken.decimals);

  if (!refuel && !opRebateData) return null;
  return (
    <div className="skt-w-flex skt-w-items-center">
      {!!refuel && (
        <Chip>
          {/* Refuel amount */}
          {refuel && (
            <span className="skt-w-mr2">
              + {amount}{" "}
              {src ? refuel?.fromAsset?.symbol : refuel?.toAsset?.symbol}
            </span>
          )}
        </Chip>
      )}

      {/* OP Rebate Amount */}
      {!src && opRebateData && opRebateData?.amount != "0" && (
        <Chip variant="secondary">
          + {truncateDecimalValue(opRebateAmountFormatted, 3)} ARB{" "}
          <Tooltip tooltipContent="Estimated rewards for bridging to Arbitrum.">
            <span className="skt-w-w-3 skt-w-h-3 skt-w-ml-1">
              <Info className="skt-w-w-3 skt-w-h-3 skt-w-rounded-full" />{" "}
            </span>
          </Tooltip>
        </Chip>
      )}
    </div>
  );
};

const Chip = ({
  children,
  variant = "primary",
}: {
  children: any;
  variant?: "primary" | "secondary";
}) => {
  return (
    <div
      className={`skt-w skt-w-text-xs skt-w-w-fit skt-w-text-left skt-w-py-0.5 skt-w-px-1.5 skt-w-rounded-full skt-w-font-medium skt-w-mr-2 skt-w-flex skt-w-items-center ${
        variant === "primary"
          ? "skt-w-bg-widget-accent/90 skt-w-text-widget-onAccent"
          : "skt-w-bg-widget-secondary skt-w-text-widget-primary"
      }`}
    >
      {children}
    </div>
  );
};
