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
    3
  );

  // OP Rebates data
  const opRebateData = bestRoute?.route?.extraData?.opRebateData;
  const opToken = opRebateData?.asset;
  const opRebateAmountFormatted =
    opRebateData && formatCurrencyAmount(opRebateData.amount, opToken.decimals);

  if (!refuel && !opRebateData) return null;

  return (
    <>
      <span className="skt-w skt-w-text-widget-accent skt-w-text-xs skt-w-absolute skt-w-left-0 skt-w--bottom-5 skt-w-w-full skt-w-text-left">
        {/* Refuel amount */}
        {refuel && (
          <span className="skt-w-mr-2">
            + {amount}{" "}
            {src ? refuel?.fromAsset?.symbol : refuel?.toAsset?.symbol}
          </span>
        )}

        {/* OP Rebate Amount */}
        {!src && opRebateData && opRebateData?.amount != "0" && (
          <span className="skt-w-text-widget-secondary skt-w-inline-flex skt-w-items-center">
            {" "}
            + {truncateDecimalValue(opRebateAmountFormatted, 3)} OP{" "}
            <Tooltip tooltipContent="Estimated rewards for bridging to Optimism.">
              <span className="skt-w-w-3 skt-w-h-3">
                <Info className="skt-w-w-3 skt-w-h-3 skt-w-rounded-full skt-w-ml-1" />{" "}
              </span>
            </Tooltip>
          </span>
        )}
      </span>
    </>
  );
};
