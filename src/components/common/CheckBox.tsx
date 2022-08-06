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
      className={`skt-w w-11 h-7 rounded-full relative ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${isChecked ? "bg-widget-accent" : "bg-gray-400"} ${
        small ? "scale-75" : ""
      }`}
    >
      <div
        className={`skt-w bg-widget-onAccent bg-opacity-80 h-5 w-5 top-1 absolute rounded-full transition ease-linear duration-200 ${
          isChecked ? "translate-x-5" : "translate-x-1"
        }`}
      ></div>
      <input
        type="checkbox"
        className={`skt-w skt-w-input w-px h-px opacity-0 ${
          disabled ? "pointer-events-none" : ""
        }`}
        id={id}
        onChange={() => setIsChecked(!isChecked)}
        checked={isChecked}
        disabled={disabled}
      />
    </label>
  );
};
