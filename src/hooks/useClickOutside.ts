import { useRef, useEffect, ReactNode, ReactElement } from "react";

export default function useClickOutside(handler: any) {
  const domNode = useRef<HTMLDivElement>();

  useEffect(() => {
    const mainHandler = (event) => {
      if (!domNode?.current?.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", mainHandler);

    return () => {
      document.removeEventListener("mousedown", mainHandler);
    };
  });

  return domNode;
}
