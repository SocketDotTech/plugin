import {
  ExplorerDataType,
  formatCurrencyAmount,
  getExplorerLink,
} from "../../utils/";
import useMappedChainData from "../../hooks/useMappedChainData";
import { ArrowRight, CheckCircle, ExternalLink } from "react-feather";
import { ReactNode, useContext } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Spinner } from "../common/Spinner";

// Component that shows the steps involved in the route in detail.
// Each Step is shown individually.
export const TxStepDetails = ({
  activeRoute,
  currentTxIndex,
  completed,
  inProgress,
  forReview,
  txData,
  refuel,
}: {
  activeRoute: any;
  currentTxIndex?: number;
  completed?: boolean;
  inProgress?: boolean;
  forReview?: boolean;
  txData?: any;
  refuel?: any;
}) => {
  const mappedChainData = useMappedChainData();

  return (
    <div className="flex flex-col gap-3 text-sm">
      {activeRoute?.userTxs?.map((tx, txIndex) => {
        const txComplete =
          tx?.userTxStatus === "completed" ||
          txIndex < currentTxIndex ||
          completed;
        const currentTx = currentTxIndex === tx?.userTxIndex;
        const _txHash = txData?.[txIndex]?.txHash || txData?.[txIndex]?.hash;
        const url = _txHash
          ? getExplorerLink(
              mappedChainData?.[tx?.chainId]?.explorers[0],
              _txHash,
              ExplorerDataType.TRANSACTION
            )
          : null;

        // function to return token details -
        // @returns - amount, chain id, symbol and protocol name.
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

          const refuelSrc = {
            amount: formatCurrencyAmount(
              refuel?.fromAmount,
              refuel?.fromAsset?.decimals
            ),
            chainId: refuel?.fromChainId,
            symbol: refuel?.fromAsset?.symbol,
          };
          const refuelDest = {
            amount: formatCurrencyAmount(
              refuel?.toAmount,
              refuel?.toAsset?.decimals
            ),
            chainId: refuel?.toChainId,
            symbol: refuel?.toAsset?.symbol,
          };

          return (
            <div
              className="flex flex-col gap-3 text-sm"
              key={`${activeRoute?.activeRouteId}-fund-movr-swap`}
            >
              {isSwap ? (
                <TxStep
                  label="Swap &amp; Bridge"
                  complete={txComplete}
                  currentTx={currentTx}
                  url={url}
                  inProgress={inProgress}
                  forReview={forReview}
                >
                  <div className="flex flex-col gap-2">
                    <span>
                      {Number(swapSrc?.amount).toFixed(3)} {swapSrc?.symbol} for{" "}
                      {Number(swapDest?.amount).toFixed(3)} {swapDest?.symbol}{" "}
                      via {swapDest?.protocolName} on{" "}
                      {mappedChainData?.[swapSrc.chainId]?.name}
                    </span>
                    <span>
                      {Number(bridgeSrc?.amount).toFixed(3)} {bridgeSrc?.symbol}{" "}
                      on {mappedChainData?.[bridgeSrc?.chainId]?.name} to{" "}
                      {Number(bridgeDest?.amount).toFixed(3)}{" "}
                      {bridgeDest?.symbol} on{" "}
                      {mappedChainData?.[bridgeDest?.chainId]?.name} via{" "}
                      {bridgeSrc?.protocolName} bridge
                    </span>
                    {/* Refuel statement */}
                    {refuel && (
                      <span>
                        <span className="text-widget-accent">For Gas : </span> 
                        {Number(refuelSrc?.amount).toFixed(3)}{" "}
                        {refuelSrc?.symbol} on{" "}
                        {mappedChainData?.[refuelSrc?.chainId]?.name} to{" "}
                        {Number(refuelDest?.amount).toFixed(3)}{" "}
                        {refuelDest?.symbol} on{" "}
                        {mappedChainData?.[refuelDest?.chainId]?.name} via{" "}
                        Refuel
                      </span>
                    )}
                  </div>
                </TxStep>
              ) : (
                <TxStep
                  label="Bridge"
                  complete={txComplete}
                  currentTx={currentTx}
                  url={url}
                  inProgress={inProgress}
                  forReview={forReview}
                >
                  <div className="flex flex-col gap-2">
                    <span>
                      {Number(bridgeSrc?.amount).toFixed(3)} {bridgeSrc?.symbol}{" "}
                      on {mappedChainData?.[bridgeSrc?.chainId]?.name} to{" "}
                      {Number(bridgeDest?.amount).toFixed(3)}{" "}
                      {bridgeDest?.symbol} on{" "}
                      {mappedChainData?.[bridgeDest?.chainId]?.name} via{" "}
                      {bridgeSrc?.protocolName} bridge
                    </span>
                    {/* Refuel statement */}
                    {refuel && (
                      <span>
                        For gas:
                        {Number(refuelSrc?.amount).toFixed(3)}{" "}
                        {refuelSrc?.symbol} on{" "}
                        {mappedChainData?.[refuelSrc?.chainId]?.name} to{" "}
                        {Number(refuelDest?.amount).toFixed(3)}{" "}
                        {refuelDest?.symbol} on{" "}
                        {mappedChainData?.[refuelDest?.chainId]?.name} via{" "}
                        Refuel
                      </span>
                    )}
                  </div>
                </TxStep>
              )}
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
              forReview={forReview}
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
              forReview={forReview}
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

// Component to show one tx in detail based on its type.
const TxStep = ({
  label,
  children,
  complete = false,
  currentTx = false,
  url = null,
  inProgress = false,
  forReview = false,
}: {
  label: string;
  children: ReactNode;
  complete?: boolean;
  currentTx?: boolean;
  url?: string | null;
  inProgress?: boolean;
  forReview?: boolean;
}) => {
  const active = complete || currentTx;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div className="flex gap-3.5">
      <div
        className={`h-6 w-6 flex items-center justify-center shrink-0 mt-[3px] ${
          complete ? "bg-widget-secondary" : "bg-transparent"
        }`}
        style={{ borderRadius: `calc(0.25rem * ${borderRadius})` }}
      >
        {inProgress && currentTx ? (
          <Spinner size={4} />
        ) : complete ? (
          <CheckCircle className="w-[18px] h-[18px] text-widget-accent" />
        ) : (
          <ArrowRight
            className={`w-[18px] h-[18px] ${
              currentTx || forReview
                ? "text-widget-accent"
                : "text-widget-secondary opacity-60"
            }`}
          />
        )}
      </div>
      <div
        className={`flex flex-col text-xs text-left text-widget-secondary gap-0.5 ${
          !active && !forReview ? "opacity-60" : ""
        }`}
      >
        <span className={`${active || forReview ? "font-medium" : ""}`}>
          {url ? (
            <a
              href={url}
              className="underline flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label} <ExternalLink className="w-3 h-3 opacity-50" />
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
