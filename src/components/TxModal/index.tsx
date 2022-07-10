import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { SocketTx } from "socket-v2-sdk";
import { ChevronRight } from "react-feather";

// components
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { TxStepDetails } from "./TxStepDetails";
import { TokenDetail } from "../common/TokenDetail";
import { BridgingLoader } from "./BridgingLoader";

// actions
import { setActiveRoute, setError, setIsTxModalOpen } from "../../state/modals";
import { setTxDetails } from "../../state/txDetails";

// hooks
import { socket, useActiveRoutes } from "../../hooks/apis";
import { handleNetworkChange } from "../../utils";

import { USER_TX_LABELS } from "../../consts/";
import { UserTxType } from "../../utils/UserTxType";

import { Web3Context } from "../../providers/Web3Provider";

export const TxModal = () => {
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
  const [explorerParams, setExplorerParams] = useState({
    txHash: "",
    chainId: "",
  });

  function changeNetwork() {
    const chain = allNetworks.filter((x) => x.chainId === userTx?.chainId)?.[0];
    handleNetworkChange(provider, chain);
  }

  async function confirmApproval() {
    setIsApproving(true);
    const approvalTx = await signer.sendTransaction(approvalTxData);
    await approvalTx.wait();
    setIsApproving(false);
    setIsApprovalRequired(false);
  }

  async function initiateExecution() {
    setInitiating(true);
    try {
      const execute = await socket.start(selectedRoute);
      await prepareNextStep(execute);
    } catch (e) {
      dispatch(setError(e.message));
    }
  }

  async function initiateContinuation(
    txHash?: string,
    _activeRouteId?: number
  ) {
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
      await prepareNextStep(
        execute,
        txHash || lastStep?.hash,
        lastStep?.userTxType
      );
    } catch (e) {
      const err = e.message;
      if (err.match("is already complete")) {
        setTxCompleted(true);
      } else {
        dispatch(setError(err));
      }
      setInitiating(false);
      setBridging(false);
      console.log("Error", e);
    }
  }

  // use the same tx as init if the 1st tx isn't completed
  async function doTransaction() {
    setTxInProgress(true);
    try {
      const sendTxData = await userTx.getSendTransaction();
      const sendTx = await signer.sendTransaction(sendTxData);

      // set data to localStorage
      dispatch(
        setTxDetails({
          account: userAddress,
          routeId: userTx.activeRouteId,
          stepIndex: userTx.userTxIndex,
          value: { hash: sendTx.hash, userTxType: userTx.userTxType },
        })
      );

      await sendTx.wait();
      setTxInProgress(false);

      // if tx is of type fund-movr, set bridging loader to true
      if (userTx.userTxType === UserTxType.FUND_MOVR) {
        setExplorerParams({
          txHash: sendTx.hash,
          chainId: selectedRoute?.path?.fromToken?.chainId,
        });
        setBridging(true);
      }

      const currentStatus = await userTx.submit(sendTx.hash);
      if (currentStatus && currentStatus !== "completed") {
        await initiateContinuation(userTx.hash, userTx.activeRouteId);
      } else if (currentStatus === "completed") {
        setTxCompleted(true);
        setBridging(false);
        mutateActiveRoutes();
      }
    } catch (e) {
      dispatch(setError(e.message));
      setBridging(false);
      setTxInProgress(false);
      console.log("Error", e);
    }
  }

  // Next transaction preparation
  const prepareNextStep = async (
    execute: AsyncGenerator<SocketTx, void, string>,
    txHash?: string,
    txType?: string
  ) => {
    // If the tx is of type 'fund-movr', set bridging to true.
    if (!bridging && txType === UserTxType.FUND_MOVR) {
      setExplorerParams({
        txHash: txHash,
        chainId:
          selectedRoute?.path?.fromToken?.chainId || activeRoute?.fromChainId,
      });
      setBridging(true);
      setInitiating(false);
    }

    try {
      const next = txHash ? await execute.next(txHash) : await execute.next();
      setBridging(false);

      if (!next.done && next.value) {
        const tx = next.value;
        setUserTx(tx); // used in doTransaction to get txData
        const _approvalTxData = await tx.getApproveTransaction();
        setInitiating(false);
        setApprovalTxData(_approvalTxData);
        if (_approvalTxData) setIsApprovalRequired(true);
      }

      if (next.done) {
        setInitiating(false);
        setTxCompleted(true);
      }
    } catch (e) {
      dispatch(setError(e.message));
      setBridging(false);
      setInitiating(false);
    }
  };

  useEffect(() => {
    if (!activeRoute) initiateExecution();
    else initiateContinuation();

    return () => {
      dispatch(setActiveRoute(null));
    };
  }, []); // the activeRoute is set before the txModal is opened.

  const sourceTokenDetails = {
    token: selectedRoute?.path?.fromToken || activeRoute?.fromAsset,
    amount: selectedRoute?.amount || activeRoute?.fromAmount,
  };

  const destTokenDetails = {
    token: selectedRoute?.path?.toToken || activeRoute?.toAsset,
    amount: selectedRoute?.route?.toAmount || activeRoute?.toAmount,
  };

  return (
    <Modal
      title="Bridging transaction"
      closeModal={isApproving ? null : closeTxModal}
      disableClose={isApproving || txInProgress}
    >
      <div className="flex flex-col flex-1 overflow-hidden justify-between relative">
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-between mt-5 items-center px-3 mb-2.5">
            <TokenDetail
              token={sourceTokenDetails.token}
              amount={sourceTokenDetails.amount}
            />
            <ChevronRight className="w-4 h-4 text-widget-secondary" />
            <TokenDetail
              token={destTokenDetails.token}
              amount={destTokenDetails.amount}
              rtl
            />
          </div>

          <div className="px-3 py-3">
            <TxStepDetails
              activeRoute={activeRoute || selectedRoute?.route}
              // Setting currentTxIndex to 0 when the txModal is opened for the 'first time'.
              currentTxIndex={
                userTx?.userTxIndex || activeRoute?.currentUserTxIndex || 0
              }
              inProgress={txInProgress || bridging}
              completed={txCompleted}
            />
          </div>
        </div>

        <div className="p-3 shrink-0">
          {!txCompleted && (
            <>
              {userTx && activeChain !== userTx?.chainId ? (
                <Button onClick={changeNetwork} disabled={initiating}>
                  {initiating
                    ? "Initiating..."
                    : `Switch chain to ${
                        allNetworks.filter(
                          (x) => x.chainId === userTx?.chainId
                        )?.[0]?.name
                      }`}
                </Button>
              ) : isApprovalRequired ? (
                <Button
                  onClick={confirmApproval}
                  disabled={!isApprovalRequired || isApproving}
                  isLoading={isApproving}
                >
                  {initiating
                    ? "Checking approval"
                    : isApproving
                    ? "Approving"
                    : isApprovalRequired
                    ? "Approve"
                    : "Approved"}
                </Button>
              ) : (
                <Button
                  onClick={doTransaction}
                  disabled={
                    isApprovalRequired || txInProgress || initiating || bridging
                  }
                  isLoading={txInProgress}
                >
                  {bridging
                    ? "Bridging in progress"
                    : initiating
                    ? "Initiating..."
                    : txInProgress
                    ? "In progress"
                    : USER_TX_LABELS?.[userTx?.userTxType]}
                </Button>
              )}
            </>
          )}
        </div>

        {bridging && !initiating && (
          <BridgingLoader
            source={sourceTokenDetails}
            dest={destTokenDetails}
            explorerParams={explorerParams}
          />
        )}
      </div>
    </Modal>
  );
};
