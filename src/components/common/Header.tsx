import { ReactNode } from "react";

interface headerProp {
  title?: ReactNode | string;
  children: ReactNode;
}
export function Header({ title, children }: headerProp) {
  return (
    <div className="flex items-center justify-between skt-w text-widget-primary">
      {typeof title === "string" ? <span className="font-medium skt-w">{title}</span> : {title}}
      {children}
    </div>
  );
}
