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
      className="skt-w skt-w-py-3 skt-w-px-3.5 skt-w-text-sm skt-w-text-opacity-90 skt-w-mt-4 skt-w-flex skt-w-items-start"
      style={{
        background: "#FAF3E6",
        borderRadius: `calc(0.75rem * ${borderRadius})`,
      }}
      role="alert"
    >
      {showIcon && (
        <div className="skt-w-flex skt-w-items-center skt-w-mb-2">
          <AlertTriangle className="skt-w skt-w-mr-3 skt-w-mt-0.5 skt-w-text-orange-500" />{" "}
        </div>
      )}
      <p className="skt-w skt-w-text-gray-800 skt-w-text-left skt-w-leading-5">
        {children}
      </p>
    </div>
  );
};
