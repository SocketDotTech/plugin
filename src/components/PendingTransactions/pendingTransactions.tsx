import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActiveRouteResponse } from "socket-v2-sdk";
import { useAccount } from "wagmi";
import { CustomizeContext } from "../CustomizeProvider";

// components
import { Modal } from "../Modal";

// actions
import { setActiveRoute, setIsTxModalOpen } from "../../state/modals";

import { useActiveRoutes } from "../../hooks/apis";

export const PendingTransactions = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeRoutes, setActiveRoutes] = useState<ActiveRouteResponse[]>(null);
  const [totalRoutes, setTotalRoutes] = useState<number>(0);
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  const { data: activeRoutesData } = useActiveRoutes();

  useEffect(() => {
    if (activeRoutesData) {
      setTotalRoutes(activeRoutesData?.result?.pagination?.totalRecords);
      setActiveRoutes(activeRoutesData?.result?.activeRoutes);
    }
  }, [activeRoutesData]);

  function openTxModal(route) {
    dispatch(setActiveRoute(route));
    dispatch(setIsTxModalOpen(true));
    setIsModalOpen(false);
  }

  if (isModalOpen) {
    return (
      <Modal
        title="Pending Transactions"
        closeModal={() => setIsModalOpen(false)}
      >
        All pending txs will be displayed here
        <div className="flex flex-col justify-start">
          {activeRoutes?.map((route: ActiveRouteResponse) => {
            return (
              <button
                onClick={() => openTxModal(route)}
                className="hover:bg-gray-200 rounded p-1 w-auto"
                key={route?.activeRouteId}
              >
                {route?.activeRouteId}
              </button>
            );
          })}
        </div>
      </Modal>
    );
  }

  if (totalRoutes > 0)
    return (
      <button
        className="uppercase text-widget-theme text-sm px-2 py-0.5 bg-widget-theme bg-opacity-10"
        onClick={() => setIsModalOpen(true)}
        style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
      >
        {totalRoutes} pending
      </button>
    );
  else return null;
};
