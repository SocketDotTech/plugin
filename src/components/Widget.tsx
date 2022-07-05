import { useEffect } from "react";
import { WidgetProps } from "../utils/types";
import { useSelector } from "react-redux";

// context
import { useContext } from "react";
import { CustomizeContext } from "./CustomizeProvider";

// components
import { Header } from "./Header";
import { Input } from "./Input";
import { Output } from "./Output";
import { RouteDetails } from "./RouteDetails";
import { Settings } from "./Settings";
import { TxModal } from "./TxModal";
import { PendingTransactions } from "./PendingTransactions/pendingTransactions";

// hooks
import { useChains, useTokenList } from "../hooks/apis";
import { useNetwork, useAccount } from "wagmi";

export const Widget = (props: WidgetProps) => {
  const { customize } = props;
  const customSettings = useContext(CustomizeContext);

  useChains();
  useTokenList();
  const { chain } = useNetwork();
  const { address } = useAccount();

  // run only once
  useEffect(() => {
    customSettings.setCustomization({
      ...customSettings.customization,
      ...customize
    });
  }, []);

  const { responsiveWidth, width, borderRadius } = customSettings.customization;

  const widgetWidth = responsiveWidth ? "100%" : width > 300 ? width : 300;
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);

  return (
    <div
      style={{
        width: widgetWidth,
        borderRadius: `calc(1rem * ${borderRadius})`,
      }}
      className={`bg-gray-200 p-3 overflow-hidden relative`}
    >
      <Header title="Bridge">
        <div className="flex items-center gap-3">
          <PendingTransactions />
          <Settings />
        </div>
      </Header>
      <Input />
      <Output />
      <RouteDetails />
      {isTxModalOpen && <TxModal />}
      {chain?.name}
      <br />
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </div>
  );
};
