import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useState, useEffect, useContext } from "react";
import { ExternalLink } from "react-feather";
import { ethers } from "ethers";

import useMappedChainData from "../../hooks/useMappedChainData";
import { getExplorerLink, ExplorerDataType, timeInMinutes } from "../../utils/";
import { UserTxType } from "../../consts/";
import { TxDetails } from "../../types";

// components
import { Spinner } from "../common/Spinner";
import { TokenDetailsRow } from "../common/TokenDetailsRow";
import { SocketScanLink } from "../common/SocketScanLink";

// This component is displayed when transaction of type 'fund-movr' (bridging tx) is in progress
export const BridgingLoader = ({
  currentRoute,
  explorerParams,
  txDetails,
  refuelEnabled,
}) => {
  const mappedChainData = useMappedChainData();
  const [srcTxHash, setSrcTxHash] = useState("");
  const [destTxHash, setDestTxHash] = useState("");
  const [destRefuelTxHash, setDestRefuelTxHash] = useState("");
  const [bridgeDetails, setBridgeDetails] = useState(null);
  const [showSupportLink, setShowSupportLink] = useState(false);
  const [furtherStepsAvailable, setFurtherStepsAvailable] = useState(false);

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
    <div className="skt-w skt-w-absolute skt-w-bg-widget-primary skt-w-h-full skt-w-w-full skt-w-top-0 skt-w-left-0 skt-w-flex skt-w-flex-col">
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
      <div className="skt-w skt-w-border-b skt-w-border-widget-secondary" />

      <div className="skt-w skt-w-flex skt-w-flex-col skt-w-items-center skt-w-my-auto skt-w-pb-3">
        <Spinner size={10} />
        <div className="mt-4">
          <p className="skt-w skt-w-text-sm skt-w-text-widget-primary skt-w-mb-2 skt-w-font-medium skt-w-text-center">
            Bridging in progress
          </p>
          <p className="skt-w skt-w-text-xs skt-w-font-normal skt-w-text-widget-secondary skt-w-mb-3 skt-w-text-center skt-w-px-3">
            {showSupportLink ? (
              <span>
                Get in touch for support on{" "}
                <a
                  href="https://discord.gg/23Gk2Fa9JZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skt-w skt-w-anchor skt-w-underline"
                >
                  Discord
                </a>
              </span>
            ) : (
              <span>
                Estimated wait time is{" "}
                {timeInMinutes(bridgeDetails?.serviceTime)}
                {furtherStepsAvailable &&
                  ", please come back later to sign the next transaction."}
              </span>
            )}
          </p>
        </div>

        <div className="skt-w skt-w-flex skt-w-flex-col skt-w-items-center skt-w-mt-4">
          <TxRow
            title={`Bridging via ${bridgeDetails?.protocol?.displayName}`}
            srcUrl={srcTxHash}
            destUrl={destTxHash}
          />
          {!!refuelEnabled && (
            <div className="skt-w-mt-3.5">
              <TxRow title="Refuel" destUrl={destRefuelTxHash} />
            </div>
          )}
        </div>
      </div>

      {explorerParams?.srcTxHash && (
        <div className="skt-w-mb-10">
          <SocketScanLink txHash={explorerParams?.srcTxHash} />
        </div>
      )}
    </div>
  );
};

const TxUrlChip = ({ url, label }: { url?: string; label: string }) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <span
      className="skt-w skt-w-text-xs skt-w-bg-widget-primary skt-w-text-widget-secondary skt-w-flex skt-w-items-center skt-w-flex-nowrap skt-w-px-2 skt-w-py-1.5"
      style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
    >
      {url && !url.match("undefined") ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="skt-w skt-w-anchor skt-w-flex skt-w-items-center hover:skt-w-underline"
        >
          {label}{" "}
          <ExternalLink className="skt-w skt-w-text-widget-secondary skt-w-w-3 skt-w-h-auto skt-w-ml-1.5" />
        </a>
      ) : (
        <span className="skt-w skt-w-flex skt-w-items-center skt-w-h-auto">
          <span className="skt-w-mr-1.5">{label}</span> <Spinner size={3} />
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
    <div className="skw-w skt-w-flex skt-w-items-center skt-w-pl-2.5 skt-w-p-0.5 skt-w-rounded-full skt-w-bg-widget-secondary skt-w-border skt-w-border-widget-secondary">
      <span className="skt-w skt-w-text-widget-primary skt-w-text-xs skt-w-pr-2">
        {title}
      </span>
      <div className="skt-w skt-w-flex skt-w-items-center">
        {!!srcUrl && (
          <span className="skt-w-mr-0.5">
            <TxUrlChip label="Src tx" url={srcUrl} />
          </span>
        )}
        <TxUrlChip label="Dest tx" url={destUrl || null} />
      </div>
    </div>
  );
};
