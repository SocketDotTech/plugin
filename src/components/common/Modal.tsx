import { animated } from "@react-spring/web";
import { ReactElement, ReactNode, useContext } from "react";
import { X } from "react-feather";
import { CustomizeContext } from "../../providers/CustomizeProvider";
import { Header } from "./Header";
interface ModalProps {
  title: ReactElement | string;
  closeModal?: () => void;
  children: ReactNode;
  disableClose?: boolean;
  classNames?: string;
  style?: any;
}
export const Modal = ({
  title,
  closeModal,
  children,
  disableClose = false,
  classNames,
  style
}: ModalProps) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <animated.div style={style} className="skt-w p-1 w-full h-full absolute top-0 left-0 z-50 bg-black bg-opacity-10">
      <div
        className={`skt-w w-full h-full bg-widget-primary flex flex-col overflow-hidden ${
          classNames ?? ""
        }`}
        style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
      >
        <div className="skt-w p-3 pt-2.5 border-b border-widget-secondary">
          <Header title={title}>
            {closeModal && (
              <button
                onClick={closeModal}
                disabled={disableClose}
                className="skt-w skt-w-input skt-w-button disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <X className="skt-w w-5.5 h-5.5 text-widget-secondary" />
              </button>
            )}
          </Header>
        </div>
        {children}
      </div>
    </animated.div>
  );
};
