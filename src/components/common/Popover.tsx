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
        className={`skt-w skt-w-absolute skt-w-left-0 skt-w-z-50 ${
          showPopover ? "skt-w-visible" : "skt-w-invisible"
        } ${classNames ?? ""}`}
      >
        <div
          className="skt-w skt-w-text-left skt-w-bg-black/90 skt-w-border skt-w-border-widget-outline skt-w-text-white skt-w-text-xs skt-w-font-normal skt-w-p-2"
          style={{ borderRadius: `calc(0.4rem * ${borderRadius})` }}
        >
          {content}
        </div>
      </div>

      <div
        onMouseOver={() => setShowPopover(true)}
        onMouseOut={() => setShowPopover(false)}
        className={`skt-w skt-w-${cursor} skt-w-flex`}
      >
        {children}
      </div>
    </div>
  );
};
