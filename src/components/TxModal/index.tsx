import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { SocketTx } from "socket-v2-sdk";

// components
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { TxStepDetails } from "./TxStepDetails";
import { BridgingLoader } from "./BridgingLoader";
import { Stepper } from "../common/Stepper";

// actions
import { setActiveRoute, setError, setIsTxModalOpen } from "../../state/modals";
import { setTxDetails } from "../../state/txDetails";

// hooks
import { socket, useActiveRoutes } from "../../hooks/apis";
import { handleNetworkChange } from "../../utils";

import {
  USER_TX_LABELS,
  UserTxType,
  PrepareTxStatus,
  ButtonTexts,
} from "../../consts/";

import { Web3Context } from "../../providers/Web3Provider";
import { SuccessToast } from "./SuccessToast";
import { TokenDetailsRow } from "../common/TokenDetailsRow";

// The main modal that contains all the information related after clicking on review quote.
// Responsible for the progression of the route.
// Functions responsible for sending a transaction and checking the status of the route.
export const TxModal = ({ style }) => {
  const dispatch = useDispatch();
  function closeTxModal() {
    dispatch(setIsTxModalOpen(false));
  }

  // When the tx modal is opened from the tx-history(pending) section, selectedRoute will be set to null & activeRoute will be truthy
  // If the tx modal is opened in the normal user flow, the selected route will be truthy and activeRoute will be null
  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);
  const activeRoute = useSelector((state: any) => state.modals.activeRoute);
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

  const [approvalTxData, setApprovalTxData] = useState<any>(null);
  const [userTx, setUserTx] = useState(null);
  const { mutate: mutateActiveRoutes } = useActiveRoutes();
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
    }
  }

  // Function that lets the user continue the route from the previous transaction when he reopens the widget.
  async function continueRoute(txHash?: string, _activeRouteId?: number) {
    setInitiating(true);
    // in normal flow, txType and activeRouteId  will be passed.
    // when continuing from tx history section, prevTxData from the localStorage will be fetched;
    const prevTxData = txDetails?.[userAddress]?.[activeRoute?.activeRouteId];
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
      }
      setInitiating(false);
      setBridging(false);
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
      const currentStatus = await userTx.submit(sendTx.hash);

      // If current status is completed mark route as completed else continue the route.
      if (currentStatus && currentStatus !== PrepareTxStatus.COMPLETED) {
        await continueRoute(userTx.hash, userTx.activeRouteId);
      } else if (currentStatus === PrepareTxStatus.COMPLETED) {
        setTxCompleted(true);
        setBridging(false);
        mutateActiveRoutes();
      }
    } catch (e) {
      const err = e?.data?.message?.toLowerCase() || e.message.toLowerCase();
      let errMessage: string;

      if (err.match("execution reverted: middleware_action_failed")) {
        errMessage =
          "Swap failed due to slippage or low DEX liquidity, please retry or contact support";
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
      setBridging(false);
      setTxInProgress(false);
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

      setExplorerParams({
        srcTxHash: txHash,
        srcChainId:
          activeRoute?.fromChainId || selectedRoute?.path?.fromToken?.chainId,
        destChainId:
          activeRoute?.toChainId || selectedRoute?.path?.toToken?.chainId,
        destTxHash: bridgeTx?.destinationTxHash,
        destRefuelTxHash: bridgeTx?.refuelDestinationHash,
      });

      setBridging(true);
      setInitiating(false);
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
      if (e) dispatch(setError(e.message));
      setBridging(false);
      setInitiating(false);
    }
  };

  // Current route is either activeRoute or selectedRoute
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    if (!activeRoute) startRoute();
    else continueRoute();

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

    return () => {
      dispatch(setActiveRoute(null));
    };
  }, []); // the activeRoute is set before the txModal is opened.

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

  return (
    <Modal
      title="Bridging transaction"
      closeModal={closeTxModal}
      disableClose={isApproving || txInProgress}
      style={style}
    >
      <div className="skt-w flex flex-col flex-1 overflow-hidden justify-between relative">
        <div className="skt-w flex-1 overflow-y-auto">
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
                currentTx={
                  userTx?.userTxIndex || activeRoute?.currentUserTxIndex || 0
                }
                userTxs={currentRoute?.route?.userTxs}
              />
            </div>
          )}

          <div className="skt-w px-3 py-3">
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

        <div className="skt-w p-3 shrink-0">
          {!txCompleted && (
            <>
              {userTx && activeChain !== userTx?.chainId ? (
                <Button onClick={switchNetwork} disabled={initiating}>
                  {initiating
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
                  disabled={!isApprovalRequired || isApproving}
                  isLoading={isApproving}
                >
                  {initiating
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
                    isApprovalRequired || txInProgress || initiating || bridging
                  }
                  isLoading={txInProgress}
                >
                  {bridging
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
          />
        )}

        {txCompleted && <SuccessToast />}
      </div>
    </Modal>
  );
};
