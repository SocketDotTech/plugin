import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Set the necessary data for all chains.
export default function useMappedChainData() {
  const [map, setMap] = useState<any>(undefined);
  const supportedNetworks = useSelector((state: any) => state.networks.allNetworks)
  useEffect(() => {
    if (!supportedNetworks) {
      setMap(supportedNetworks);
    } else {
      let mappedChainData: any = {};
      supportedNetworks.forEach(
        (chain: any) => (mappedChainData[chain.chainId] = chain)
      );
      setMap(mappedChainData);
    }
  }, [supportedNetworks]);

  return map;
}
