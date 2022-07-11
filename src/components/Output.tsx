import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { Currency, Network } from "../utils/types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./common/ChainSelect";
import { Balance } from "./Input";

// actions
import { setDestToken } from "../state/tokensSlice";
import { setDestChain } from "../state/networksSlice";
import { formatCurrencyAmount } from "../utils";

// hooks
import { useBalance } from "../hooks/apis";

import { Web3Context } from "../providers/Web3Provider";

export const Output = () => {
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;
  const dispatch = useDispatch();

  // Networks
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(
    allNetworks ? [...allNetworks] : null
  );

  // Tokens
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const allDestTokens = useSelector((state: any) => state.tokens.allDestTokens);
  const customDestTokens = useSelector(
    (state: any) => state.customSettings.destTokens
  );
  const [filteredTokens, setFilteredTokens] = useState<Currency[]>(null);

  const route = useSelector((state: any) => state.quotes.bestRoute);
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    destToken?.address,
    destChainId,
    userAddress
  );

  // Custom Settings
  const customDestNetworks = useSelector(
    (state: any) => state.customSettings.destNetworks
  );
  const defaultDestNetwork = useSelector(
    (state: any) => state.customSettings.defaultDestNetwork
  );
  const defaultDestToken = useSelector(
    (state: any) => state.customSettings.defaultDestToken
  );

  function updateNetwork(network: Network) {
    dispatch(setDestChain(network?.chainId));
    dispatch(setDestToken(null));
  }

  // To set the networks. Shows all networks if no widget props are passed
  useEffect(() => {
    if (allNetworks && customDestNetworks) {
      const filteredNetworks = allNetworks?.filter((x: Network) =>
        customDestNetworks?.includes(x?.chainId)
      );

      //  filtering out source network from the list
      const updatedNetworksList = filteredNetworks?.filter(
        (x: Network) => x?.chainId !== sourceChainId
      );

      setFilteredNetworks(updatedNetworksList);
      updateNetwork(
        filteredNetworks?.find(
          (x: Network) => x?.chainId === defaultDestNetwork
        ) || filteredNetworks?.[0]
      );
    } else {
      // filtering out the source network from the list
      const updatedNetworksList = allNetworks?.filter(
        (x: Network) => x?.chainId !== sourceChainId
      );
      setFilteredNetworks(updatedNetworksList);
    }
  }, [allNetworks, sourceChainId, customDestNetworks]);

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

  // Filtering out the tokens if the props are passed
  useEffect(() => {
    if (customDestTokens?.[destChainId]?.length > 0) {
      const _filteredTokens = allDestTokens?.filter((token: Currency) =>
        customDestTokens?.[destChainId].includes(token.address)
      );
      if (_filteredTokens?.length > 0) setFilteredTokens(_filteredTokens);
      else setFilteredTokens(_filteredTokens);
    } else setFilteredTokens(allDestTokens);
  }, [allDestTokens]);

  // setting initial token
  // changing the tokens on chain change.
  useEffect(() => {
    if (filteredTokens && sourceToken) {
      const usdc = filteredTokens?.find(
        (x: Currency) => x.chainAgnosticId === "USDC"
      );

      let correspondingDestToken;
      if (sourceToken?.chainAgnosticId) {
        correspondingDestToken = filteredTokens?.find(
          (x: Currency) => x?.chainAgnosticId === sourceToken.chainAgnosticId
        );
      }

      const defaultToken = filteredTokens?.filter(
        (x) => x.address == defaultDestToken
      )?.[0];

      if (defaultToken) {
        dispatch(setDestToken(defaultToken));
      } else if (correspondingDestToken) {
        dispatch(setDestToken(correspondingDestToken));
      } else if (usdc) {
        dispatch(setDestToken(usdc));
      } else {
        dispatch(setDestToken(filteredTokens[0]));
      }
    }
  }, [filteredTokens, sourceToken]);

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
        tokens={filteredTokens}
      />
    </div>
  );
};
