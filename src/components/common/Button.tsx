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
      className={`skt-w skt-w-input skt-w-button h-14 px-3 flex items-center justify-center gap-2 transition-all duration-100 ease-linear w-full bg-widget-accent text-widget-onAccent hover:bg-opacity-90 border-widget-primary 
      disabled:bg-widget-secondary 
      disabled:text-widget-secondary 
      disabled:opacity-50 
      disabled:font-normal 
      disabled:border-opacity-50 
      border 
      ${
        classNames || ""
      }`}
      style={{ borderRadius: `calc(0.625rem * ${borderRadius})` }}
    >
      {isLoading && <Spinner size={4} />} {children}
    </button>
  );
};
