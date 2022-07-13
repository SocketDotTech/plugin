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

// hooks
import { useChains } from "../hooks/apis";
import { useTokenList } from "../hooks/useTokenList";
import { useCustomSettings } from "../hooks/useCustomSettings";

// actions
import { setTokenList } from "../state/tokensSlice";

// Main Widget -> Base file.
export const Widget = (props: WidgetProps) => {
  const dispatch = useDispatch();
  const { customize } = props;
  const customSettings = useContext(CustomizeContext);
  const web3Context = useContext(Web3Context);

  // Hook to get all supported chains.
  useChains();

  // Hook to set default settings in place, default from chain and to chain etc etc.
  useCustomSettings(props);

  // Hook to get the token list based on the source chain and dest chain.
  // Passing custom token list as argument
  const _tokenList = useTokenList(props.tokenList);
  useEffect(() => {
    dispatch(setTokenList(_tokenList));
  }, [_tokenList]);

  // run when the props are changed
  useEffect(() => {
    customSettings.setCustomization({
      ...customSettings.customization,
      ...customize,
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

    fetchData();
  }, [props]);

  // Customisation Settings for the widget.
  const { responsiveWidth, width, borderRadius } = customSettings.customization;

  const widgetWidth = responsiveWidth ? "100%" : width > 360 ? width : 360;
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);

  return (
    <div
      style={{
        width: widgetWidth,
        borderRadius: `calc(1rem * ${borderRadius})`,
      }}
      className="bg-widget-primary p-1 overflow-hidden relative"
    >
      <div className="p-3 pt-2.5 pb-3.5">
        <Header title="Bridge">
          <div className="flex items-center gap-3">
            <PendingTransactions />
            <Settings />
          </div>
        </Header>
        <Input customTokenList={props.tokenList} />
        <Output customTokenList={props.tokenList} />
      </div>
      <RouteDetails />
      {isTxModalOpen && <TxModal />}
      <ErrorModal />
    </div>
  );
};
