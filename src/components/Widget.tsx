import { useEffect } from "react";
import { Customize } from "../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setDevProps } from "../state/devPropsSlice";

// components
import { Header } from "./Header";
import { Input } from "./Input";
import { Output } from "./Output";
import { RouteDetails } from "./RouteDetails";
import { Settings } from "./Settings";
import { TxModal } from "./TxModal";

// hooks
import { useChains, useTokenList } from "../hooks/apis";
import { useNetwork, useAccount } from "wagmi";
import { PendingTransactions } from "./PendingTransactions/pendingTransactions";

export const Widget = ({ customize }: { customize: Customize }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDevProps(customize));
  }, []);

  useChains();
  useTokenList();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const {
    width = 380,
    responsiveWidth = false,
    theme = {
      borderRadius: 1,
    },
  } = customize;

  const widgetWidth = responsiveWidth ? "100%" : width > 300 ? width : 300;
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);

  return (
    <div
      style={{
        width: widgetWidth,
        borderRadius: `calc(1rem * ${theme.borderRadius})`,
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
