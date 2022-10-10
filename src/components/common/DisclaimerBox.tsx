import { CustomizeContext } from "../../providers/CustomizeProvider";
import { ReactNode, useContext } from "react";
import { AlertTriangle } from "react-feather";

export const DisclaimerBox = ({
  children,
  showIcon = false,
}: {
  children: ReactNode;
  showIcon?: boolean;
}) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div
      className="skt-w py-3 px-3.5 text-sm text-opacity-90 mt-4 flex items-start"
      style={{
        background: "#FAF3E6",
        borderRadius: `calc(0.75rem * ${borderRadius})`,
      }}
      role="alert"
    >
      {showIcon && (
        <div className="flex items-center mb-2">
          <AlertTriangle className="skt-w mr-3 mt-0.5 text-orange-500" />{" "}
        </div>
      )}
      <p className="skt-w text-gray-800 text-left leading-5">{children}</p>
    </div>
  );
};
