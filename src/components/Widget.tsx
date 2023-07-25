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
import { OpRewards, OpRewardsModal } from "./OpRewards";

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
  const {
    customize,
    title = props?.enableSameChainSwaps ? "Bridge & Swap" : "Bridge",
  } = props;
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
        const network = await props.provider.getNetwork();

        web3Context.setweb3Provider({
          userAddress: address,
          networkId: Number(network?.chainId),
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
      className="skt-w-relative skt-w-p-1 skt-w-overflow-hidden skt-w skt-w-root-container skt-w-bg-widget-primary"
    >
      <div className="skt-w skt-w-p-3 skt-w-pt-2.5 skt-w-pb-3.5">
        <Header title={title}>
          <div className="skt-w-flex skt-w-items-center skt-w">
            {!props?.provider ? (
              <span className="skt-w-flex skt-w-items-center skt-w-text-sm skt-w skt-w-text-widget-secondary">
                <CreditCard className="skt-w-w-5 skt-w-h-5 skt-w-mr-2 skt-w skt-w-text-widget-primary" />{" "}
                Please connect your wallet
              </span>
            ) : (
              <>
                <PendingTransactions />
                <OpRewards />
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
        {props.enableRefuel && (
          <Refuel selectivelyShowRefuel={props.selectivelyShowRefuel} />
        )}
      </div>
      <SingleTxMessage />
      <RouteDetails />
      {transitions(
        (style, item) =>
          item && (
            <TxModal
              style={style}
              onBridge={props?.onBridgeSuccess}
              onError={props?.onError}
              onSubmit={props?.onSubmit}
            />
          )
      )}
      <SettingsModal />
      <OpRewardsModal />
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
    return <p className="skt-w skt-w-h-5"></p>; // to prevent the layout shift
  return (
    <p className="skt-w skt-w-text-sm skt-w-text-widget-secondary skt-w-pr-3 skt-w-pl-3.5 skt-w-flex skt-w-items-center skt-w-h-5">
      Showing single transaction routes only{" "}
      {!singleTxOnlyFromDev && (
        <button
          onClick={openSettingsModal}
          className="skt-w skt-w-button skt-w-input skt-w-ml-1.5 skt-w-flex"
        >
          <Edit className="skt-w skt-w-w-3.5 skt-w-h-3.5 skt-w-text-widget-accent" />
        </button>
      )}
    </p>
  );
};
