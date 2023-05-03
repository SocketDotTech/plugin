import { useTransition } from "@react-spring/web";
import { useDispatch, useSelector } from "react-redux";
import { setIsSettingsModalOpen } from "../../state/modals";

// components
import { Modal } from "../common/Modal";
import { SwapSlippage } from "./SwapSlippage";
import { SortPreference } from "./SortPreference";
import { SingleTx } from "./SingleTx";

export const SettingsModal = () => {
  const dispatch = useDispatch();

  const isSettingsOpen = useSelector(
    (state: any) => state.modals.isSettingsModalOpen
  );

  const transitions = useTransition(isSettingsOpen, {
    from: { y: "100%" },
    enter: { y: "0" },
    leave: { y: "100%" },
    config: { duration: 200 },
    onReset: () => toggleSettingsModal(false),
  });

  const toggleSettingsModal = (value: boolean) => {
    dispatch(setIsSettingsModalOpen(value));
  };

  return (
    <>
      {transitions(
        (style, item) =>
          item && (
            <Modal
              title="Settings"
              closeModal={() => toggleSettingsModal(false)}
              style={style}
              classNames="skt-w-z-50"
            >
              <div className="skt-w skt-w-px-3 skt-w-pt-3">
                {/* Sort options */}
                <SortPreference />

                {/* Single tx checkbox */}
                <SingleTx />

                {/* Swap Slippage */}
                <SwapSlippage />
              </div>
            </Modal>
          )
      )}
    </>
  );
};
