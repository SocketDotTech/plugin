import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Currency, Network } from "../utils/types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./ChainSelect";

// actions
import {setDestToken}  from "../state/tokensSlice";
import { setDestChain } from "../state/networksSlice";

export const Output = () => {
  // For networks
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const devProps = useSelector((state: any) => state.devProps.devProps);
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(
    allNetworks ? [...allNetworks] : null
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destToken = useSelector((state: any) => state.tokens.destToken);

  const dispatch = useDispatch();
  function updateNetwork(network: Network) {
    dispatch(setDestChain(network?.chainId));
  }

  // To set the networks. Shows all networks if no widget props are passed
  useEffect(() => {
    if (devProps?.destNetworks) {
      const filteredNetworks = allNetworks?.filter((x: Network) =>
        devProps?.destNetworks?.includes(x?.chainId)
      );

      //  filtering out source network from the list
      const updatedNetworksList = filteredNetworks.filter(
        (x: Network) => x?.chainId !== sourceChainId
      );

      setFilteredNetworks(updatedNetworksList);
      updateNetwork(
        filteredNetworks?.find((x: Network) => x?.chainId === 1) ||
          filteredNetworks?.[0]
      );
    } else {
      // filtering out the source network from the list
      const updatedNetworksList = allNetworks?.filter(
        (x: Network) => x?.chainId !== sourceChainId
      );
      setFilteredNetworks(updatedNetworksList);
    }
  }, [allNetworks, devProps, sourceChainId]);

  useEffect(() => {
    if (sourceChainId === destChainId) {
      updateNetwork(filteredNetworks?.[0]);
    }
  }, [filteredNetworks]);

  // For Input & tokens
  const [outputAmount, updateOutputAmount] = useState<string>("");
  const updateToken = (token: Currency) => {
    dispatch(setDestToken(token))
  };

  return (
    <div>
      <div className="flex items-center">
        <span>To</span>
        <ChainSelect
          networks={filteredNetworks}
          activeNetworkId={destChainId}
          onChange={updateNetwork}
        />
      </div>

      <TokenInput amount={outputAmount} updateToken={updateToken} activeToken={destToken} />
    </div>
  );
};
