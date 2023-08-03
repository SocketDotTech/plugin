import {
  useFloating,
  useHover,
  useInteractions,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import { ReactNode, useState } from "react";

export const Tooltip = ({
  children,
  tooltipContent,
}: {
  children: ReactNode;
  tooltipContent: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(5), flip(), shift()],
  });

  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="skt-w skt-w-flex"
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="skt-w-px-3 skt-w-z-50"
          {...getFloatingProps()}
        >
          <div className="skt-w skt-w-text-xs skt-w-text-white skt-w-text-left skt-w-bg-[#262636] skt-w-border skt-w-border-widget-secondary-text skt-w-border-opacity-40 skt-w-rounded-md skt-w-p-2">
            {tooltipContent}
          </div>
        </div>
      )}
    </>
  );
};
