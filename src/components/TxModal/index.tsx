import { useDispatch, useSelector } from "react-redux";
import { ReactElement, useContext, useEffect, useState } from "react";
import { SocketTx } from "@socket.tech/socket-v2-sdk";
import { getSwapTx, handleNetworkChange } from "../../utils";

// components
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { TxStepDetails } from "./TxStepDetails";
import { BridgingLoader } from "./BridgingLoader";
import { Edit } from "react-feather";

// actions
import {
  setActiveRoute,
  setError,
  setIsSettingsModalOpen,
  setIsTxModalOpen,
} from "../../state/modals";
import { setTxDetails } from "../../state/txDetails";

// hooks
import { socket, updateAndRefetch, usePendingRoutes } from "../../hooks/apis";

import {
  USER_TX_LABELS,
  UserTxType,
  PrepareTxStatus,
  ButtonTexts,
} from "../../consts/";

import { Web3Context } from "../../providers/Web3Provider";
import { SuccessToast } from "./SuccessToast";
import { TokenDetailsRow } from "../common/TokenDetailsRow";
import { transactionDetails } from "../../types";

// The main modal that contains all the information related after clicking on review quote.
// Responsible for the progression of the route.
// Functions responsible for sending a transaction and checking the status of the route.
export const TxModal = ({
  style,
  onBridge,
  onError,
  onSubmit,
}: {
  style: any;
  onBridge?: (data: transactionDetails) => void;
  onError?: (data: any) => void;
  onSubmit?: (data: transactionDetails) => void;
}) => {
  const dispatch = useDispatch();
  function closeTxModal() {
    dispatch(setIsTxModalOpen(false));
  }

  // When the tx modal is opened from the tx-history(pending) section, selectedRoute will be set to null & activeRoute will be truthy
  // If the tx modal is opened in the normal user flow, the selected route will be truthy and activeRoute will be null
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute); // the route the user selects initially
  const activeRoute = useSelector((state: any) => state.modals.activeRoute); // the route that is opened from pending transactions
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const txDetails = useSelector((state: any) => state.txDetails.txDetails);

  const web3Context = useContext(Web3Context);
  const {
    userAddress,
    signer,
    provider,
    networkId: activeChain,
  } = web3Context.web3Provider;

  const [initiating, setInitiating] = useState<boolean>(false);
  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [bridging, setBridging] = useState<boolean>(false);
  const [txCompleted, setTxCompleted] = useState<boolean>(false);
  const [retryEnabled, enableRetry] = useState<boolean>(false);

  const [approvalTxData, setApprovalTxData] = useState<any>(null);
  const [userTx, setUserTx] = useState(null);
  const { mutate: mutatePendingRoutes } = usePendingRoutes();
  const [explorerParams, setExplorerParams] = useState<{
    srcTxHash: string;
    srcChainId: number;
    destTxHash?: string;
    destChainId?: number;
    destRefuelTxHash?: string;
  }>({
    srcTxHash: "",
    srcChainId: null,
    destChainId: null,
    destTxHash: "",
    destRefuelTxHash: "",
  });

  // Function to switch the connected network.
  function switchNetwork() {
    const chain = allNetworks.filter((x) => x.chainId === userTx?.chainId)?.[0];
    handleNetworkChange(provider, chain);
  }

  function saveTxDetails(
    account: string,
    routeId: number,
    stepIndex: number,
    value: { hash: string; userTxType: string }
  ): void {
    const prevTxDetails = JSON.parse(localStorage.getItem("txData")) ?? {};
    const prevTxDetailsAccount = prevTxDetails[account];

    // create account key if doesn't exist
    if (!prevTxDetailsAccount) prevTxDetails[account] = {};
    const prevTxDetailsRouteId = prevTxDetails[account][routeId];

    // create route Id key if it doesn't exist
    if (prevTxDetailsRouteId) {
      prevTxDetails[account] = {
        ...prevTxDetails[account],
        [routeId]: {
          ...prevTxDetailsRouteId,
          [stepIndex]: value,
        },
      };
    } else {
      prevTxDetails[account] = {
        ...prevTxDetails[account],
        [routeId]: {
          [stepIndex]: value,
        },
      };
    }

    localStorage.setItem("txData", JSON.stringify(prevTxDetails));
    return prevTxDetails;
  }

  // Function that submits the approval transaction when approval is needed.
  async function submitApproval() {
    setIsApproving(true);
    try {
      const approvalTx = await signer.sendTransaction(approvalTxData);
      await approvalTx.wait();
      setIsApproving(false);
      setIsApprovalRequired(false); // Set to false when approval is done.
    } catch (e) {
      dispatch(setError(e.message));

      !!onError && onError(e);
      setIsApproving(false);
    }
  }

  // Function that start the selected route.
  async function startRoute() {
    setInitiating(true);
    try {
      const execute = await socket.start(selectedRoute);
      await prepareNextTransaction(execute);
    } catch (e) {
      dispatch(setError(e.message));
      !!onError && onError(e);
    }
  }

  // Function that lets the user continue the route from the previous transaction when he reopens the plugin.
  async function continueRoute(txHash?: string, _activeRouteId?: number) {
    setInitiating(true);
    // in normal flow, txType and activeRouteId  will be passed.
    // when continuing from tx history section, prevTxData from the localStorage will be fetched;
    let activeRouteToBeUsed = activeRoute?.activeRouteId ?? _activeRouteId;
    const prevTxData = txDetails?.[userAddress]?.[activeRouteToBeUsed];
    const keysArr = prevTxData && Object.keys(prevTxData);
    const lastStep = prevTxData?.[keysArr?.[keysArr?.length - 1]];

    try {
      const execute = await socket.continue(
        activeRoute?.activeRouteId || _activeRouteId
      );
      await prepareNextTransaction(
        execute,
        txHash || lastStep?.hash,
        lastStep?.userTxType
      );
    } catch (e) {
      const err = e.message;
      if (err.match("is already complete")) {
        // the backend throws an error if we request a tx for a completed route.
        setTxCompleted(true);
      } else {
        dispatch(setError(err));
        !!onError && onError(e);
      }
      setInitiating(false);
      setBridging(false);
      enableRetry(true);
    }
  }

  // Function that checks the progress of the route and initiates the next transaction when ready.
  // Uses the same tx as init if the 1st tx isn't completed
  async function submitNextTx() {
    // Set the tx in progress.
    setTxInProgress(true);
    try {
      const sendTxData = await userTx.getSendTransaction();
      const sendTx = await signer.sendTransaction(sendTxData);

      // set data to local storage, txHash is in storage if the user leaves in the middle of the transaction.
      const value = {
        hash: sendTx.hash,
        chainId: userTx.chainId,
        userTxType: userTx.userTxType,
        timeStamp: new Date().getTime(),
      };
      const prevTxDetails = saveTxDetails(
        userAddress,
        userTx.activeRouteId,
        userTx.userTxIndex,
        value
      );

      // Adds the new txHash to the currentRoute state.
      const _updatedCurrentRoute = {
        ...currentRoute,
        txData: prevTxDetails[userAddress][userTx.activeRouteId],
      };

      setCurrentRoute(_updatedCurrentRoute);
      dispatch(
        setTxDetails({
          prevTxDetails,
        })
      );

      // calling onSubmit on first tx
      if (userTx?.userTxIndex === 0 && !!onSubmit)
        onSubmit({
          ...transactionDetailsData,
          txData: prevTxDetails[userAddress][userTx.activeRouteId],
        });

      // Set Tx Progress as false when tx is included in the chain.
      await sendTx.wait();
      setTxInProgress(false);

      // if tx is of type fund-movr, set bridging loader to true
      if (userTx.userTxType === UserTxType.FUND_MOVR) {
        setExplorerParams({
          srcTxHash: sendTx.hash,
          srcChainId: selectedRoute?.path?.fromToken?.chainId,
        });
        setBridging(true);
      }

      // This checks the status of the transaction. The status can be ready, completed and pending.
      let currentStatus;
      try {
        currentStatus = await userTx.submit(sendTx.hash);
      } catch (e) {
        currentStatus = PrepareTxStatus.PENDING;
      }

      // If current status is completed mark route as completed else continue the route.
      if (currentStatus && currentStatus !== PrepareTxStatus.COMPLETED) {
        await continueRoute(userTx.hash, userTx.activeRouteId);
      } else if (currentStatus === PrepareTxStatus.COMPLETED) {
        setTxCompleted(true);
        setBridging(false);
        mutatePendingRoutes(); // mutating the pending tx list
      }
    } catch (e) {
      const err = e?.data?.message?.toLowerCase() || e.message.toLowerCase();
      let errMessage: string;

      if (err.match("execution reverted: middleware_action_failed")) {
        errMessage =
          "Swap failed due to slippage or low DEX liquidity, please increase the slippage and retry or contact support";
      } else if (
        err.match("insufficient funds") ||
        err.match("transfer amount exceeds balance")
      ) {
        errMessage = "Insufficient funds";
      } else if (
        err.match("execution reverted") ||
        err.match("reverted") ||
        err.match("transaction failed")
      ) {
        errMessage = "Transaction failed, please try again or contact support";
      } else {
        errMessage = `${err} - Please try again or contact support`;
      }

      const activeRouteId = currentRoute?.route?.activeRouteId;
      const routeIdString = activeRouteId
        ? ` - Route ID: ${activeRouteId}`
        : null;

      dispatch(setError(`${errMessage} ${routeIdString ?? ""}`));
      !!onError && onError(e);
      setBridging(false);
      setTxInProgress(false);
      enableRetry(true);
    }
  }

  // Function that prepares the next transaction in the route.
  const prepareNextTransaction = async (
    execute: AsyncGenerator<SocketTx, void, string>,
    txHash?: string,
    txType?: string
  ) => {
    // If the tx is of type 'fund-movr', set bridging to true.
    if (!bridging && txType === UserTxType.FUND_MOVR) {
      const _currentRoute = activeRoute || selectedRoute?.route;
      const bridgeTx = _currentRoute?.userTxs?.filter(
        (x) => x.userTxType === UserTxType.FUND_MOVR
      )?.[0];

      setBridging(true);
      setInitiating(false);

      setExplorerParams({
        srcTxHash: txHash,
        srcChainId:
          activeRoute?.fromChainId || selectedRoute?.path?.fromToken?.chainId,
        destChainId:
          activeRoute?.toChainId || selectedRoute?.path?.toToken?.chainId,
        destTxHash: bridgeTx?.destinationTxHash,
        destRefuelTxHash: bridgeTx?.refuelDestinationHash,
      });
    }

    try {
      // If txHash is present, pass the txHash to execute else do not.
      const next = txHash ? await execute.next(txHash) : await execute.next();
      setBridging(false);

      // If next.done is false, then set the userTx to next.value.
      // If approval is needed, set approval required to true and set approval tx Data.
      if (!next.done && next.value) {
        const tx = next.value;
        setUserTx(tx); // used in submitNextTransaction to get txData
        const _approvalTxData = await tx.getApproveTransaction();
        setInitiating(false);
        setApprovalTxData(_approvalTxData);
        if (_approvalTxData) setIsApprovalRequired(true);
      }

      // If next.done is true, set tx as completed.
      if (next.done) {
        setInitiating(false);
        setTxCompleted(true);
      }
    } catch (e) {
      if (e) {
        dispatch(setError(e.message));
        !!onError && onError(e);
      }
      setBridging(false);
      setInitiating(false);
      enableRetry(true);
    }
  };

  // Current route is either activeRoute or selectedRoute
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    // start route only at the absolute beginning
    if (!activeRoute && !userTx?.activeRouteId) startRoute();
    else continueRoute(null, userTx?.activeRouteId);

    // Always check for active route before checking for selected route
    const _sourceTokenDetails = {
      token: activeRoute?.fromAsset || selectedRoute?.path?.fromToken,
      amount: activeRoute?.fromAmount || selectedRoute?.amount,
    };

    const _destTokenDetails = {
      token: activeRoute?.toAsset || selectedRoute?.path?.toToken,
      amount: activeRoute?.toAmount || selectedRoute?.route?.toAmount,
    };

    const _currentRoute = {
      route: activeRoute || selectedRoute?.route,
      sourceTokenDetails: _sourceTokenDetails,
      destTokenDetails: _destTokenDetails,
      txData: activeRoute?.transactionData,
      refuel: activeRoute?.refuel || selectedRoute?.refuel,
    };

    setCurrentRoute(_currentRoute);
  }, [activeRoute, selectedRoute]); // the activeRoute is set before the txModal is opened.

  useEffect(() => {
    return () => {
      dispatch(setActiveRoute(null));
    };
  }, []);

  const refuelSourceToken = {
    amount: !!activeRoute
      ? activeRoute?.refuel?.fromAmount
      : selectedRoute?.refuel?.fromAmount,
    asset: !!activeRoute
      ? activeRoute?.refuel?.fromAsset
      : selectedRoute?.refuel?.fromAsset,
  };
  const refuelDestToken = {
    amount: !!activeRoute
      ? activeRoute?.refuel?.toAmount
      : selectedRoute?.refuel?.toAmount,
    asset: !!activeRoute
      ? activeRoute?.refuel?.toAsset
      : selectedRoute?.refuel?.toAsset,
  };

  const [modalTitle, setModalTitle] = useState<ReactElement>(null);
  useEffect(() => {
    const isSameChainSwap =
      currentRoute?.sourceTokenDetails?.token?.chainId ===
      currentRoute?.destTokenDetails?.token?.chainId;

    const _modalTitle = (
      <span className="skt-w-flex skt-w-items-center">
        {isSameChainSwap ? "Swap" : "Bridging"} transaction{" "}
        <span className="skt-w-text-xs skt-w-text-widget-primary skt-w-text-opacity-70 skt-w-font-normal skt-w-ml-1">
          {currentRoute?.route?.activeRouteId
            ? ` - #${currentRoute?.route?.activeRouteId}`
            : userTx?.activeRouteId
            ? ` - #${userTx?.activeRouteId}`
            : ""}
        </span>
      </span>
    );

    setModalTitle(_modalTitle);
  }, [currentRoute, userTx]);

  // To reinitiate the route when an error is caught
  function reinitiateRoute() {
    if (!!activeRoute || userTx?.activeRouteId) {
      continueRoute(null, userTx?.activeRouteId);
    } else startRoute();
    enableRetry(false);
  }

  // Update and refetch quote when the swap slippage is changed
  const swapTx = getSwapTx(currentRoute?.route, userTx?.userTxIndex);
  const { loading: isUpdating } = updateAndRefetch(
    currentRoute?.route?.activeRouteId ?? userTx?.activeRouteId,
    swapTx?.swapSlippage,
    userTx?.userTxIndex
  );

  // transactions details is used to pass the data to the integrators
  const [transactionDetailsData, setTransactoinDetailsData] =
    useState<transactionDetails | null>(null);

  useEffect(() => {
    // Filtering out bridge tx from userTxs.
    const bridgeTx = currentRoute?.route?.userTxs?.filter(
      (x) => x.userTxType === UserTxType.FUND_MOVR
    )?.[0];

    // Filtering out the bridge step from the steps in bridgeTx
    const bridgeStep = bridgeTx?.steps?.filter((x) => x.type === "bridge")?.[0];

    const data: transactionDetails = {
      sourceToken: currentRoute?.sourceTokenDetails?.token,
      sourceAmount: currentRoute?.sourceTokenDetails?.amount,
      destinationToken: currentRoute?.destTokenDetails?.token,
      destinationAmount: currentRoute?.destTokenDetails?.amount,
      bridgeName: bridgeStep?.protocol?.displayName,
      estimatedServiceTime: bridgeTx?.serviceTime,
      dexName: currentRoute?.route?.usedDexName,
      txData: currentRoute?.txData,
    };

    setTransactoinDetailsData(data);
  }, [currentRoute]);

  // When tx is completed, call the onBridge function
  useEffect(() => {
    if (!!onBridge && txCompleted) onBridge(transactionDetailsData);
  }, [txCompleted]);

  return (
    <Modal
      title={modalTitle}
      closeModal={closeTxModal}
      disableClose={isApproving || txInProgress}
      style={style}
    >
      <div className="skt-w skt-w-flex skt-w-flex-col skt-w-flex-1 skt-w-overflow-hidden skt-w-justify-between skt-w-relative">
        <div className="skt-w skt-w-flex-1 skt-w-overflow-y-auto">
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

          <div className="skt-w skt-w-px-3 skt-w-py-3">
            {!!swapTx && (
              <p className="skt-w skt-w-text-widget-primary skt-w-mb-3 skt-w-text-xs skt-w-flex skt-w-items-center skt-w-justify-end skt-w-pr-0.5">
                Swap slippage: {swapTx?.swapSlippage}%{" "}
                <button
                  onClick={() => dispatch(setIsSettingsModalOpen(true))}
                  className="skt-w skt-w-button skt-w-input skt-w-flex"
                >
                  <Edit className="skt-w-ml-2 skt-w-w-3 skt-w-h-3 skt-w-text-widget-accent" />
                </button>
              </p>
            )}
            <TxStepDetails
              activeRoute={currentRoute?.route}
              refuel={currentRoute?.refuel}
              txData={currentRoute?.txData}
              // Setting currentTxIndex to 0 when the txModal is opened for the 'first time'.
              currentTxIndex={
                userTx?.userTxIndex || activeRoute?.currentUserTxIndex || 0
              }
              inProgress={txInProgress || bridging}
              completed={txCompleted}
            />
          </div>
        </div>

        <div className="skt-w skt-w-p-3 skt-w-shrink-0">
          {!txCompleted && (
            <>
              {retryEnabled ? (
                <Button onClick={reinitiateRoute}>Retry</Button>
              ) : userTx && activeChain !== userTx?.chainId ? (
                <Button
                  onClick={switchNetwork}
                  disabled={initiating || isUpdating}
                  isLoading={initiating || isUpdating}
                >
                  {isUpdating
                    ? ButtonTexts.REFETCHING
                    : initiating
                    ? ButtonTexts.INITIATING
                    : `Switch chain to ${
                        allNetworks.filter(
                          (x) => x.chainId === userTx?.chainId
                        )?.[0]?.name
                      }`}
                </Button>
              ) : isApprovalRequired ? (
                <Button
                  onClick={submitApproval}
                  disabled={
                    !isApprovalRequired ||
                    isApproving ||
                    initiating ||
                    isUpdating
                  }
                  isLoading={isApproving || isUpdating || initiating}
                >
                  {isUpdating
                    ? ButtonTexts.REFETCHING
                    : initiating
                    ? ButtonTexts.CHECKING_APPROVAL
                    : isApproving
                    ? ButtonTexts.APPROVING
                    : isApprovalRequired
                    ? ButtonTexts.APPROVE
                    : ButtonTexts.APPROVAL_DONE}
                </Button>
              ) : (
                <Button
                  onClick={submitNextTx}
                  disabled={
                    isApprovalRequired ||
                    txInProgress ||
                    initiating ||
                    bridging ||
                    isUpdating
                  }
                  isLoading={txInProgress || isUpdating || initiating}
                >
                  {isUpdating
                    ? ButtonTexts.REFETCHING
                    : bridging
                    ? ButtonTexts.BRIDGE_IN_PROGRESS
                    : initiating
                    ? ButtonTexts.INITIATING
                    : txInProgress
                    ? ButtonTexts.IN_PROGRESS
                    : USER_TX_LABELS?.[userTx?.userTxType]}
                </Button>
              )}
            </>
          )}
        </div>

        {bridging && !initiating && (
          <BridgingLoader
            currentRoute={currentRoute}
            explorerParams={explorerParams}
            txDetails={txDetails?.[userAddress]?.[activeRoute?.activeRouteId]}
            refuelEnabled={!!currentRoute?.refuel}
          />
        )}

        {txCompleted && <SuccessToast />}
      </div>
    </Modal>
  );
};
