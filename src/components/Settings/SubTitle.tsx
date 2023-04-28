import { ReactNode } from "react";

export const SubTitle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="skt-w skt-w-text-sm skt-w-text-widget-primary skt-w-font-medium">
      {children}
    </p>
  );
};
