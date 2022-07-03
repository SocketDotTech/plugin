import { ReactElement, ReactNode } from "react";
import { Header } from "./Header";
interface ModalProps {
  title: ReactElement | string;
  closeModal: () => void;
  children: ReactNode;
}
export const Modal = ({ title, closeModal, children }: ModalProps) => {
  return (
    <div className="p-1 w-full h-full absolute top-0 left-0 z-50">
      <div className="w-full h-full bg-gray-400 p-2 flex flex-col rounded-xl">
        <Header title={title}>
          <button onClick={closeModal}>close</button>
        </Header>
        {children}
      </div>
    </div>
  );
};
