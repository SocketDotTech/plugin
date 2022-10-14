import { CustomizeContext } from "../../providers/CustomizeProvider";
import { useContext } from "react";

interface RadioProps {
  id: string;
  name: string;
  label: string;
  onChange: () => void;
  checked: boolean;
}
export const RadioCheckbox = (props: RadioProps) => {
  const { id, name, label, onChange, checked } = props;
  const customSettings = useContext(CustomizeContext);
  const { borderRadius } = customSettings.customization;

  return (
    <div className="skt-w relative mx-1">
      <label
        htmlFor={id}
        className={`skt-w flex items-center justify-center w-12 relative z-10 p-2 cursor-pointer border border-opacity-40 text-sm font-semibold ${
          checked
            ? "bg-widget-accent text-widget-onAccent border-widget-accent"
            : "text-widget-secondary border-widget-secondary-text"
        }`}
        style={{ borderRadius: `calc(0.375rem * ${borderRadius})` }}
      >
        {label}
      </label>
      <input
        type="radio"
        id={id}
        name={name}
        className="skt-w w-0 h-0 opacity-0 z-0 absolute"
        onChange={onChange}
        checked={checked}
      />
    </div>
  );
};
