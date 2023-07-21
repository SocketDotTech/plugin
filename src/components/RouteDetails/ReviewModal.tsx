import { useDispatch, useSelector } from "react-redux";
import { ReactNode, useContext, useEffect, useState } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { BRIDGE_DISPLAY_NAMES, UserTxType } from "../../consts/";
import Tippy from "@tippyjs/react";
import { ChevronUp, Edit, Info } from "react-feather";

// components
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { InnerCard } from "../common/InnerCard";
import { TxStepDetails } from "../TxModal/TxStepDetails";
import { TokenDetailsRow } from "../common/TokenDetailsRow";

// actions
import { setIsSettingsModalOpen, setIsTxModalOpen } from "../../state/modals";
import { setSelectedRoute } from "../../state/selectedRouteSlice";

import {
  formatCurrencyAmount,
  timeInMinutes,
  truncateDecimalValue,
} from "../../utils/";
import { useGetFees } from "../../hooks/useGetFees";
import { useGetGasLimitFromUserTxs } from "../../hooks/useGetGasLimitFromUserTxs";

export const ReviewModal = ({
  closeModal,
  style,
}: {
  closeModal: () => void;
  style?: any;
}) => {
  const dispatch = useDispatch();
  const bestRoute = useSelector((state: any) => state.quotes.bestRoute);
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);
  const [showTxDetails, setShowTxDetails] = useState<boolean>(false);
  const [quoteUpdated, setQuoteUpdated] = useState<boolean>(false);
  const [isSameChainSwap, setIsSameChainSwap] = useState<boolean>(false);

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  // Sets the selected route if updated.
  function updateSelectedRoute() {
    dispatch(setSelectedRoute(bestRoute));
  }

  async function openTxModal() {
    dispatch(setIsTxModalOpen(true));
  }

  useEffect(() => {
    if (bestRoute !== selectedRoute) {
      setQuoteUpdated(true);
    } else setQuoteUpdated(false);
  }, [selectedRoute, bestRoute]);

  const refuelSourceToken = {
    amount: selectedRoute?.refuel?.fromAmount,
    asset: selectedRoute?.refuel?.fromAsset,
  };
  const refuelDestToken = {
    amount: selectedRoute?.refuel?.toAmount,
    asset: selectedRoute?.refuel?.toAsset,
  };

  // Source Gas Fees
  const sourceGasLimit = useGetGasLimitFromUserTxs(
    selectedRoute?.route,
    selectedRoute?.path?.fromToken?.chainId
  );
  const sourceNativeToken = selectedRoute?.route?.userTxs.filter(
    (tx) => tx.chainId === selectedRoute?.path?.fromToken?.chainId
  )[0]?.gasFees?.asset;
  const { feesInToken: sourceFeesInToken, feesInUsd: sourceFeesInUSD } =
    useGetFees(
      sourceGasLimit,
      sourceNativeToken?.chainId,
      sourceNativeToken?.decimals,
      selectedRoute?.route
    );

  // Dest Gas Fees
  const destGasLimit = useGetGasLimitFromUserTxs(
    selectedRoute?.route,
    selectedRoute?.path?.fromToken?.chainId
  );
  const destNativeToken = selectedRoute?.route?.userTxs.filter(
    (tx) => tx.chainId === selectedRoute?.path?.toToken?.chainId
  )[0]?.gasFees?.asset;
  const { feesInToken: destFeesInToken, feesInUsd: destFeesInUSD } = useGetFees(
    destGasLimit,
    destNativeToken?.chainId,
    destNativeToken?.decimals,
    selectedRoute?.route
  );

  // Extracting Bridge Step from fundMove userTx
  const fundMovrData = selectedRoute?.route?.userTxs.filter(
    (item) => item.userTxType === UserTxType.FUND_MOVR
  )[0];
  const bridgeData =
    fundMovrData?.steps &&
    fundMovrData?.steps.filter((step) => step.type === "bridge")[0];

  const swapStepInFundMovr =
    fundMovrData?.steps &&
    fundMovrData?.steps.filter((step) => step.type === "middleware")[0];

  // Extracting the Swap step from userTxs
  const swapData = selectedRoute?.route?.userTxs.filter(
    (item) => item.userTxType === UserTxType.DEX_SWAP
  )?.[0];

  // Bridge Fee
  const bridgeFee = bridgeData?.protocolFees.feesInUsd;
  const bridgeFeeInToken = formatCurrencyAmount(
    bridgeData?.protocolFees.amount,
    bridgeData?.protocolFees.asset.decimals,
    5
  );
  const bridgeFeeTokenSymbol = bridgeData?.protocolFees.asset.symbol;

  // OP Rebates data
  const opRebateData = bridgeData?.extraData?.opRebateData;
  const opToken = opRebateData?.asset;
  const opRebateAmountFormatted =
    opRebateData && formatCurrencyAmount(opRebateData.amount, opToken.decimals);
  const OpRebateLabel = (
    <span className="skt-w skt-w-flex skt-w-items-center">
      OP Rewards
      <Tippy content="Estimated rewards for bridging to Optimism.">
        <Info className="skt-w skt-w-ml-1.5 skt-w-w-4 skt-w-h-4" />
      </Tippy>
    </span>
  );

  useEffect(() => {
    setIsSameChainSwap(
      selectedRoute?.path?.fromToken?.chainId ===
        selectedRoute?.path?.toToken?.chainId
    );
  }, [selectedRoute]);

  const openSettingsModal = () => {
    dispatch(setIsSettingsModalOpen(true));
  };

  // getting the minimum amount from the last user tx.
  // TODO: We definitely need the minimum output at the root.
  let minAmountInToken;
  if (!!selectedRoute?.route) {
    const _selectedRoute = selectedRoute.route; // taking the route object out
    const lastUserTx =
      _selectedRoute &&
      _selectedRoute.userTxs[_selectedRoute.userTxs?.length - 1];
    const stepsInLastUserTx =
      lastUserTx?.userTxType === "claim"
        ? _selectedRoute?.userTxs[_selectedRoute?.userTxs?.length - 2]?.steps
        : lastUserTx?.steps;
    const lastStep =
      stepsInLastUserTx?.length > 0 &&
      stepsInLastUserTx[stepsInLastUserTx?.length - 1];

    const minAmountOut =
      _selectedRoute?.userTxs[_selectedRoute?.userTxs?.length - 1]
        ?.minAmountOut ?? lastStep?.minAmountOut;

    // note that selectedRoute is used below and not _selectedRoute
    minAmountInToken =
      minAmountOut &&
      selectedRoute?.path?.toToken &&
      formatCurrencyAmount(
        minAmountOut,
        selectedRoute?.path?.toToken?.decimals,
        4
      );
  }

  return (
    <Modal
      title="Review Quote"
      closeModal={
        showTxDetails ? () => setShowTxDetails(!showTxDetails) : closeModal
      }
      style={style}
    >
      <div className="skt-w skt-w-flex skt-w-flex-col skt-w-justify-between skt-w-flex-1 skt-w-relative">
        <div
          className="skt-w skt-w-w-full skt-w-overflow-y-auto"
          style={{ height: "calc(100% - 7rem)" }}
        >
          <TokenDetailsRow
            srcDetails={{
              token: selectedRoute?.path?.fromToken,
              amount: selectedRoute?.amount,
            }}
            destDetails={{
              token: selectedRoute?.path?.toToken,
              amount: selectedRoute?.route?.toAmount,
            }}
            srcRefuel={refuelSourceToken}
            destRefuel={refuelDestToken}
          />

          <div className="skt-w skt-w-px-3 skt-w-py-1.5 skt-w-flex skt-w-flex-col skt-w-mt-1">
            {!isSameChainSwap ? (
              <>
                <RouteDetailRow
                  label="Bridge Name"
                  value={
                    BRIDGE_DISPLAY_NAMES[
                      selectedRoute?.route?.usedBridgeNames?.[0]
                    ] || selectedRoute?.route?.usedBridgeNames?.[0]
                  }
                />
                <RouteDetailRow
                  label="Estimated Bridging Time"
                  value={timeInMinutes(selectedRoute?.route?.serviceTime)}
                />
                <RouteDetailRow label="Bridge Fee">
                  <FeeDisplay
                    feeInToken={bridgeFeeInToken}
                    feeInUsd={bridgeFee}
                    tokenSymbol={bridgeFeeTokenSymbol}
                  />
                </RouteDetailRow>
              </>
            ) : (
              <RouteDetailRow
                label="Dex Name"
                value={swapData?.protocol?.displayName}
              />
            )}
            <RouteDetailRow label="Source Gas Fee">
              <FeeDisplay
                feeInToken={sourceFeesInToken}
                feeInUsd={sourceFeesInUSD}
                tokenSymbol={sourceNativeToken?.symbol}
              />
            </RouteDetailRow>
            {!!destFeesInToken && !isSameChainSwap && (
              <>
                <RouteDetailRow label="Dest Gas Fee">
                  <FeeDisplay
                    feeInToken={destFeesInToken}
                    feeInUsd={destFeesInUSD}
                    tokenSymbol={destNativeToken?.symbol}
                  />
                </RouteDetailRow>
                <RouteDetailRow
                  label="Number of transactions"
                  value={selectedRoute?.route?.totalUserTx}
                />
              </>
            )}
            {(!!swapStepInFundMovr || !!swapData) && (
              <RouteDetailRow label="Swap Slippage">
                <div className="skt-w-flex skt-w-items-center">
                  {swapData?.swapSlippage ?? swapStepInFundMovr?.swapSlippage}%{" "}
                  <button
                    className="skt-w skt-w-input skt-w-button skt-w-flex"
                    onClick={openSettingsModal}
                  >
                    <Edit className="skt-w-ml-2 skt-w-w-4 skt-w-h-4 skt-w-text-widget-accent" />
                  </button>
                </div>
              </RouteDetailRow>
            )}
            {bridgeData &&
              bridgeData?.protocol?.displayName.toLowerCase() !== "hyphen" && (
                <RouteDetailRow
                  label="Minimum received"
                  value={`${minAmountInToken?.toString()} ${
                    selectedRoute?.path?.toToken?.symbol
                  }`}
                />
              )}
            {opRebateData && opRebateData?.amount != "0" && (
              <RouteDetailRow label={OpRebateLabel}>
                <div className="skt-w skt-w-flex skt-w-items-center">
                  <img
                    src={opToken.logoURI}
                    className="skt-w skt-w-w-5 skt-w-h-5 skt-w-mr-1"
                  />
                  <FeeDisplay
                    feeInToken={opRebateAmountFormatted}
                    feeInUsd={opRebateData?.amountInUsd}
                    tokenSymbol={opToken.symbol}
                  />
                </div>
              </RouteDetailRow>
            )}
          </div>
        </div>

        <InnerCard
          classNames={`skt-w-absolute skt-w-w-full skt-w-flex skt-w-bottom-0 skt-w-flex-col skt-w-justify-between skt-w-transition-all ${
            showTxDetails
              ? `skt-w-h-full skt-w-max-h-full`
              : "skt-w-h-auto skt-w-max-h-min"
          }`}
        >
          <div className="skt-w skt-w-flex-1 skt-w-flex skt-w-flex-col skt-w-overflow-auto">
            <button
              className="skt-w skt-w-button skt-w-input skt-w-flex skt-w-items-center skt-w-text-sm skt-w-text-widget-secondary skt-w-mb-3"
              onClick={() => setShowTxDetails(!showTxDetails)}
            >
              <ChevronUp
                className={`skt-w skt-w-w-4 skt-w-h-4 skt-w-text-widget-secondary skt-w-transition-all skt-w-mr-1.5 ${
                  showTxDetails ? "skt-w-rotate-180" : "skt-w-rotate-0"
                }`}
              />{" "}
              See route details
            </button>

            {showTxDetails && (
              <div className="skt-w skt-w-mb-3 skt-w-flex-1 skt-w-overflow-y-auto">
                <TxStepDetails
                  activeRoute={selectedRoute?.route}
                  forReview
                  refuel={selectedRoute?.refuel}
                />
              </div>
            )}
          </div>

          <div
            className={`skt-w skt-w-h-14 skt-w-transition-all skt-w-duration-300 skt-w-flex skt-w-justify-between skt-w-items-center skt-w-border ${
              quoteUpdated
                ? "skt-w-border-widget-outline skt-w-p-1 skt-w-pl-2"
                : "skt-w-border-transparent"
            }`}
            style={{ borderRadius: `calc(0.875rem * ${borderRadius})` }}
          >
            {quoteUpdated && (
              <span className="skt-w skt-w-whitespace-nowrap skt-w-w-full skt-w-text-widget-secondary skt-w-text-sm skt-w-text-left">
                {!bestRoute ? "Quote updating..." : "Quote updated"}
              </span>
            )}

            <Button
              onClick={quoteUpdated ? updateSelectedRoute : openTxModal}
              classNames={`${quoteUpdated ? "skt-w-h-12" : ""}`}
              disabled={!bestRoute}
            >
              {quoteUpdated
                ? "Accept"
                : `Confirm ${isSameChainSwap ? "Swap" : "Bridge"}`}
            </Button>
          </div>
        </InnerCard>
      </div>
    </Modal>
  );
};

const RouteDetailRow = ({
  label,
  value,
  children,
}: {
  label: ReactNode;
  value?: string;
  children?: ReactNode;
}) => {
  return (
    <div className="skt-w skt-w-w-full skt-w-flex skt-w-justify-between skt-w-text-sm skt-w-text-widget-secondary skt-w-my-1.5">
      <span>{label}</span>
      <span>{value}</span>
      {children}
    </div>
  );
};

interface FeeDisplayProps {
  feeInToken: string;
  tokenSymbol: string | undefined;
  feeInUsd: number;
}

const FeeDisplay = (props: FeeDisplayProps) => {
  const { feeInToken, tokenSymbol, feeInUsd } = props;
  if (!!feeInToken) {
    return (
      <span>
        {!!feeInToken && feeInToken !== "0" ? (
          <span>
            {truncateDecimalValue(feeInToken, 5)}{" "}
            <span className="skt-w-font-medium">{tokenSymbol}</span>{" "}
          </span>
        ) : (
          0
        )}
        {feeInUsd !== 0 && (
          <span className="skt-w-opacity-80 skt-w-font-normal">
            (${feeInUsd?.toFixed(4)})
          </span>
        )}
      </span>
    );
  } else return null;
};
