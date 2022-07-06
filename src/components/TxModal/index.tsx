import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SocketTx } from "socket-v2-sdk";

// components
import { Modal } from "../Modal";
import { Button } from "../Button";
import { TxStepDetails } from "./TxStepDetails";

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
    const prevTxData = txDetails?.[address]?.[activeRoute?.activeRouteId];
    const keysArr = prevTxData && Object.keys(prevTxData);
    const lastStep = prevTxData?.[keysArr?.[keysArr?.length - 1]];

    if ((lastStep?.userTxType || txType) === UserTxType.FUND_MOVR)
      setBridging(true);
    else setInitiating(true);

    try {
      const execute = await socket.continue(activeRoute?.activeRouteId);
      await prepareNextStep(execute, txHash || lastStep.hash);
    } catch(e) {
      const err = e.message;
      if(err.match('is already complete')){
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

  const prepareNextStep = async ( // next tx preparation
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
    >
      <div className="flex flex-col justify-between flex-1">
        All details here <br />
        {selectedRoute?.route?.routeId}
        {activeRoute?.activeRouteId}
        <TxStepDetails activeRoute={activeRoute || selectedRoute?.route} />
        {initiating && <span className="text-white">initiating</span>}
        {txInProgress && <span className="text-white">tx is in progress</span>}
        {bridging && <span className="text-red-500">Bridging in progress</span>}
        {txCompleted && <span className="text-red-500">Tx is completed</span>}
        {!txCompleted && (
          <>
            {userTx && activeChain?.id !== userTx?.chainId ? (
              <Button onClick={changeNetwork}>
                {initiating
                  ? "Loading tx data"
                  : `Switch chain to ${
                      allNetworks.filter(
                        (x) => x.chainId === userTx?.chainId
                      )?.[0]?.name
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
                  disabled={
                    isApprovalRequired || txInProgress || initiating || bridging
                  }
                >
                  {txInProgress
                    ? "In progress"
                    : USER_TX_LABELS?.[userTx?.userTxType]}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
