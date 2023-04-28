import {
  ExplorerDataType,
  formatCurrencyAmount,
  getExplorerLink,
  truncateDecimalValue,
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
    <div className="skt-w skt-w-flex skt-w-flex-col skt-w-text-sm skt-w--my-2">
      {activeRoute?.userTxs?.map((tx, txIndex) => {
        const txComplete =
          tx?.userTxStatus === "completed" ||
          txIndex < currentTxIndex ||
          completed;
        const currentTx = currentTxIndex === tx?.userTxIndex;
        const _txHash = txData?.[txIndex]?.txHash ?? txData?.[txIndex]?.hash;
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

          // Destination Transaction Urls
          const destinationTxUrl = tx?.destinationTxHash
            ? getExplorerLink(
                mappedChainData?.[bridgeDest?.chainId]?.explorers[0],
                tx.destinationTxHash,
                ExplorerDataType.TRANSACTION
              )
            : null;

          const refuelDestinationTxUrl = tx?.refuelDestinationHash
            ? getExplorerLink(
                mappedChainData?.[bridgeDest?.chainId]?.explorers[0],
                tx.refuelDestinationHash,
                ExplorerDataType.TRANSACTION
              )
            : null;

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
              className="skt-w skt-w-flex skt-w-flex-col skt-w-text-sm"
              key={`${activeRoute?.activeRouteId}-fund-movr-swap`}
            >
              {isSwap ? (
                <TxStep
                  label={`Tx ${txIndex + 1}: Swap & Bridge`}
                  complete={txComplete}
                  currentTx={currentTx}
                  url={url}
                  inProgress={inProgress}
                  forReview={forReview}
                  bridgeTx
                  txHash={_txHash}
                >
                  <div className="skt-w skt-w-flex skt-w-flex-col">
                    <span className="skt-w-my-1">
                      {Number(swapSrc?.amount).toFixed(3)} {swapSrc?.symbol} for{" "}
                      {Number(swapDest?.amount).toFixed(3)} {swapDest?.symbol}{" "}
                      via {swapDest?.protocolName} on{" "}
                      {mappedChainData?.[swapSrc.chainId]?.name}
                    </span>
                    <span className="skt-w-my-1">
                      {Number(bridgeSrc?.amount).toFixed(3)} {bridgeSrc?.symbol}{" "}
                      on {mappedChainData?.[bridgeSrc?.chainId]?.name} to{" "}
                      {Number(bridgeDest?.amount).toFixed(3)}{" "}
                      {bridgeDest?.symbol} on{" "}
                      {mappedChainData?.[bridgeDest?.chainId]?.name} via{" "}
                      {bridgeSrc?.protocolName} bridge.{" "}
                      {destinationTxUrl && (
                        <a
                          href={destinationTxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="skt-w skt-w-anchor skt-w-underline skt-w-inline-flex skt-w-items-center skt-w-text-widget-primary"
                        >
                          Dest tx{" "}
                          <ExternalLink className="skt-w skt-w-w-3 skt-w-h-3 skt-w-ml-1" />
                        </a>
                      )}
                    </span>
                    {refuel && (
                      <span className="skt-w-mt-1">
                        <span className="skt-w skt-w-text-widget-accent">
                          For Refuel :{" "}
                        </span>
                        {Number(refuelSrc?.amount).toFixed(3)}{" "}
                        {refuelSrc?.symbol} on{" "}
                        {mappedChainData?.[refuelSrc?.chainId]?.name} to{" "}
                        {truncateDecimalValue(Number(refuelDest?.amount), 3)}{" "}
                        {refuelDest?.symbol} on{" "}
                        {mappedChainData?.[refuelDest?.chainId]?.name} via{" "}
                        Refuel.{" "}
                        {refuelDestinationTxUrl && (
                          <a
                            href={refuelDestinationTxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skt-w skt-w-anchor skt-w-underline skt-w-inline-flex skt-w-items-center skt-w-text-widget-primary"
                          >
                            Dest tx{" "}
                            <ExternalLink className="skt-w skt-w-w-3 skt-w-h-3 skt-w-ml-1" />
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                </TxStep>
              ) : (
                <TxStep
                  label={`Tx ${txIndex + 1} : Bridge`}
                  complete={txComplete}
                  currentTx={currentTx}
                  url={url}
                  inProgress={inProgress}
                  forReview={forReview}
                  bridgeTx
                  txHash={_txHash}
                >
                  <div className="skt-w skt-w-flex skt-w-flex-col skt-w--my-1">
                    <span className="skt-w-my-1">
                      {Number(bridgeSrc?.amount).toFixed(3)} {bridgeSrc?.symbol}{" "}
                      on {mappedChainData?.[bridgeSrc?.chainId]?.name} to{" "}
                      {Number(bridgeDest?.amount).toFixed(3)}{" "}
                      {bridgeDest?.symbol} on{" "}
                      {mappedChainData?.[bridgeDest?.chainId]?.name} via{" "}
                      {bridgeSrc?.protocolName} bridge.{" "}
                      {destinationTxUrl && (
                        <a
                          href={destinationTxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="skt-w skt-w-anchor skt-w-underline skt-w-inline-flex skt-w-items-center skt-w-text-widget-primary"
                        >
                          Dest tx{" "}
                          <ExternalLink className="skt-w skt-w-w-3 skt-w-h-3 skt-w-ml-1" />
                        </a>
                      )}
                    </span>
                    {/* Refuel statement */}
                    {refuel && (
                      <span className="skt-w-my-1">
                        <span className="skt-w skt-w-text-widget-accent">
                          For Refuel :{" "}
                        </span>
                        {Number(refuelSrc?.amount).toFixed(3)}{" "}
                        {refuelSrc?.symbol} on{" "}
                        {mappedChainData?.[refuelSrc?.chainId]?.name} to{" "}
                        {truncateDecimalValue(Number(refuelDest?.amount), 3)}{" "}
                        {refuelDest?.symbol} on{" "}
                        {mappedChainData?.[refuelDest?.chainId]?.name} via{" "}
                        Refuel.{" "}
                        {refuelDestinationTxUrl && (
                          <a
                            href={refuelDestinationTxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skt-w skt-w-anchor skt-w-underline skt-w-inline-flex skt-w-items-center skt-w-text-widget-primary"
                          >
                            Dest tx{" "}
                            <ExternalLink className="skt-w skt-w-w-3 skt-w-h-3 skt-w-ml-1" />
                          </a>
                        )}
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
              label={`Tx ${txIndex + 1}: Swap`}
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
              label={`Tx ${txIndex + 1}: Claim`}
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
  bridgeTx = false,
  txHash,
}: {
  label: string;
  children: ReactNode;
  complete?: boolean;
  currentTx?: boolean;
  url?: string | null;
  inProgress?: boolean;
  forReview?: boolean;
  bridgeTx?: boolean;
  txHash?: string;
}) => {
  const active = complete || currentTx;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div
      className={`skt-w skt-w-flex skt-w-border skt-w-my-2 ${
        currentTx
          ? "skt-w-bg-widget-secondary skt-w-bg-opacity-20 skt-w-border-widget-accent"
          : "skt-w-border-widget-secondary"
      } ${forReview ? "" : "skt-w-p-3"}`}
      style={{ borderRadius: `calc(0.5rem * ${borderRadius}` }}
    >
      <div
        className={`skt-w skt-w-h-6 skt-w-w-6 skt-w-flex skt-w-items-center skt-w-justify-center skt-w-shrink-0 skt-w-mt-[3px] skt-w-mr-3.5 ${
          complete ? "skt-w-bg-widget-secondary" : "skt-w-bg-transparent"
        }`}
        style={{ borderRadius: `calc(0.25rem * ${borderRadius})` }}
      >
        {inProgress && currentTx ? (
          <Spinner size={4} />
        ) : complete ? (
          <CheckCircle className="skt-w skt-w-w-[18px] skt-w-h-[18px] skt-w-text-widget-accent" />
        ) : (
          <ArrowRight
            className={`skt-w skt-w-w-[18px] skt-w-h-[18px] ${
              currentTx || forReview
                ? "skt-w-text-widget-accent"
                : "skt-w-text-widget-secondary opacity-60"
            }`}
          />
        )}
      </div>
      <div
        className={`skt-w skt-w-flex skt-w-flex-col skt-w-text-xs skt-w-text-left skt-w-text-widget-secondary ${
          !active && !forReview ? "skt-w-opacity-60" : ""
        }`}
      >
        <span
          className={`skt-w skt-w-mb-0.5 ${
            active || forReview
              ? "skt-w-font-medium skt-w-text-widget-primary"
              : ""
          }`}
        >
          {url ? (
            <div className="skt-w-flex skt-w-items-center">
              <a
                href={url}
                className="skt-w skt-w-anchor skt-w-underline skt-w-flex skt-w-items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}{" "}
                <ExternalLink className="skt-w skt-w-w-3 skt-w-h-3 skt-w-opacity-50 skt-w-ml-1" />
              </a>
              {bridgeTx && <SocketScanUrl txHash={txHash} />}
            </div>
          ) : (
            label
          )}
        </span>
        <span>{children}</span>
      </div>
    </div>
  );
};

const SocketScanUrl = ({ txHash }) => {
  return (
    <a
      href={`https://socketscan.io/tx/${txHash}`}
      className="skt-w skt-w-anchor skt-w-underline skt-w-flex skt-w-items-center skt-w-ml-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      SocketScan{" "}
      <ExternalLink className="skt-w skt-w-w-3 skt-w-h-3 skt-w-opacity-50 skt-w-ml-1" />
    </a>
  );
};
