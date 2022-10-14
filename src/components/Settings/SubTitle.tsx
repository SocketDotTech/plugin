import { ReactNode } from "react";

export const SubTitle = ({ children }: { children: ReactNode }) => {
  return (
    <p className="skt-w text-sm text-widget-primary font-medium">{children}</p>
  );
};
