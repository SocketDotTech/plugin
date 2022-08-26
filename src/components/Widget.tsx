import { useEffect } from "react";
import { WidgetProps } from "../types";
import { useSelector } from "react-redux";

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

// hooks
import { useChains } from "../hooks/apis";
import { useCustomSettings } from "../hooks/useCustomSettings";
import { CreditCard } from "react-feather";
import { useTransition } from "@react-spring/web";

// Main Widget -> Base file.
export const Widget = (props: WidgetProps) => {
  const {
    customize,
    title = props.enableSameChainSwaps ? "Bridge & Swap" : "Bridge",
  } = props;
  const customSettings = useContext(CustomizeContext);
  const web3Context = useContext(Web3Context);

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
          <div className="flex items-center gap-3 skt-w">
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
        <Input customTokenList={props.tokenList} />
        <Output customTokenList={props.tokenList} />
        {props.enableRefuel && <Refuel />}
      </div>
      <RouteDetails />
      {transitions((style, item) => item && <TxModal style={style} />)}
      <ErrorModal />
    </div>
  );
};
