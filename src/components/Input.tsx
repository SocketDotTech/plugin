import { useSelector } from "react-redux";
import { ChainDropdown } from "./ChainDropdown";

export function Balance() {
  return <span>Bal: 0.124</span>;
}

export const Input = () => {
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);

  return (
    <>
      <span>From</span>
      <ChainDropdown networks={allNetworks} activeNetwork={allNetworks?.[0]} />
    </>
  );
};
