import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActiveRouteResponse } from "@socket.tech/socket-v2-sdk";
import { CustomizeContext } from "../providers/CustomizeProvider";

// components
import { Modal } from "./common/Modal";

// actions
import { setActiveRoute, setIsTxModalOpen } from "../state/modals";

import { usePendingRoutes } from "../hooks/apis";
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
  const { data: activeRoutesData } = usePendingRoutes();

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
          className="skt-w skt-w-button skt-w-input skt-w-uppercase skt-w-text-sm skt-w-px-2 skt-w-py-0.5 skt-w-bg-widget-accent skt-w-shadow-inner skt-w-bg-opacity-90 skt-w-text-widget-onAccent"
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
                <div className="skt-w skt-w-flex skt-w-flex-col skt-w-justify-start skt-w-p-1 skt-w-flex-1 skt-w-overflow-y-auto">
                  <p className="skt-w skt-w-text-widget-secondary skt-w-text-xs skt-w-px-3 skt-w-py-2 skt-w-text-left">
                    Transaction status is updated every 30 seconds
                  </p>

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

                  <p className="skt-w skt-w-text-widget-secondary skt-w-text-xs skt-w-px-3 skt-w-py-2 skt-w-text-left">
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
