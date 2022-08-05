import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useState, useEffect, useContext } from "react";
import { ExternalLink } from "react-feather";
import { ethers } from "ethers";

import useMappedChainData from "../../hooks/useMappedChainData";
import { getExplorerLink, ExplorerDataType } from "../../utils/";
import { UserTxType } from "../../consts/";
import { TxDetails } from "../../types";

// components
import { Spinner } from "../common/Spinner";
import { TokenDetailsRow } from "../common/TokenDetailsRow";
import { Stepper } from "../common/Stepper";

// This component is displayed when transaction of type 'fund-movr' (bridging tx) is in progress
export const BridgingLoader = ({ currentRoute, explorerParams, txDetails }) => {
  const mappedChainData = useMappedChainData();
  const [url, setUrl] = useState("");
  const [bridgeDetails, setBridgeDetails] = useState(null);
  const [showSupportLink, setShowSupportLink] = useState(false);
  const [furtherStepsAvailable, setFurtherStepsAvailable] = useState(false);

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
      if (Number(timeDiffInSeconds) > bridgeStep?.serviceTime * 2) {
        setShowSupportLink(true);
      }
    }

    // Check if there are any further steps
    const _currentUserTx = currentRoute?.route?.currentUserTxIndex
      ? currentRoute?.route?.currentUserTxIndex + 1
      : 1;
    setFurtherStepsAvailable(
      _currentUserTx < currentRoute?.route?.userTxs?.length
    );
  }, [currentRoute, txDetails]);

  const refuelSourceToken = {
    amount: currentRoute?.refuel?.fromAmount,
    asset: currentRoute?.refuel?.fromAsset,
  };
  const refuelDestToken = {
    amount: currentRoute?.refuel?.toAmount,
    asset: currentRoute?.refuel?.toAsset,
  };

  return (
    <div className="skt-w absolute bg-widget-primary h-full w-full top-0 left-0 flex flex-col">
      <TokenDetailsRow
        srcDetails={{
          token: currentRoute?.sourceTokenDetails?.token,
          amount: currentRoute?.sourceTokenDetails?.amount,
        }}
        destDetails={{
          token: currentRoute?.destTokenDetails?.token,
          amount: currentRoute?.destTokenDetails?.amount,
        }}
        srcRefuel={refuelSourceToken}
        destRefuel={refuelDestToken}
      />
      <div className="skt-w border-b border-widget-secondary" />

      {currentRoute?.route?.userTxs?.length > 1 && (
        <div className="skt-w px-3.5 py-3 mt-2">
          <Stepper
            currentTx={currentRoute?.route?.currentUserTxIndex}
            userTxs={currentRoute?.route?.userTxs}
          />
        </div>
      )}
      <div className="skt-w flex gap-3 flex-col items-center my-auto pb-3">
        <Spinner size={10} />
        <div>
          <p className="skt-w text-sm text-widget-primary mb-1 font-medium text-center">
            Bridging via {bridgeDetails?.protocol?.displayName} in progress
          </p>
          <p className="skt-w text-sm font-normal text-widget-secondary mb-4 text-center px-3">
            {showSupportLink ? (
              <span>
                Get in touch for support on{" "}
                <a
                  href="https://discord.gg/23Gk2Fa9JZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skt-w underline"
                >
                  Discord
                </a>
              </span>
            ) : (
              <span>
                Estimated wait time is{" "}
                {formatedTime(bridgeDetails?.serviceTime)}
                {furtherStepsAvailable &&
                  ", please come back later to sign the next transaction."}
              </span>
            )}
          </p>
        </div>

        <div className="skt-w flex gap-4">
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
      className="skt-w text-xs bg-widget-secondary text-widget-secondary flex items-center gap-1 flex-nowrap px-2 py-0.5"
      style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="skt-w flex items-center gap-1 hover:underline"
        >
          {label} <ExternalLink className="skt-w text-widget-secondary w-3" />
        </a>
      ) : (
        <>
          {label} <Spinner size={3} />
        </>
      )}
    </span>
  );
};
