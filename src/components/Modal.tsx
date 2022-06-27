import { ReactElement, ReactNode } from "react";
import { Header } from "./Header";
interface ModalProps {
  title: ReactElement | string;
  closeModal: () => void;
  children: ReactNode
}
export const Modal = ({ title, closeModal, children }: ModalProps) => {
  return (
    <div className="w-full h-full bg-gray-500 absolute top-0 left-0 p-3 z-50">
      <Header title={title}>
        <button onClick={closeModal}>close</button>
      </Header>
      {children}
    </div>
  );
};
