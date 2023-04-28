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
  style,
}: ModalProps) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <animated.div
      style={style}
      className="skt-w skt-w-p-1 skt-w-w-full skt-w-h-full skt-w-absolute skt-w-top-0 skt-w-left-0 skt-w-z-50 skt-w-bg-black skt-w-bg-opacity-10"
    >
      <div
        className={`skt-w skt-w-w-full skt-w-h-full skt-w-bg-widget-primary skt-w-flex skt-w-flex-col skt-w-overflow-hidden ${
          classNames ?? ""
        }`}
        style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
      >
        <div className="skt-w skt-w-p-3 skt-w-pt-2.5 skt-w-border-b skt-w-border-widget-secondary">
          <Header title={title}>
            {closeModal && (
              <button
                onClick={closeModal}
                disabled={disableClose}
                className="skt-w skt-w-input skt-w-button disabled:skt-w-opacity-20 disabled:skt-w-cursor-not-allowed"
              >
                <X className="skt-w skt-w-w-5.5 skt-w-h-5.5 skt-w-text-widget-secondary" />
              </button>
            )}
          </Header>
        </div>
        {children}
      </div>
    </animated.div>
  );
};
