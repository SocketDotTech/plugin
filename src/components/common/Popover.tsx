import { ReactNode, useContext, useState } from "react";
import { CustomizeContext } from "../../providers/CustomizeProvider";

export const Popover = ({
  children,
  content,
  cursor = "cursor-pointer",
  classNames,
}: {
  children: ReactNode;
  content: string;
  cursor?: string;
  classNames?: string;
}) => {
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  const [showPopover, setShowPopover] = useState<boolean>(false);
  return (
    <div>
      <div
        className={`skt-w absolute left-0 z-50 ${
          showPopover ? "visible" : "invisible"
        } ${classNames ?? ""}`}
      >
        <div
          className="skt-w bg-gray-900/90 border border-widget-outline text-white text-xs font-normal p-2"
          style={{ borderRadius: `calc(0.4rem * ${borderRadius})` }}
        >
          {content}
        </div>
      </div>

      <div
        onMouseOver={() => setShowPopover(true)}
        onMouseOut={() => setShowPopover(false)}
        className={`skt-w ${cursor} flex`}
      >
        {children}
      </div>
    </div>
  );
};
