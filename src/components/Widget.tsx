import { useEffect } from "react";
import { WidgetProps } from "../types";
import { useDispatch, useSelector } from "react-redux";

// context
import { useContext } from "react";
import { CustomizeContext } from "../providers/CustomizeProvider";
import { Web3Context } from "../providers/Web3Provider";

// components
import { Header } from "./common/Header";
import { Input } from "./Input";
import { Output } from "./Output";
import { RouteDetails } from "./RouteDetails";
import { Settings } from "./Settings";
import { TxModal } from "./TxModal";
import { PendingTransactions } from "./PendingTransactions";
import { ErrorModal } from "./common/ErrorModal";
import { Refuel } from "./Refuel";
import { SettingsModal } from "./Settings/SettingsModal";

// hooks
import { useChains } from "../hooks/apis";
import { useCustomSettings } from "../hooks/useCustomSettings";
import { CreditCard, Edit } from "react-feather";
import { useTransition } from "@react-spring/web";
import {
  setActiveRoute,
  setError,
  setIsSettingsModalOpen,
  setIsTxModalOpen,
} from "../state/modals";
import { setSourceAmount } from "../state/amountSlice";

// Main Widget -> Base file.
export const Widget = (props: WidgetProps) => {
  const { customize, enableSameChainSwaps } = props;
  const title =
    customize?.title ?? (enableSameChainSwaps ? "Bridge & Swap" : "Bridge");

  const customSettings = useContext(CustomizeContext);
  const web3Context = useContext(Web3Context);
  const dispatch = useDispatch();

  // Hook to get all supported chains.
  useChains();

  // Hook to set default settings in place, default from chain and to chain etc etc.
  useCustomSettings(props);

  // run when the props are changed
  useEffect(() => {
    // If border radius passed is greater than 1.2, set it to 1.2. Default value is 1
    const _borderRadius =
      customize?.borderRadius !== undefined
        ? customize?.borderRadius > 1.2
          ? 1.2
          : customize?.borderRadius
        : 1;

    customSettings.setCustomization({
      ...customSettings.customization,
      ...customize,
      borderRadius: _borderRadius,
    });

    // settings web3Provider data
    async function fetchData() {
      try {
        const signer = await props.provider.getSigner();
        const address = await signer.getAddress();
        const chainId = await signer.getChainId();

        web3Context.setweb3Provider({
          userAddress: address,
          networkId: chainId,
          signer,
          provider: props.provider,
        });
      } catch (e) {
        console.log("Error", e);
      }
    }

    props?.provider && fetchData();
  }, [props]);

  // Customisation Settings for the widget.
  const { responsiveWidth, width, borderRadius } = customSettings.customization;

  const widgetWidth = responsiveWidth ? "100%" : width > 360 ? width : 360;
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);

  const transitions = useTransition(isTxModalOpen, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    delay: 300,
    config: { duration: 300 },
  });

  // resetting states on unmount
  useEffect(() => {
    return () => {
      dispatch(setIsTxModalOpen(false));
      dispatch(setActiveRoute(null));
      dispatch(setSourceAmount(null));
      dispatch(setError(null));
    };
  }, []);

  return (
    <div
      style={{
        width: widgetWidth,
        borderRadius: `calc(1rem * ${borderRadius})`,
        minWidth: "360px",
      }}
      className="relative p-1 overflow-hidden skt-w skt-w-container bg-widget-primary"
    >
      <div className="skt-w p-3 pt-2.5 pb-3.5">
        <Header title={title}>
          <div className="flex items-center skt-w">
            {!props?.provider ? (
              <span className="flex items-center text-sm skt-w text-widget-secondary">
                <CreditCard className="w-5 h-5 mr-2 skt-w text-widget-primary" />{" "}
                Please connect your wallet
              </span>
            ) : (
              <>
                <PendingTransactions />
                <Settings />
              </>
            )}
          </div>
        </Header>
        <Input
          customTokenList={props.tokenList}
          onTokenChange={props.onSourceTokenChange}
          onNetworkChange={props.onSourceNetworkChange}
        />
        <Output
          customTokenList={props.tokenList}
          onTokenChange={props.onDestinationTokenChange}
          onNetworkChange={props.onDestinationNetworkChange}
        />
        {props.enableRefuel && <Refuel />}
      </div>
      <SingleTxMessage />
      <RouteDetails />
      {transitions(
        (style, item) =>
          item && <TxModal style={style} onBridge={props?.onBridgeSuccess} onError={props?.onError} onSubmit={props?.onSubmit}/>
      )}
      <SettingsModal />
      <ErrorModal />
    </div>
  );
};

const SingleTxMessage = () => {
  const singleTxOnly = useSelector((state: any) => state.quotes.singleTxOnly); // this state changes on user input
  const singleTxOnlyFromDev = useSelector(
    (state: any) => state.customSettings.singleTxOnly
  ); // this is set by the developer in the plugin config
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const dispatch = useDispatch();

  function openSettingsModal() {
    dispatch(setIsSettingsModalOpen(true));
  }

  if (!singleTxOnly || sourceChainId === destChainId)
    return <p className="skt-w h-5"></p>; // to prevent the layout shift
  return (
    <p className="skt-w text-sm text-widget-secondary pr-3 pl-3.5 flex items-center h-5">
      Showing single transaction routes only{" "}
      {!singleTxOnlyFromDev && (
        <button
          onClick={openSettingsModal}
          className="skt-w skt-w-button skt-w-input ml-1.5 flex"
        >
          <Edit className="skt-w w-3.5 h-3.5 text-widget-accent" />
        </button>
      )}
    </p>
  );
};
