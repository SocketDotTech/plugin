import { ReactElement, ReactNode } from "react";

interface headerProp {
  title?: ReactElement | string;
  children: ReactNode;
}
export function Header({ title, children }: headerProp) {
  return (
    <div className="flex justify-between text-widget-primary">
      <span className="font-medium">{title}</span>
      {children}
    </div>
  );
}
