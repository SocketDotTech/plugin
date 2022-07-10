import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useState, useEffect, useContext } from "react";
import { ChevronRight, ExternalLink } from "react-feather";

import useMappedChainData from "../../hooks/useMappedChainData";
import { getExplorerLink, ExplorerDataType } from "../../utils/";

// compoennts
import { Spinner } from "../common/Spinner";
import { TokenDetail } from "../TokenDetail";

export const BridgingLoader = ({ source, dest, explorerParams }) => {
  const mappedChainData = useMappedChainData();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const url = getExplorerLink(
      mappedChainData?.[explorerParams.chainId]?.explorers[0],
      explorerParams.txHash,
      ExplorerDataType.TRANSACTION
    );

    setUrl(url);
  }, [mappedChainData]);

  return (
    <div className="absolute bg-widget-primary h-full w-full top-0 left-0 flex flex-col">
      <div className="flex justify-between mt-5 items-center px-3 mb-2.5 w-full">
        <TokenDetail token={source?.token} amount={source?.amount} />
        <ChevronRight className="w-4 h-4 text-widget-secondary" />
        <TokenDetail token={dest?.token} amount={dest?.amount} rtl />
      </div>
      <div className="py-10 flex gap-3 flex-col items-center">
        <Spinner size={10} />
        <span className="text-sm text-widget-secondary mb-4 font-medium">
          Bridging in progress
        </span>
        <div className="flex gap-4">
          <TxUrlChip label="Source tx" url={url} />
          <TxUrlChip label="Destination tx" />
        </div>
      </div>
    </div>
  );
};

const TxUrlChip = ({ url, label }: { url?: string; label: string }) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <span
      className="text-xs bg-widget-secondary text-widget-secondary flex items-center gap-1 flex-nowrap px-2 py-0.5"
      style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          {label} <ExternalLink className="text-widget-secondary w-3" />
        </a>
      ) : (
        <>
          {label} <Spinner size={3} />
        </>
      )}
    </span>
  );
};
