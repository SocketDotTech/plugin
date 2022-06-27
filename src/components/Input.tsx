import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Currency, Network } from "../utils/types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./ChainSelect";

// actions
import { setSourceToken } from "../state/tokensSlice";
import { setSourceAmount } from "../state/amountSlice";
import { setSourceChain } from "../state/networksSlice";

export function Balance() {
  return <span>Bal: 0.124</span>;
}

export const Input = () => {
  // For networks
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const devProps = useSelector((state: any) => state.devProps.devProps);
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(
    allNetworks ? [...allNetworks] : null
  );
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);

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

  // For Input & tokens
  const [inputAmount, updateInputAmount] = useState<string>("");
  const updateToken = (token: Currency) => {
    dispatch(setSourceToken(token));
  };

  useEffect(() => {
    if (inputAmount) {
      dispatch(
        setSourceAmount(
          ethers.utils.parseUnits(inputAmount, sourceToken?.decimals).toString()
        )
      );
    }
  }, [sourceToken, inputAmount]);

  return (
    <>
      <div className="flex items-center">
        <span>From</span>
        <ChainSelect
          networks={filteredNetworks}
          activeNetworkId={sourceChainId}
          onChange={updateNetwork}
        />
      </div>

      <TokenInput
        source
        amount={inputAmount}
        onChangeInput={updateInputAmount}
        updateToken={updateToken}
        activeToken={sourceToken}
      />
    </>
  );
};
