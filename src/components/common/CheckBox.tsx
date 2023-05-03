export const CheckBox = ({
  id,
  disabled = false,
  isChecked = false,
  setIsChecked,
  small = false,
}: {
  id: string;
  disabled?: boolean;
  isChecked?: boolean;
  setIsChecked?: (isChecked: boolean) => void;
  small?: boolean;
}) => {
  return (
    <label
      htmlFor={id}
      className={`skt-w skt-w-w-11 skt-w-h-7 skt-w-rounded-full skt-w-relative ${
        disabled ? "skt-w-cursor-not-allowed" : "skt-w-cursor-pointer"
      } ${isChecked ? "skt-w-bg-widget-accent" : "skt-w-bg-gray-400"} ${
        small ? "skt-w-scale-75" : ""
      }`}
    >
      <div
        className={`skt-w skt-w-bg-widget-onAccent skt-w-bg-opacity-80 skt-w-h-5 skt-w-w-5 skt-w-top-1 skt-w-absolute skt-w-rounded-full skt-w-transition skt-w-ease-linear skt-w-duration-200 ${
          isChecked ? "skt-w-translate-x-5" : "skt-w-translate-x-1"
        }`}
      ></div>
      <input
        type="checkbox"
        className={`skt-w skt-w-input skt-w-w-px skt-w-h-px skt-w-opacity-0 ${
          disabled ? "skt-w-pointer-events-none" : ""
        }`}
        id={id}
        onChange={() => setIsChecked(!isChecked)}
        checked={isChecked}
        disabled={disabled}
      />
    </label>
  );
};
