import { ReactElement, ReactNode } from "react";

interface headerProp {
  title?: ReactNode | string;
  children: ReactNode;
}
export function Header({ title, children }: headerProp) {
  return (
    <div className="skt-w-flex skt-w-items-center skt-w-justify-between skt-w skt-w-text-widget-primary">
      <>
        {typeof title === "string" ? (
          <span className="skt-w-font-medium skt-w">{title}</span>
        ) : (
          title
        )}
        {children}
      </>
    </div>
  );
}
