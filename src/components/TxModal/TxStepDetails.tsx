import { formatCurrencyAmount } from "../../utils/";
import useMappedChainData from "../../hooks/useMappedChainData";

export const TxStepDetails = ({ activeRoute }) => {
  const mappedChainData = useMappedChainData();
  return (
    <div className="flex flex-col gap-3 text-sm">
      {activeRoute?.userTxs?.map((tx) => {
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
              className="flex flex-col gap-3"
              key={`${activeRoute?.activeRouteId}-fund-movr-swap`}
            >
              {isSwap && (
                <div>
                  <div className="flex items-center gap-2">
                    <Checkbox completed={tx?.userTxStatus === "completed"} />
                    Swap Tokens
                  </div>
                  {Number(swapSrc?.amount).toFixed(3)} {swapSrc?.symbol} for{" "}
                  {Number(swapDest?.amount).toFixed(3)} {swapDest?.symbol} via{" "}
                  {swapDest?.protocolName} on{" "}
                  {mappedChainData?.[swapSrc.chainId]?.name}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Checkbox completed={tx?.userTxStatus === "completed"} />
                  Bridge Tokens
                </div>
                {Number(bridgeSrc?.amount).toFixed(3)} {bridgeSrc?.symbol} on{" "}
                {mappedChainData?.[bridgeSrc?.chainId]?.name} to{" "}
                {Number(bridgeDest?.amount).toFixed(3)} {bridgeDest?.symbol} on{" "}
                {mappedChainData?.[bridgeDest?.chainId]?.name} via{" "}
                {bridgeSrc?.protocolName} bridge
              </div>
            </div>
          );
        } else if (tx?.userTxType === "dex-swap") {
          const swapSrc = getTxDetail(null, false);
          const swapDest = getTxDetail(null, true);

          return (
            <div key={`${activeRoute?.activeRouteId}-dex-swap`}>
              <div className="flex items-center gap-2">
                <Checkbox completed={tx?.userTxStatus === "completed"} />
                Swap Tokens
              </div>
              {Number(swapSrc?.amount).toFixed(3)} {swapSrc?.symbol} for{" "}
              {Number(swapDest?.amount).toFixed(3)} {swapDest?.symbol} via{" "}
              {swapDest?.protocolName} on{" "}
              {mappedChainData?.[swapDest?.chainId]?.name}
            </div>
          );
        } else if (tx?.userTxType === "claim") {
          return (
            <div key={`${activeRoute?.activeRouteId}-claim`}>
              <div className="flex items-center gap-2">
                <Checkbox completed={tx?.userTxStatus === "completed"} />
                Claim Tokens
              </div>
              Claimed {tx?.toAsset?.symbol} on{" "}
              {mappedChainData?.[tx?.chainId].name}
            </div>
          );
        }
      })}
    </div>
  );
};

const Checkbox = ({ completed }: { completed: boolean }) => {
  return (
    <div
      className={`w-4 h-4 rounded-full flex justify-center items-center bg-white ${
        completed ? "text-green-500" : "text-red-500"
      }`}
    >
      {completed ? "Y" : "N"}
    </div>
  );
};
