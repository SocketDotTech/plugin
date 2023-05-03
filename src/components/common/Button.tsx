import { ReactNode, useContext } from "react";
import { Spinner } from "./Spinner";
import { CustomizeContext } from "../../providers/CustomizeProvider";
interface ButtonProps {
  onClick: () => void;
  children: ReactNode | string;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  classNames?: string;
  isLoading?: boolean;
}
export const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    disabled = false,
    secondary = false,
    primary = true,
    classNames,
    isLoading = false,
  } = props;

  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`skt-w skt-w-input skt-w-button skt-w-h-14 skt-w-px-3 skt-w-flex skt-w-items-center skt-w-justify-center skt-w-transition-all skt-w-duration-100 skt-w-ease-linear skt-w-w-full skt-w-bg-widget-accent skt-w-text-widget-onAccent hover:skt-w-bg-opacity-90 skt-w-border-widget-primary 
      disabled:skt-w-bg-widget-secondary 
      disabled:skt-w-text-widget-secondary 
      disabled:skt-w-opacity-50 
      disabled:skt-w-font-normal 
      disabled:skt-w-border-opacity-50 
      skt-w-border 
      ${classNames || ""}`}
      style={{ borderRadius: `calc(0.625rem * ${borderRadius})` }}
    >
      {isLoading && <Spinner size={4} />}{" "}
      <span className="skt-w-ml-2">{children}</span>
    </button>
  );
};
