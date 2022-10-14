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
  }, [tokenList, destChainId]);

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
  const defaultDestNetwork = useSelector(
    (state: any) => state.customSettings.defaultDestNetwork
  );
  const defaultDestTokenAddress = useSelector(
    (state: any) => state.customSettings.defaultDestToken
  );
  const sameChainSwapsEnabled = useSelector(
    (state: any) => state.customSettings.sameChainSwapsEnabled
  );

  // Hack to check if it's the first render
  const [firstRender, setFirstRender] = useState<boolean>(false);
  useEffect(() => {
    setFirstRender(true);
    setFirstRenderNetwork(true);
  }, []);

  function updateNetwork(network: Network) {
    dispatch(setDestChain(network?.chainId));
    if (destToken && destToken?.chainId !== network?.chainId) {
      dispatch(setDestToken(null)); // Resetting the token when network is changed
      _setDestToken(null);
    }
  }

  const [supportedNetworks, setSupportedNetworks] = useState<Network[]>();
  const [supportedNetworksSubset, setSupportedNetworksSubset] =
    useState<Network[]>();

  useEffect(() => {
    // Supported networks = all networks || custom networks
    if (allNetworks?.length) {
      let _supportedNetworks: Network[];
      if (customDestNetworks?.length) {
        _supportedNetworks = allNetworks.filter((x: Network) =>
          customDestNetworks?.includes(x?.chainId)
        );
      } else {
        _supportedNetworks = allNetworks;
      }
      setSupportedNetworks(_supportedNetworks);
    }
  }, [allNetworks]);

  const [firstNetworkRender, setFirstRenderNetwork] = useState<boolean>(false);
  useEffect(() => {
    if (supportedNetworks?.length) {
      let networksSubset;
      if (sameChainSwapsEnabled) {
        // do not exclude the source chain from dest chain list if same chain swaps are enabled
        networksSubset = supportedNetworks;
      } else {
        networksSubset = supportedNetworks.filter(
          (x: Network) => x.chainId !== sourceChainId
        );
      }
      setSupportedNetworksSubset(networksSubset);

      if (firstNetworkRender) {
        updateNetwork(
          networksSubset?.find(
            (x: Network) => x?.chainId === defaultDestNetwork
          ) ?? networksSubset?.[0]
        );
        setFirstRenderNetwork(false);
      } else if (sourceChainId === destChainId) {
        updateNetwork(networksSubset?.[0]);
      }
    }
  }, [supportedNetworks, sourceChainId]);

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
  function fallbackToUSDC() {
    // USDC token
    const usdc = allDestTokens.filter(
      (x: Currency) =>
        (x?.chainAgnosticId?.toLowerCase() || x.symbol.toLowerCase()) === "usdc"
    )?.[0];

    // If same chains are selected, and if the source token is same as usdc, set the dest token to the first token from the list
    if (
      sourceChainId === destChainId &&
      usdc?.address === sourceToken?.address
    ) {
      return allDestTokens[0];
    }

    return usdc ?? allDestTokens[0];
  }

  useEffect(() => {
    if (allDestTokens?.length && sourceToken) {
      let _token: Currency;

      // On first render - Cannot use useEffect with empty dependency array because tokens need to be set when tokenList is returned, hence this hack
      if (firstRender) {
        // Check if default token address is passed
        if (defaultDestTokenAddress) {
          _token =
            allDestTokens.filter(
              (x: Currency) =>
                x.address.toLowerCase() ===
                defaultDestTokenAddress.toLowerCase()
            )?.[0] ?? fallbackToUSDC();
        } else {
          // If not, set it to usdc if available, or set the first token from the list
          _token = fallbackToUSDC();
        }
      } else {
        if (sourceToken?.address === destToken?.address) {
          _token = fallbackToUSDC();
        } else {
          // Check if the current dest token exists in the new token list. If yes, retain the same token. Else, change it.
          const destTokenExists =
            destToken &&
            allDestTokens.find(
              (x: Currency) =>
                x.address.toLowerCase() === destToken?.address?.toLowerCase()
            );

          if (!destTokenExists) {
            // Check if corresponding token is available - This will work only for Socket's token list
            if (sourceToken.chainAgnosticId && sourceChainId !== destChainId) {
              _token =
                allDestTokens.filter(
                  (x: Currency) =>
                    x?.chainAgnosticId?.toLowerCase() ===
                    sourceToken.chainAgnosticId.toLowerCase()
                )?.[0] ?? fallbackToUSDC();
            } else {
              _token = fallbackToUSDC();
            }
          }
        }
      }

      setFirstRender(false);
      if (_token) _setDestToken(_token);
    }
  }, [allDestTokens, sourceToken]);

  const [_destToken, _setDestToken] = useState<Currency>();
  useDebounce(() => dispatch(setDestToken(_destToken)), 300, [_destToken]);

  return (
    <div className="skt-w mt-6">
      <div className="skt-w flex items-center justify-between">
        <div className="skt-w flex items-center">
          <span className="skt-w text-widget-secondary text-sm mr-1.5">To</span>
          <ChainSelect
            networks={supportedNetworksSubset}
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
        tokenToDisable={sourceChainId === destChainId && sourceToken}
      />
    </div>
  );
};
