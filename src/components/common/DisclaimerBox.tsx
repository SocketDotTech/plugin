import { CustomizeContext } from "../../providers/CustomizeProvider";
import { ReactNode, useContext } from "react";
import { AlertTriangle } from "react-feather";

export const DisclaimerBox = ({ children }: { children: ReactNode }) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div
      className="py-3 px-3.5 text-sm text-opacity-90 mt-4"
      style={{ background: "#FAF3E6", borderRadius: `calc(0.75rem * ${borderRadius})` }}
      role="alert"
    >
      <div className="flex items-center mb-2">
        <AlertTriangle className="mr-1 text-orange-500" />{" "}
        <span className="font-medium text-gray-800">Disclaimer</span>
      </div>
      <span className="text-gray-800">{children}</span>
    </div>
  );
};
