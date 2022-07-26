import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useState, useEffect, useContext } from "react";
import { ChevronRight, ExternalLink } from "react-feather";
import { ethers } from "ethers";

import useMappedChainData from "../../hooks/useMappedChainData";
import { getExplorerLink, ExplorerDataType } from "../../utils/";
import { UserTxType } from "../../consts/";
import { TxDetails } from "../../types";

// components
import { Spinner } from "../common/Spinner";
import { TokenDetail } from "../common/TokenDetail";

// This component is displayed when transaction of type 'fund-movr' (bridging tx) is in progress
export const BridgingLoader = ({ currentRoute, explorerParams, txDetails }) => {
  const mappedChainData = useMappedChainData();
  const [url, setUrl] = useState("");
  const [bridgeDetails, setBridgeDetails] = useState(null);
  const [showSupportLink, setShowSupportLink] = useState(false);

  const formatedTime = (time: number) => {
    return Math.floor(time / 60) + "m";
  };

  useEffect(() => {
    const url = getExplorerLink(
      mappedChainData?.[explorerParams.chainId]?.explorers[0],
      explorerParams.txHash,
      ExplorerDataType.TRANSACTION
    );

    setUrl(url);
  }, [mappedChainData]);

  // To set the bridge name, service time and discord url
  useEffect(() => {
    // Filtering out bridge tx from userTxs.
    const bridgeTx = currentRoute?.route?.userTxs?.filter(
      (x) => x.userTxType === UserTxType.FUND_MOVR
    )?.[0];

    // Filtering out the bridge step from the steps in bridgeTx
    const bridgeStep = bridgeTx?.steps?.filter((x) => x.type === "bridge")?.[0];
    setBridgeDetails(bridgeStep);

    // Getting txDetails as an array
    const txDetailValues: TxDetails[] = txDetails && Object.values(txDetails);
    
    // Getting the timestamp of the bridging transaction
    const bridgingTimeStamp: number = txDetailValues?.filter(
        (x: TxDetails): boolean => x.userTxType === UserTxType.FUND_MOVR
      )?.[0]?.timeStamp;
    
    const currentTime = new Date().getTime();

    if (bridgingTimeStamp && currentTime) {
      // Difference between current time and the time when the bridging transaction was triggered
      const timeDiff = ethers.BigNumber.from(currentTime).sub(
        ethers.BigNumber.from(bridgingTimeStamp)
      );
      const timeDiffInSeconds = timeDiff.div(1000).toString();

      // If time difference is twice the service time, show discord support link
      if (Number(timeDiffInSeconds) * 2 > bridgeStep?.serviceTime) {
        setShowSupportLink(true);
      }
    }
  }, [currentRoute, txDetails]);

  return (
    <div className="absolute bg-widget-primary h-full w-full top-0 left-0 flex flex-col">
      <div className="flex justify-between mt-5 items-center px-3 mb-2.5 w-full">
        <TokenDetail
          token={currentRoute?.sourceTokenDetails?.token}
          amount={currentRoute?.sourceTokenDetails?.amount}
        />
        <ChevronRight className="w-4 h-4 text-widget-secondary" />
        <TokenDetail
          token={currentRoute?.destTokenDetails?.token}
          amount={currentRoute?.destTokenDetails?.amount}
          rtl
        />
      </div>
      <div className="py-10 flex gap-3 flex-col items-center">
        <Spinner size={10} />
        <div>
          <p className="text-sm text-widget-primary mb-1 font-medium text-center">
            Bridging via {bridgeDetails?.protocol?.displayName} in progress
          </p>
          <p className="text-sm font-normal text-widget-secondary mb-4 text-center">
            {showSupportLink ? (
              <span>
                Get in touch for support on{" "}
                <a
                  href="https://discord.gg/23Gk2Fa9JZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Discord
                </a>
              </span>
            ) : (
              <span>
                Estimated wait time is{" "}
                {formatedTime(bridgeDetails?.serviceTime)}
              </span>
            )}
          </p>
        </div>

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
