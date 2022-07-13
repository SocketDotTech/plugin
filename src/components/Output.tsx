import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { Currency, Network } from "../types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./common/ChainSelect";
import { Balance } from "./common/Balance";

// actions
import { setDestToken } from "../state/tokensSlice";
import { setDestChain } from "../state/networksSlice";
import { formatCurrencyAmount } from "../utils";

// hooks
import { useBalance } from "../hooks/apis";

import { Web3Context } from "../providers/Web3Provider";

// Component that handles the destination chain parameters. (ToChain, Destination Token)
// Shows the balance and the amount you receive for the selected route.
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

  // Hook to get Balance for the selected destination token.
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    destToken?.address,
    destChainId,
    userAddress
  );

  // Custom Settings
  const customDestNetworks = useSelector(
    (state: any) => state.customSettings.destNetworks
  );
  const customSourceNetworks = useSelector(
    (state: any) => state.customSettings.sourceNetworks
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
    if (allNetworks) {
      let _customNetworks: Network[];
      let _filteredNetworks: Network[];

      // If custom destination networks are passed, filter those out from all tokens
      if (customDestNetworks) {
        _customNetworks = allNetworks?.filter((x: Network) =>
          customDestNetworks?.includes(x?.chainId) && sourceChainId !== x?.chainId // also removing the source chain from the dest token list
        );
      } else {
        _customNetworks = allNetworks?.filter((x: Network) => sourceChainId !== x?.chainId); // removing the source chain
      }

      // If custom source networks are passed & the length is 1, remove it from the destination network list
      if (customSourceNetworks?.length === 1) {
        _filteredNetworks = _customNetworks?.filter(
          (x: Network) => x.chainId !== customSourceNetworks?.[0]
        );
      } else {
        _filteredNetworks = _customNetworks;
      }

      setFilteredNetworks(_filteredNetworks);

      // If default dest network is passed, set that n/w, else set the first n/w from the list
      updateNetwork(
        _filteredNetworks?.find(
          (x: Network) => x?.chainId === defaultDestNetwork
        ) || _filteredNetworks?.[0]
      );
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

  // Updates the selected destination token if changed.
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
