import { useSelector } from "react-redux";

export const UsdValue = ({ isSource }: { isSource?: boolean }) => {
  const route = useSelector((state: any) => state.quotes.bestRoute);

  const inputValueInUsd = route?.route?.inputValueInUsd?.toFixed(2) ?? 0;
  const outputValueInUsd = route?.route?.outputValueInUsd?.toFixed(2) ?? 0;

  const value = isSource ? inputValueInUsd : outputValueInUsd;

  return (
    <p
      className={`skt-w skt-w-m-0 skt-w-text-sm skt-w-font-medium skt-w-mr-2 ${
        value ? "skt-w-text-widget-primary" : "skt-w-text-transparent"
      }`}
    >
      ${value}
    </p>
  );
};
