import {
  ExplorerDataType,
  formatCurrencyAmount,
  getExplorerLink,
} from "../../utils/";
import useMappedChainData from "../../hooks/useMappedChainData";
import { ArrowRight, CheckCircle } from "react-feather";
import { ReactNode, useContext, useEffect, useState } from "react";
import { CustomizeContext } from "../CustomizeProvider";
import { Spinner } from "../common/Spinner";

export const TxStepDetails = ({
  activeRoute,
  currentTxIndex,
  completed,
  inProgress,
}: {
  activeRoute: any;
  currentTxIndex?: number;
  completed?: boolean;
  inProgress?: boolean;
}) => {
  const mappedChainData = useMappedChainData();
  const [txData, setTxData] = useState(null);

  useEffect(() => {
    setTxData(activeRoute?.transactionData);
  }, [activeRoute]);

  return (
    <div className="flex flex-col gap-3 text-sm">
      {activeRoute?.userTxs?.map((tx, txIndex) => {
        const txComplete =
          tx?.userTxStatus === "completed" ||
          txIndex < currentTxIndex ||
          completed;
        const currentTx = currentTxIndex === tx?.userTxIndex;
        const url = txData?.[txIndex]?.txHash
          ? getExplorerLink(
              mappedChainData?.[tx?.chainId]?.explorers[0],
              txData?.[txIndex]?.txHash,
              ExplorerDataType.TRANSACTION
            )
          : null;

        // function to return token details - amount, chain id, symbol and protocol name.
        const getTxDetail = (stepId: number, toAsset: boolean) => {
          const step = stepId === null ? tx : tx?.steps?.[stepId];

          return {
            amount: formatCurrencyAmount(
              step?.[toAsset ? "toAmount" : "fromAmount"],
              step?.[toAsset ? "toAsset" : "fromAsset"]?.decimals
            ),
            chainId: step?.[toAsset ? "toAsset" : "fromAsset"]?.chainId,
            symbol: step?.[toAsset ? "toAsset" : "fromAsset"]?.symbol,
            protocolName: step?.protocol?.displayName,
          };
        };

        if (tx?.userTxType === "fund-movr") {
          const isSwap = tx?.steps?.length > 1;
          const swapSrc = getTxDetail(0, false);
          const swapDest = getTxDetail(0, true);
          const bridgeSrc = getTxDetail(isSwap ? 1 : 0, false);
          const bridgeDest = getTxDetail(isSwap ? 1 : 0, true);

          return (
            <div
              className="flex flex-col gap-3 text-sm"
              key={`${activeRoute?.activeRouteId}-fund-movr-swap`}
            >
              {isSwap && (
                <TxStep
                  label="Swap"
                  complete={txComplete}
                  currentTx={currentTx}
                  url={url}
                  inProgress={inProgress}
                >
                  {Number(swapSrc?.amount).toFixed(3)} {swapSrc?.symbol} for{" "}
                  {Number(swapDest?.amount).toFixed(3)} {swapDest?.symbol} via{" "}
                  {swapDest?.protocolName} on{" "}
                  {mappedChainData?.[swapSrc.chainId]?.name}
                </TxStep>
              )}
              <TxStep
                label="Bridge"
                complete={txComplete}
                currentTx={currentTx}
                url={url}
                inProgress={inProgress}
              >
                {Number(bridgeSrc?.amount).toFixed(3)} {bridgeSrc?.symbol} on{" "}
                {mappedChainData?.[bridgeSrc?.chainId]?.name} to{" "}
                {Number(bridgeDest?.amount).toFixed(3)} {bridgeDest?.symbol} on{" "}
                {mappedChainData?.[bridgeDest?.chainId]?.name} via{" "}
                {bridgeSrc?.protocolName} bridge
              </TxStep>
            </div>
          );
        } else if (tx?.userTxType === "dex-swap") {
          const swapSrc = getTxDetail(null, false);
          const swapDest = getTxDetail(null, true);

          return (
            <TxStep
              label="Swap"
              key={`${activeRoute?.activeRouteId}-dex-swap-${txIndex}`}
              complete={txComplete}
              currentTx={currentTx}
              url={url}
              inProgress={inProgress}
            >
              {Number(swapSrc?.amount).toFixed(3)} {swapSrc?.symbol} for{" "}
              {Number(swapDest?.amount).toFixed(3)} {swapDest?.symbol} via{" "}
              {swapDest?.protocolName} on{" "}
              {mappedChainData?.[swapDest?.chainId]?.name}
            </TxStep>
          );
        } else if (tx?.userTxType === "claim") {
          return (
            <TxStep
              label="Claim"
              key={`${activeRoute?.activeRouteId}-claim`}
              complete={txComplete}
              currentTx={currentTx}
              url={url}
              inProgress={inProgress}
            >
              Claim {tx?.toAsset?.symbol} on{" "}
              {mappedChainData?.[tx?.chainId].name}
            </TxStep>
          );
        }
      })}
    </div>
  );
};

const TxStep = ({
  label,
  children,
  complete = false,
  currentTx = false,
  url = null,
  inProgress = false,
}: {
  label: string;
  children: ReactNode;
  complete?: boolean;
  currentTx?: boolean;
  url?: string | null;
  inProgress?: boolean;
}) => {
  const active = complete || currentTx;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div className="flex gap-3.5">
      <div
        className={`h-6 w-6 flex items-center justify-center shrink-0 mt-[3px] ${
          active ? "bg-widget-secondary" : "bg-transparent"
        }`}
        style={{ borderRadius: `calc(0.25rem * ${borderRadius})` }}
      >
        {currentTx ? (
          inProgress ? (
            <Spinner size="4" />
          ) : (
            <ArrowRight className={`w-[18px] h-[18px] text-widget-theme`} />
          )
        ) : (
          <CheckCircle
            className={`w-[18px] h-[18px] ${
              complete ? "text-widget-theme" : "text-widget-outline"
            }`}
          />
        )}
      </div>
      <div
        className={`flex flex-col text-xs text-widget-secondary gap-0.5 ${
          !active ? "opacity-60" : ""
        }`}
      >
        <span className={`${active ? "font-medium" : ""}`}>
          {url ? (
            <a
              href={url}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ) : (
            label
          )}
        </span>
        <span>{children}</span>
      </div>
    </div>
  );
};
