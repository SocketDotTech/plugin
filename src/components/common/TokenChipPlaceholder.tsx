import { CustomizeContext } from "../../providers/CustomizeProvider";
import { ReactNode, useContext } from "react";

export const TokenChipPlaceholder = ({ children }: { children: ReactNode }) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <span
      className={`skt-w skt-w-h-8 skt-w-flex skt-w-items-center skt-w-justify-center skt-w-bg-widget-interactive skt-w-flex-shrink-0 skt-w-flex-nowrap skt-w-w-auto skt-w-overflow-hidden skt-w-py-1 skt-w-px-3 skt-w-text-sm skt-w-text-widget-on-interactive`}
      style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
    >
      {children}
    </span>
  );
};
