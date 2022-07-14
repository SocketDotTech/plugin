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
import { filterTokensByChain, formatCurrencyAmount } from "../utils";

// hooks
import { useBalance } from "../hooks/apis";
import { useTokenList } from "../hooks/useTokenList";
import useDebounce from "../hooks/useDebounce";

import { Web3Context } from "../providers/Web3Provider";

// Component that handles the destination chain parameters. (ToChain, Destination Token)
// Shows the balance and the amount you receive for the selected route.
export const Output = ({
  customTokenList,
}: {
  customTokenList: string | Currency[];
}) => {
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
  const [noTokens, setNoTokens] = useState<boolean>(false);

  // Tokens
  const tokenList = useTokenList(customTokenList);
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const [allDestTokens, setAllDestTokens] = useState(null);

  useEffect(() => {
    if (tokenList?.length > 0) {
      const tokensByChain = filterTokensByChain(tokenList, destChainId);
      setNoTokens(tokensByChain?.length === 0);
      setAllDestTokens(tokensByChain);
    }
  }, [tokenList]);

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
  const defaultDestTokenAddress = useSelector(
    (state: any) => state.customSettings.defaultDestToken
  );

  // Hack to check if it's the first render
  const [firstRender, setFirstRender] = useState<boolean>(false);
  useEffect(() => {
    setFirstRender(true);
  }, []);

  function updateNetwork(network: Network) {
    dispatch(setDestChain(network?.chainId));
    destToken &&
      destToken?.chainId !== network?.chainId &&
      dispatch(setDestToken(null)); // Resetting the token when network is changed
  }

  // To set the networks. Shows all networks if no widget props are passed
  useEffect(() => {
    if (allNetworks) {
      let _customNetworks: Network[];
      let _filteredNetworks: Network[];

      // If custom destination networks are passed, filter those out from all tokens
      if (customDestNetworks) {
        _customNetworks = allNetworks?.filter(
          (x: Network) =>
            customDestNetworks?.includes(x?.chainId) &&
            sourceChainId !== x?.chainId // also removing the source chain from the dest token list
        );
      } else {
        _customNetworks = allNetworks?.filter(
          (x: Network) => sourceChainId !== x?.chainId
        ); // removing the source chain
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
  }, [allNetworks, customDestNetworks]);

  // Changing dest chain if the source and destination chains are the same.
  useEffect(() => {
    if (filteredNetworks) {
      if (sourceChainId === destChainId) {
        updateNetwork(filteredNetworks?.[0]);
      }
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

  // To set the tokens on load & when the source token changes
  useEffect(() => {
    if (allDestTokens?.length > 0 && sourceToken) {
      let _token: Currency;

      // On first render - Cannot use useEffect with empty dependency array because tokens need to be set when tokenList is returned, hence this hack
      if (firstRender) {
        // Check if default token address is passed
        if (defaultDestTokenAddress) {
          _token = allDestTokens.filter(
            (x: Currency) => x.address === defaultDestTokenAddress
          )?.[0];
        } else {
          // If not, set it to usdc if available, or set the first token from the list
          _token =
            allDestTokens.filter(
              (x: Currency) =>
                (x?.chainAgnosticId?.toLowerCase() ||
                  x.symbol.toLowerCase()) === "usdc"
            )?.[0] ?? allDestTokens[0];
        }
      } else {
        // Check if corresponding token is available - This will work only for Socket's token list
        if (sourceToken.chainAgnosticId) {
          _token = allDestTokens.filter(
            (x: Currency) =>
              x?.chainAgnosticId?.toLowerCase() ===
              sourceToken.chainAgnosticId.toLowerCase()
          )?.[0];
        }
      }

      setFirstRender(false);
      if (_token) _setDestToken(_token);
    }
  }, [allDestTokens, sourceToken]);

  const [_destToken, _setDestToken] = useState<Currency>();
  useDebounce(() => dispatch(setDestToken(_destToken)), 300, [_destToken]);

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
        {!noTokens && (
          <Balance token={tokenWithBalance} isLoading={isBalanceLoading} />
        )}
      </div>

      <TokenInput
        amount={`${outputAmount ? `~${outputAmount}` : ""}`}
        updateToken={_setDestToken}
        activeToken={destToken}
        tokens={allDestTokens}
        noTokens={noTokens}
      />
    </div>
  );
};
