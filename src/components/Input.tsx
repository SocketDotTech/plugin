import { setSourceChain } from "../state/networksSlice";
import { Network } from "../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { ChainDropdown } from "./ChainDropdown";
import { useEffect } from "react";
import { useState } from "react";

export function Balance() {
  return <span>Bal: 0.124</span>;
}

export const Input = () => {
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const devProps = useSelector((state: any) => state.devProps.devProps);
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(
    allNetworks ? [...allNetworks] : null
  );
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const activeNetwork = allNetworks?.filter(
    (x: Network) => x?.chainId === sourceChainId
  )[0];

  const dispatch = useDispatch();
  function updateNetwork(network: Network) {
    dispatch(setSourceChain(network?.chainId));
  }

  // To set the networks. Shows all networks if no widget props are passed
  useEffect(() => {
    if (devProps?.sourceNetworks) {
      const filteredNetworks = allNetworks?.filter((x: Network) =>
        devProps?.sourceNetworks?.includes(x?.chainId)
      );
      setFilteredNetworks(filteredNetworks);
      updateNetwork(
        filteredNetworks.find((x: Network) => x?.chainId === 137) ||
          filteredNetworks?.[0]
      );
    } else setFilteredNetworks(allNetworks);
  }, [allNetworks, devProps]);

  return (
    <div className="flex items-center">
      <span>From</span>
      <ChainDropdown
        networks={filteredNetworks}
        activeNetwork={activeNetwork}
        onChange={updateNetwork}
      />
    </div>
  );
};
