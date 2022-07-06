import { ReactNode, useContext } from "react";
import { CustomizeContext } from "./CustomizeProvider";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode | string;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  classNames?: string;
}
export const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    disabled = false,
    secondary = false,
    primary = true,
    classNames,
  } = props;

  const customSettings = useContext(CustomizeContext);
  const {borderRadius} = customSettings.customization;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-14 px-3 flex items-center justify-center disabled:opacity-50 transition-all duration-100 ease-linear w-full bg-widget-theme hover:bg-widget-theme-muted text-widget-primary-inverted border-widget-theme disabled:bg-widget-secondary disabled:font-normal disabled:text-widget-secondary border disabled:border-widget-outline ${classNames || ''}`}
      style={{borderRadius: `calc(0.625rem * ${borderRadius})`}}
    >
      {children}
    </button>
  );
};
