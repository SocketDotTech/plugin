import { ReactElement, ReactNode, useContext } from "react";
import { X } from "react-feather";
import { CustomizeContext } from "./CustomizeProvider";
import { Header } from "./Header";
interface ModalProps {
  title: ReactElement | string;
  closeModal: () => void;
  children: ReactNode;
  disableClose?: boolean;
  classNames?: string;
}
export const Modal = ({
  title,
  closeModal,
  children,
  disableClose = false,
  classNames,
}: ModalProps) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div className="p-1 w-full h-full absolute top-0 left-0 z-50 bg-black bg-opacity-10">
      <div
        className={`w-full h-full bg-widget-primary flex flex-col ${
          classNames ?? ""
        }`}
        style={{ borderRadius: `calc(0.75rem * ${borderRadius})` }}
      >
        <div className="p-3 pt-2.5 border-b border-widget-secondary">
          <Header title={title}>
            <button
              onClick={closeModal}
              disabled={disableClose}
              className="disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <X className="w-5.5 h-5.5 text-widget-secondary" />
            </button>
          </Header>
        </div>
        {children}
      </div>
    </div>
  );
};
