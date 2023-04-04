import { ReactNode, useContext } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";

export const InnerCard = ({
  children,
  classNames,
}: {
  children: ReactNode;
  classNames?: string;
}) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div
      className={`skt-w bg-widget-secondary p-3 mt-3 ${classNames || ""}`}
      style={{
        borderRadius: `calc(0.75rem * ${borderRadius})`,
      }}
    >
      {children}
    </div>
  );
};
