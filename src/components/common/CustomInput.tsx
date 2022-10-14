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
    <div className="skt-w mx-1 relative">
      <input
        type="number"
        className={`skt-w bg-transparent text-widget-secondary skt-w-input border-[1.5px] border-opacity-40 pb-0.5 h-full w-full px-3 focus:border-widget-accent text-ellipsis ${
          value ? "border-widget-accent" : ""
        }`}
        style={{ borderRadius: `calc(0.375rem * ${borderRadius})` }}
        placeholder="Custom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step=".001"
        min="0"
      />
      <span className="absolute right-3 top-2 my-auto font-medium bg-widget-primary pl-2 text-widget-primary">
        %
      </span>
    </div>
  );
};
