import { CustomizeContext } from "../../providers/CustomizeProvider";
import { ReactNode, useContext } from "react";

export const TokenChipPlaceholder = ({ children }: { children: ReactNode }) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <span
      className={`h-8 flex items-center justify-center bg-widget-interactive flex-shrink-0 flex-nowrap w-auto overflow-hidden py-1 px-3 gap-1 text-sm text-widget-on-interactive`}
      style={{ borderRadius: `calc(1rem * ${borderRadius})` }}
    >
      {children}
    </span>
  );
};
