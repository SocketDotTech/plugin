import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { Currency, Network } from "../utils/types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./ChainSelect";
import { Balance } from "./Input";

// actions
import { setDestToken } from "../state/tokensSlice";
import { setDestChain } from "../state/networksSlice";
import { formatCurrencyAmount } from "../utils";

// hooks
import { useBalance } from "../hooks/apis";

import { Web3Context } from "../providers/Web3Provider";

export const Output = () => {
  // For networks
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const devProps = useSelector((state: any) => state.devProps.devProps);
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(
    allNetworks ? [...allNetworks] : null
  );
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const route = useSelector((state: any) => state.quotes.bestRoute);
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    destToken?.address,
    destChainId,
    userAddress
  );
  const allTokens = useSelector((state: any) => state.tokens.tokens);

  const dispatch = useDispatch();
  function updateNetwork(network: Network) {
    dispatch(setDestChain(network?.chainId));
    dispatch(setDestToken(null));
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

  // Changing dest chain if the source and destination chains are the same.
  useEffect(() => {
    if (sourceChainId === destChainId) {
      updateNetwork(filteredNetworks?.[0]);
    }
  }, [filteredNetworks]);

  // For Input & tokens
  const [outputAmount, updateOutputAmount] = useState<string>("");
  useEffect(() => {
    const _formattedOutputAmount = !!route?.route?.toAmount
      ? formatCurrencyAmount(
          route?.route?.toAmount,
          destToken?.decimals,
          6
        ).toString()
      : "";
    updateOutputAmount(_formattedOutputAmount);
  }, [route]);

  // setting initial token
  // changing the tokens on chain change.
  useEffect(() => {
    if (allTokens) {
      const tokens = allTokens?.to;
      const usdc = tokens?.find((x: Currency) => x.chainAgnosticId === "USDC");
      
      let correspondingDestToken;
      if (sourceToken?.chainAgnosticId) {
        correspondingDestToken = tokens?.find(
          (x: Currency) => x?.chainAgnosticId === sourceToken.chainAgnosticId
        );
      }

      if (correspondingDestToken) {
        dispatch(setDestToken(correspondingDestToken));
      } else if (usdc) {
        dispatch(setDestToken(usdc));
      } else {
        dispatch(setDestToken(tokens[0]));
      }
    }
  }, [sourceChainId, allTokens, sourceToken]);

  const updateToken = (token: Currency) => {
    dispatch(setDestToken(token));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1.5">
          <span className="text-widget-secondary text-sm">To</span>
          <ChainSelect
            networks={filteredNetworks}
            activeNetworkId={destChainId}
            onChange={updateNetwork}
          />
        </div>
        <Balance token={tokenWithBalance} isLoading={isBalanceLoading} />
      </div>

      <TokenInput
        amount={`${outputAmount ? `~${outputAmount}` : ""}`}
        updateToken={updateToken}
        activeToken={destToken}
      />
    </div>
  );
};
