import { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode | string;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}
export const Button = (props: ButtonProps) => {
  const {
    onClick,
    children,
    disabled = false,
    secondary = false,
    primary = true,
  } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white py-4 disabled:bg-gray-400"
    >
      {children}
    </button>
  );
};
