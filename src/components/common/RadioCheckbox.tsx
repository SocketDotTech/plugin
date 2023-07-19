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
    <div className="skt-w skt-w-relative skt-w-mr-2">
      <label
        htmlFor={id}
        className={`skt-w skt-w-flex skt-w-items-center skt-w-justify-center skt-w-w-12 skt-w-relative skt-w-z-10 skt-w-p-2 skt-w-cursor-pointer skt-w-border skt-w-border-opacity-40 skt-w-text-sm skt-w-font-semibold ${
          checked
            ? "skt-w-bg-widget-accent skt-w-text-widget-onAccent skt-w-border-widget-accent"
            : "skt-w-text-widget-secondary skt-w-border-widget-secondary-text"
        }`}
        style={{ borderRadius: `calc(0.375rem * ${borderRadius})` }}
      >
        {label}
      </label>
      <input
        type="radio"
        id={id}
        name={name}
        className="skt-w skt-w-w-0 skt-w-h-0 skt-w-opacity-0 skt-w-z-0 skt-w-absolute"
        onChange={onChange}
        checked={checked}
      />
    </div>
  );
};
