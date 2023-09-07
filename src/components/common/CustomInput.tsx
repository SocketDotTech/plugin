import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";

export const CustomInputBox = (props: {
  value: string;
  onChange: (e: string) => void;
}) => {
  const { value, onChange } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;
  return (
    <div className="skt-w skt-w-relative skt-w-w-full">
      <input
        type="number"
        className={`skt-w skt-w-bg-transparent skt-w-text-widget-secondary skt-w-input skt-w-border-[1.5px] skt-w-border-opacity-40 skt-w-pb-0.5 skt-w-h-full skt-w-w-full skt-w-px-3 focus:skt-w-border-widget-accent skt-w-text-ellipsis ${
          value ? "skt-w-border-widget-accent" : ""
        }`}
        style={{ borderRadius: `calc(0.375rem * ${borderRadius})` }}
        placeholder="Custom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step=".001"
        min="0"
      />
      <span className="skt-w-absolute skt-w-right-3 skt-w-top-2 skt-w-my-auto skt-w-font-medium skt-w-bg-widget-primary skt-w-pl-2 skt-w-text-widget-primary">
        %
      </span>
    </div>
  );
};
