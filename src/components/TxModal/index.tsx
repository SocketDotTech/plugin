import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SocketTx } from "socket-v2-sdk";

// components
import { Modal } from "../Modal";
import { Button } from "../Button";
import { TxStepDetails } from "./TxStepDetails";

// actions
import { setActiveRoute, setIsTxModalOpen } from "../../state/modals";

// hooks
import { socket } from "../../hooks/apis";
import { useSigner, useNetwork, useProvider } from "wagmi";
import { handleNetworkChange } from "../../utils";

import { USER_TX_LABELS } from "../../consts/";

export const TxModal = () => {
  const dispatch = useDispatch();
  function closeTxModal() {
    dispatch(setIsTxModalOpen(false));
  }

  const selectedRoute = useSelector((state: any) => state.routes.selectedRoute);
  const activeRoute = useSelector((state: any) => state.modals.activeRoute);
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);

  const { chain: activeChain } = useNetwork();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [initiating, setInitiating] = useState<boolean>(false);
  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [txInProgress, setTxInProgress] = useState<boolean>(false);
  const [bridging, setBridging] = useState<boolean>(false);

  const [approvalTxData, setApprovalTxData] = useState<any>(null);
  const [txData, setTxData] = useState<SocketTx | void>(null);

  async function initiateExecution() {
    setInitiating(true);
    const execute = await socket.start(selectedRoute);
    const next: IteratorResult<SocketTx, void> = await execute.next();

    const tx = next.value;
    setTxData(tx);

    const _approvalTxData = await tx.getApproveTransaction();

    setApprovalTxData(_approvalTxData);
    setInitiating(false);

    if (_approvalTxData) setIsApprovalRequired(true);
  }

  async function initiateContinuation() {
    setInitiating(true);
    const execute = await socket.continue(activeRoute?.activeRouteId);

    const prevTxIndex =
      activeRoute.currentUserTxIndex > 0
        ? activeRoute.currentUserTxIndex - 1
        : 0;
    const txHash = activeRoute.transactionData[prevTxIndex];

    const next = await execute.next(txHash);
    setInitiating(false);

    const tx = next.value;
    setTxData(tx);

    const _approvalTxData = await tx.getApproveTransaction();
    setApprovalTxData(_approvalTxData);

    if (_approvalTxData) setIsApprovalRequired(true);
  }

  async function confirmApproval() {
    setIsApproving(true);
    const approvalTx = await signer.sendTransaction(approvalTxData);
    await approvalTx.wait();
    setIsApproving(false);
    setIsApprovalRequired(false);
  }

  useEffect(() => {
    if (!activeRoute) initiateExecution();
    else {
      // edge case : initiate execution if the transaction data is null
      if (!!activeRoute?.transactionData) initiateContinuation();
    }

    return () => {
      dispatch(setActiveRoute(null));
    };
  }, []); // the activeRoute is set before the txModal is opened.

  // use the same tx as init if the 1st tx isn't completed
  async function doTransaction() {
    setTxInProgress(true);
    const sendTxData = await txData.getSendTransaction();
    const sendTx = await signer.sendTransaction(sendTxData);
    await sendTx.wait();
    setTxInProgress(false);

    // calling again.
    const execute = await socket.continue(activeRoute?.activeRouteId);

    setBridging(true);
    const next = await execute.next(sendTx.hash);
    setBridging(false);
    setTxData(next.value);
  }

  function changeNetwork() {
    const chain = allNetworks.filter((x) => x.chainId === txData?.chainId)?.[0];
    handleNetworkChange(provider, chain);
  }

  function actionBtnLabel() {
    return txInProgress ? "tx in progress" : USER_TX_LABELS[txData?.userTxType];
  }

  return (
    <Modal
      title="Bridging transaction"
      closeModal={isApproving ? null : closeTxModal}
    >
      <div className="flex flex-col justify-between flex-1">
        All details here <br />
        {selectedRoute?.route?.routeId}
        {activeRoute?.activeRouteId}
        <TxStepDetails activeRoute={activeRoute || selectedRoute?.route} />
        {bridging && <span className="text-red-500">Bridging in progress</span>}
        {activeChain?.id !== txData?.chainId ? (
          <Button onClick={changeNetwork}>
            {initiating
              ? "Loading tx data"
              : `Switch chain to ${
                  allNetworks.filter((x) => x.chainId === txData?.chainId)?.[0]
                    ?.name
                }`}
          </Button>
        ) : (
          <div className="flex bg-white p-2 rounded gap-2">
            <Button
              onClick={confirmApproval}
              disabled={!isApprovalRequired || isApproving}
            >
              {initiating
                ? "Checking approval"
                : isApproving
                ? "Approving"
                : isApprovalRequired
                ? "Approve"
                : "Approved"}
            </Button>
            <Button
              onClick={doTransaction}
              disabled={isApprovalRequired || txInProgress}
            >
              {actionBtnLabel()}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
