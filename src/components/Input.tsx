import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { Currency, Network } from "../types";
import { NATIVE_TOKEN_ADDRESS } from "../consts";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./common/ChainSelect";
import { Balance } from "./common/Balance";

// actions
import { setSourceToken } from "../state/tokensSlice";
import { setIsEnoughBalance, setSourceAmount } from "../state/amountSlice";
import { setSourceChain } from "../state/networksSlice";
import { setError } from "../state/modals";
import { setBestRoute } from "../state/quotesSlice";

import {
  filterTokensByChain,
  formatCurrencyAmount,
  parseCurrencyAmount,
  truncateDecimalValue,
} from "../utils";

// hooks
import { useBalance } from "../hooks/apis";
import useMappedChainData from "../hooks/useMappedChainData";
import useDebounce from "../hooks/useDebounce";
import { Web3Context } from "../providers/Web3Provider";
import { useTokenList } from "../hooks/useTokenList";

// Component that handles the source chain parameters. (FromChain, Source Token)
// Shows the balance for the source chain, and takes the input from the user for amount.
export const Input = ({
  customTokenList,
}: {
  customTokenList: string | Currency[];
}) => {
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;
  const mappedChainData = useMappedChainData();
  const dispatch = useDispatch();

  // Networks
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );

  // Tokens
  const tokenList = useTokenList(customTokenList);
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const [allSourceTokens, setAllSourceTokens] = useState(null);
  const [noTokens, setNoTokens] = useState<boolean>(false);

  // Filtering out tokens by chain
  useEffect(() => {
    if (tokenList?.length > 0) {
      const tokensByChain = filterTokensByChain(tokenList, sourceChainId);
      // Setting noTokens to true when there are no chain-specific tokens in the token list.
      setNoTokens(tokensByChain?.length === 0);
      setAllSourceTokens(tokensByChain);
    }
  }, [tokenList, sourceChainId]);

  // Hook to get Balance for the selected source token.
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    sourceToken?.address,
    sourceChainId,
    userAddress
  );

  // Custom Settings
  const customSourceNetworks = useSelector(
    (state: any) => state.customSettings.sourceNetworks
  );
  const customDestNetworks = useSelector(
    (state: any) => state.customSettings.destNetworks
  );
  const defaultSourceNetwork = useSelector(
    (state: any) => state.customSettings.defaultSourceNetwork
  );
  const defaultSourceTokenAddress = useSelector(
    (state: any) => state.customSettings.defaultSourceToken
  );

  function updateNetwork(network: Network) {
    dispatch(setSourceChain(network?.chainId));
    sourceToken &&
      sourceToken?.chainId !== network?.chainId &&
      dispatch(setSourceToken(null)); // Resetting the token when network is changed
  }
  const [supportedNetworks, setSupportedNetworks] = useState<Network[]>();

  useEffect(() => {
    // Supported networks = all networks || custom networks
    if (allNetworks?.length) {
      let _supportedNetworks: Network[];

      if (customSourceNetworks?.length) {
        _supportedNetworks = allNetworks.filter((x: Network) =>
          customSourceNetworks?.includes(x?.chainId)
        );
      } else {
        _supportedNetworks = allNetworks;
      }

      // If there is only 1 chain on the destination, and if it exists in the source, remove it from the networks
      if (customDestNetworks?.length === 1) {
        setSupportedNetworks(
          _supportedNetworks?.filter(
            (x: Network) => x.chainId !== customDestNetworks?.[0]
          )
        );
      } else setSupportedNetworks(_supportedNetworks);

      updateNetwork(
        _supportedNetworks?.find(
          (x: Network) => x?.chainId === defaultSourceNetwork
        ) ?? _supportedNetworks?.[0]
      );
    }
  }, [allNetworks]);

  // For Input & tokens
  const inputAmountFromReduxState = useSelector(
    (state: any) => state.amount.sourceAmount
  );
  const [inputAmount, updateInputAmount] = useState<string>("");
  const [parsedInputAmount, setParsedInputAmount] = useState<string>(""); // to check the min balance requirement

  // Updates the input amount if changed.
  const onChangeInput = (amount) => {
    // decimal validation
    if (amount?.indexOf(".") > -1) {
      if (amount.split(".")[1].length <= sourceToken?.decimals) {
        updateInputAmount(amount);
        parseInputAmount(amount);
      }
    } else {
      updateInputAmount(amount);
      parseInputAmount(amount);
    }

    if (!amount || amount == 0) {
      dispatch(setBestRoute(null));
    }
  };

  // Debounce to not call quote api on every input change.
  useDebounce(() => dispatch(setSourceAmount(parsedInputAmount)), 500, [
    parsedInputAmount,
  ]);

  // Parse the input amount to bignumber.
  function parseInputAmount(amount) {
    if (amount) {
      const parsedAmount = parseCurrencyAmount(amount, sourceToken?.decimals);
      setParsedInputAmount(parsedAmount);
      // parsedInputAmount is the dependency for useDebounce hook
    }
  }

  // To check the minimum balance requirement
  useEffect(() => {
    if (parsedInputAmount && tokenWithBalance) {
      const isEnoughBalance = ethers.BigNumber.from(parsedInputAmount).lte(
        ethers.BigNumber.from(tokenWithBalance?.balance)
      );
      dispatch(setIsEnoughBalance(isEnoughBalance));
    }
  }, [parsedInputAmount, tokenWithBalance]);

  // Setting initial tokens
  function fallbackToUSDC() {
    return (
      allSourceTokens.filter(
        (x: Currency) =>
          (x?.chainAgnosticId?.toLowerCase() || x.symbol.toLowerCase()) ===
          "usdc"
      )?.[0] ?? allSourceTokens[0]
    );
  }

  useEffect(() => {
    if (allSourceTokens?.length > 0) {
      let _token: Currency;

      // Check if the source token exists in the new list. If yes, do not update the source token
      const sourceTokenExists =
        sourceToken &&
        allSourceTokens.find(
          (x: Currency) =>
            x.address.toLowerCase() === sourceToken?.address?.toLowerCase()
        );

      if (!sourceTokenExists) {
        if (defaultSourceTokenAddress) {
          _token =
            allSourceTokens.filter(
              (x: Currency) =>
                x.address.toLowerCase() ===
                defaultSourceTokenAddress.toLowerCase()
            )?.[0] ?? fallbackToUSDC();
        } else {
          _token = fallbackToUSDC();
        }
      }

      if (_token) _setSourceToken(_token);
    }
  }, [allSourceTokens]);

  const [_sourceToken, _setSourceToken] = useState<Currency>();
  useDebounce(() => dispatch(setSourceToken(_sourceToken)), 300, [
    _sourceToken,
  ]);

  // truncate amount on chain/token change
  useEffect(() => {
    if (sourceToken && inputAmount) {
      const truncatedAmount = truncateDecimalValue(
        inputAmount,
        sourceToken?.decimals
      );
      updateInputAmount(truncatedAmount);
      parseInputAmount(truncatedAmount);
    }
  }, [sourceToken]);

  function setMaxBalance(balance) {
    // Format the amount first and set as Max when max is clicked.
    function formateAndParseAmount(_balance) {
      const _formattedAmount = formatCurrencyAmount(
        _balance,
        sourceToken?.decimals,
        sourceToken?.decimals
      );
      updateInputAmount(_formattedAmount);
      parseInputAmount(_formattedAmount);
    }

    // Condition to leave some native tokens for transaction fee.
    if (sourceToken.address === NATIVE_TOKEN_ADDRESS) {
      // subtracting min gas from the total amount
      const minGas =
        mappedChainData[sourceChainId].currency.minNativeCurrencyForGas;
      const minGasBN = ethers.BigNumber.from(minGas);
      const balanceBN = ethers.BigNumber.from(balance);

      if (minGasBN.lt(balanceBN)) {
        const maxBalanceMinusGas = balanceBN.sub(minGasBN);
        formateAndParseAmount(maxBalanceMinusGas);
      } else {
        dispatch(
          setError(
            <span>
              You are low on gas. We got you covered, use{" "}
              <a
                href="https://www.bungee.exchange/refuel"
                target="_blank"
                rel="noopener noreferrer"
                className="skt-w skt-w-anchor text-widget-accent text-medium"
              >
                Refuel
              </a>{" "}
              to get gas now!
            </span>
          )
        );
      }
    } else formateAndParseAmount(balance);
  }

  // Reset source amount on mount
  useEffect(() => {
    inputAmountFromReduxState && dispatch(setSourceAmount(null));
  }, []);

  return (
    <div className="skt-w mt-3.5">
      <div className="skt-w flex items-center justify-between">
        <div className="skt-w flex items-center gap-1.5">
          <span className="skt-w text-widget-secondary text-sm">From</span>
          <ChainSelect
            networks={supportedNetworks}
            activeNetworkId={sourceChainId}
            onChange={updateNetwork}
          />
        </div>
        {!noTokens && (
          <Balance
            token={tokenWithBalance}
            isLoading={isBalanceLoading}
            onClick={() => setMaxBalance(tokenWithBalance?.balance)}
          />
        )}
      </div>
      <TokenInput
        source
        amount={inputAmount}
        onChangeInput={onChangeInput}
        updateToken={_setSourceToken}
        activeToken={sourceToken}
        tokens={allSourceTokens}
        noTokens={noTokens}
      />
    </div>
  );
};
