import { ReactElement, ReactNode } from "react";

interface headerProp {
  title?: ReactElement | string;
  children: ReactNode;
}
export function Header({ title, children }: headerProp) {
  return (
    <div className="skt-w flex justify-between text-widget-primary">
      <span className="skt-w font-medium">{title}</span>
      {children}
    </div>
  );
}
