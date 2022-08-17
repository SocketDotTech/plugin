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
export const BridgingLoader = ({ currentRoute, explorerParams, txDetails, refuelEnabled }) => {
  const mappedChainData = useMappedChainData();
  const [srcTxHash, setSrcTxHash] = useState("");
  const [destTxHash, setDestTxHash] = useState("");
  const [destRefuelTxHash, setDestRefuelTxHash] = useState("");
  const [bridgeDetails, setBridgeDetails] = useState(null);
  const [showSupportLink, setShowSupportLink] = useState(false);
  const [furtherStepsAvailable, setFurtherStepsAvailable] = useState(false);

  const formatedTime = (time: number) => {
    return Math.floor(time / 60) + "m";
  };

  useEffect(() => {
    const srcUrl = getExplorerLink(
      mappedChainData?.[explorerParams.srcChainId]?.explorers[0],
      explorerParams.srcTxHash,
      ExplorerDataType.TRANSACTION
    );

    const destUrl = getExplorerLink(
      mappedChainData?.[explorerParams.destChainId]?.explorers[0],
      explorerParams.destTxHash,
      ExplorerDataType.TRANSACTION
    );

    const destRefuelUrl = getExplorerLink(
      mappedChainData?.[explorerParams.destRefuelTxHash]?.explorers[0],
      explorerParams.destRefuelTxHash,
      ExplorerDataType.TRANSACTION
    );

    setSrcTxHash(srcUrl);
    setDestTxHash(destUrl);
    setDestRefuelTxHash(destRefuelUrl);
  }, [mappedChainData, explorerParams]);

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
            currentTx={currentRoute?.route?.currentUserTxIndex || 0}
            userTxs={currentRoute?.route?.userTxs}
          />
        </div>
      )}
      <div className="skt-w flex gap-4 flex-col items-center my-auto pb-3">
        <Spinner size={10} />
        <div>
          <p className="skt-w text-sm text-widget-primary mb-2 font-medium text-center">
            Bridging in progress
          </p>
          <p className="skt-w text-xs font-normal text-widget-secondary mb-3 text-center px-3">
            {showSupportLink ? (
              <span>
                Get in touch for support on{" "}
                <a
                  href="https://discord.gg/23Gk2Fa9JZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skt-w skt-w-anchor underline"
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

        <div className="skt-w flex flex-col gap-3.5 items-center">
          <TxRow
            title={`Bridging via ${bridgeDetails?.protocol?.displayName}`}
            srcUrl={srcTxHash}
            destUrl={destTxHash}
          />
          {!!refuelEnabled && (
            <TxRow title="Refuel" destUrl={destRefuelTxHash} />
          )}
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
      className="skt-w text-xs bg-widget-primary text-widget-secondary flex items-center gap-1 flex-nowrap px-2 py-1.5"
      style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
    >
      {url && !url.match("undefined") ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="skt-w skt-w-anchor flex items-center gap-1 hover:underline"
        >
          {label}{" "}
          <ExternalLink className="skt-w text-widget-secondary w-3 h-auto" />
        </a>
      ) : (
        <span className="skt-w flex items-center gap-1 h-auto">
          {label} <Spinner size={3} />
        </span>
      )}
    </span>
  );
};

const TxRow = ({
  title,
  srcUrl,
  destUrl,
}: {
  title: string;
  srcUrl?: string;
  destUrl?: string;
}) => {
  return (
    <div className="skw-w flex items-center pl-2.5 p-0.5 rounded-full bg-widget-secondary border border-widget-secondary">
      <span className="skt-w text-white text-xs pr-2">{title}</span>
      <div className="skt-w flex items-center gap-0.5">
        {!!srcUrl && <TxUrlChip label="Src tx" url={srcUrl} />}
        <TxUrlChip label="Dest tx" url={destUrl || null} />
      </div>
    </div>
  );
};
