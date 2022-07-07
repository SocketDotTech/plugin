import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SocketTx } from "socket-v2-sdk";
import { ChevronRight } from "react-feather";

// components
import { Modal } from "../Modal";
import { Button } from "../Button";
import { TxStepDetails } from "./TxStepDetails";
import { TokenDetail } from "../TokenDetail";

// actions
import { setActiveRoute, setIsTxModalOpen } from "../../state/modals";
import { setTxDetails } from "../../state/txDetails";

// hooks
import { socket } from "../../hooks/apis";
import { useSigner, useNetwork, useProvider, useAccount } from "wagmi";
import { handleNetworkChange } from "../../utils";

import { USER_TX_LABELS } from "../../consts/";
import { UserTxType } from "../../utils/UserTxType";

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

  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const provider = useProvider();

  const [initiating, setInitiating] = useState<boolean>(false);
  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [bridging, setBridging] = useState<boolean>(false);
  const [txCompleted, setTxCompleted] = useState<boolean>(false);

  const [approvalTxData, setApprovalTxData] = useState<any>(null);
  const [userTx, setUserTx] = useState(null);

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
    const execute = await socket.start(selectedRoute);
    await prepareNextStep(execute);
  }

  async function initiateContinuation(txType?: string, txHash?: string) {
    // in normal flow, txType and txHash will be passed. 
    // when continuing from tx history section, prevTxData from the localStorage will be fetched
    const prevTxData = txDetails?.[address]?.[activeRoute?.activeRouteId];
    const keysArr = prevTxData && Object.keys(prevTxData);
    const lastStep = prevTxData?.[keysArr?.[keysArr?.length - 1]];

    if ((lastStep?.userTxType || txType) === UserTxType.FUND_MOVR) {
      if (!selectedRoute) setInitiating(true);
      else setBridging(true);
    } else setInitiating(true);

    try {
      const execute = await socket.continue(activeRoute?.activeRouteId);
      await prepareNextStep(execute, txHash || lastStep.hash);
    } catch (e) {
      const err = e.message;
      if (err.match("is already complete")) {
        setTxCompleted(true);
      }
      setInitiating(false);
      setBridging(false);
    }
  }

  // use the same tx as init if the 1st tx isn't completed
  async function doTransaction() {
    setTxInProgress(true);
    const sendTxData = await userTx.getSendTransaction(); // txData => userTx
    const sendTx = await signer.sendTransaction(sendTxData);

    // set data to localStorage
    dispatch(
      setTxDetails({
        account: address,
        routeId: userTx.activeRouteId,
        stepIndex: userTx.userTxIndex,
        value: { hash: sendTx.hash, userTxType: userTx.userTxType },
      })
    );

    await sendTx.wait();
    setTxInProgress(false);

    // if tx is of type fund-movr, set bridging loader to true
    if (userTx.userTxType === UserTxType.FUND_MOVR) {
      setBridging(true);
    }

    const currentStatus = await userTx.submit(sendTx.hash);

    if (currentStatus && currentStatus !== "completed") {
      await initiateContinuation(userTx.userTxType, userTx.hash);
    } else if (currentStatus === "completed") {
      setTxCompleted(true);
      setBridging(false);
    }
  }

  const prepareNextStep = async (
    // next tx preparation
    execute: AsyncGenerator<SocketTx, void, string>,
    txHash?: string
  ) => {
    let next = txHash ? await execute.next(txHash) : await execute.next();
    setBridging(false);

    if (!next.done && next.value) {
      const tx = next.value;
      setUserTx(tx);
      const _approvalTxData = await tx.getApproveTransaction();
      setInitiating(false);
      setApprovalTxData(_approvalTxData);
      if (_approvalTxData) setIsApprovalRequired(true);
    }

    if (next.done) {
      setInitiating(false);
      setTxCompleted(true);
    }
  };

  useEffect(() => {
    if (!activeRoute) initiateExecution();
    else initiateContinuation();

    return () => {
      dispatch(setActiveRoute(null));
    };
  }, []); // the activeRoute is set before the txModal is opened.

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
              token={selectedRoute?.path?.fromToken || activeRoute?.fromAsset}
              amount={selectedRoute?.amount || activeRoute?.fromAmount}
            />
            <ChevronRight className="w-4 h-4 text-widget-secondary" />
            <TokenDetail
              token={selectedRoute?.path?.toToken || activeRoute?.toAsset}
              amount={selectedRoute?.route?.toAmount || activeRoute?.toAmount}
              rtl
            />
          </div>

          <div className="px-3 py-3">
            <TxStepDetails
              activeRoute={activeRoute || selectedRoute?.route}
              currentTxIndex={userTx?.userTxIndex}
              inProgress={txInProgress || bridging}
            />
          </div>
        </div>
        
        <div className="p-3 shrink-0">
          {!txCompleted && (
            <>
              {userTx && activeChain?.id !== userTx?.chainId ? (
                <Button onClick={changeNetwork}>
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

        {/* {!bridging && <BridgingLoader />} */}
      </div>
    </Modal>
  );
};

const BridgingLoader = () => {
  return (
    <div className="absolute bg-widget-primary h-full w-full top-0 left-0 px-3">
      Bridging in progress
    </div>
  );
};
