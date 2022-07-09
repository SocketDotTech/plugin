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
import { ErrorModal } from "./ErrorModal";

export const Widget = (props: WidgetProps) => {
  const { customize } = props;
  const customSettings = useContext(CustomizeContext);

  useChains();
  useTokenList();

  // run only once
  useEffect(() => {
    customSettings.setCustomization({
      ...customSettings.customization,
      ...customize,
    });
  }, []);

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
        <Input />
        <Output />
      </div>
      <RouteDetails />
      {isTxModalOpen && <TxModal />}
      <ErrorModal />
    </div>
  );
};
