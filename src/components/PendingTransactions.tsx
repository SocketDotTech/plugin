import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActiveRouteResponse } from "socket-v2-sdk";
import { CustomizeContext } from "../providers/CustomizeProvider";

// components
import { Modal } from "./common/Modal";

// actions
import { setActiveRoute, setIsTxModalOpen } from "../state/modals";

import { useActiveRoutes } from "../hooks/apis";
import { useTransition } from "@react-spring/web";
import { TokenDetailsRow } from "./common/TokenDetailsRow";

// Pending Transactions are basically routes that have not been completed yet. User can continue from the previous step whenever he opens the modal again.
export const PendingTransactions = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeRoutes, setActiveRoutes] = useState<ActiveRouteResponse[]>(null);
  const [totalRoutes, setTotalRoutes] = useState<number>(0);
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  const transitions = useTransition(isModalOpen, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    config: { duration: 200 },
    onReset: () => setIsModalOpen(false),
  });

  // Hook that fetches the routes that are active (routes that have started but have not been completed yet.)
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

  if (totalRoutes > 0)
    return (
      <>
        <button
          className="uppercase text-sm px-2 py-0.5 bg-widget-accent shadow-inner bg-opacity-90 text-widget-onAccent"
          onClick={() => setIsModalOpen(true)}
          style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
        >
          {totalRoutes} pending
        </button>

        {transitions(
          (style, item) =>
            item && (
              <Modal
                title="Pending Transactions"
                closeModal={() => setIsModalOpen(false)}
                style={style}
              >
                <div className="flex flex-col justify-start p-1 flex-1 overflow-y-auto">
                  {activeRoutes?.map((route: any) => {
                    const refuelSourceToken = {
                      amount: route?.refuel?.fromAmount,
                      asset: route?.refuel?.fromAsset,
                    };
                    const refuelDestToken = {
                      amount: route?.refuel?.toAmount,
                      asset: route?.refuel?.toAsset,
                    };

                    return (
                      <TokenDetailsRow
                        key={route?.activeRouteId}
                        onClick={() => openTxModal(route)}
                        srcDetails={{
                          token: route?.fromAsset,
                          amount: route?.fromAmount,
                        }}
                        destDetails={{
                          token: route?.toAsset,
                          amount: route?.toAmount,
                        }}
                        srcRefuel={refuelSourceToken}
                        destRefuel={refuelDestToken}
                      />
                    );
                  })}

                  <p className="text-widget-secondary text-xs px-3 py-2 text-left">
                    Showing {activeRoutes?.length}/{totalRoutes} active routes
                  </p>
                </div>
              </Modal>
            )
        )}
      </>
    );
  else return null;
};
