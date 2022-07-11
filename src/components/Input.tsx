import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { Currency, Network } from "../utils/types";
import { NATIVE_TOKEN_ADDRESS } from "../consts";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./common/ChainSelect";
import { Spinner } from "./common/Spinner";
import { Balance } from "./common/Balance";

// actions
import { setSourceToken } from "../state/tokensSlice";
import { setIsEnoughBalance, setSourceAmount } from "../state/amountSlice";
import { setSourceChain } from "../state/networksSlice";
import { setError } from "../state/modals";
import { setBestRoute } from "../state/quotesSlice";

import {
  formatCurrencyAmount,
  parseCurrencyAmount,
  truncateDecimalValue,
} from "../utils";

// hooks
import { useBalance } from "../hooks/apis";
import useMappedChainData from "../hooks/useMappedChainData";
import useDebounce from "../hooks/useDebounce";
import { Web3Context } from "../providers/Web3Provider";


// Component that handles the source chain parameters. (FromChain, Source Token)
// Shows the balance for the source chain, and takes the input from the user for amount.
export const Input = () => {
  // For networks
  const allNetworks = useSelector((state: any) => state.networks.allNetworks);
  const customSourceNetworks = useSelector(
    (state: any) => state.customSettings.sourceNetworks
  );
  const customDestNetworks = useSelector(
    (state: any) => state.customSettings.destNetworks
  );
  const defaultSourceNetwork = useSelector((state:any) => state.customSettings.defaultSourceNetwork)
  const [filteredNetworks, setFilteredNetworks] = useState<Network[]>(
    allNetworks ? [...allNetworks] : null
  );
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;

  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);

  // Hook to get Balance for the selected destination token.
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    sourceToken?.address,
    sourceChainId,
    userAddress
  );
  const allTokens = useSelector((state: any) => state.tokens.tokens);
  const mappedChainData = useMappedChainData();

  const dispatch = useDispatch();
  function updateNetwork(network: Network) {
    dispatch(setSourceChain(network?.chainId));
    dispatch(setSourceToken(null));
  }

  // To set the networks. Shows all networks if no widget props are passed
  useEffect(() => {
    if (customSourceNetworks) {
      let filteredNetworks: Network[];

      // If there is just one network on the dest, remove that network from the source
      if (customDestNetworks?.length === 1) {
        filteredNetworks = allNetworks?.filter(
          (x: Network) =>
            customSourceNetworks.includes(x?.chainId) &&
            x.chainId !== customDestNetworks?.[0]
        );
      } else {
        filteredNetworks = allNetworks?.filter((x: Network) =>
          customSourceNetworks.includes(x?.chainId)
        );
      }

      setFilteredNetworks(filteredNetworks);
      updateNetwork(
        filteredNetworks?.find((x: Network) => x?.chainId === defaultSourceNetwork) ||
          filteredNetworks?.[0]
      );
    } else setFilteredNetworks(allNetworks);
  }, [allNetworks, customSourceNetworks]);

  // For Input & tokens
  const [inputAmount, updateInputAmount] = useState<string>("");
  const [parsedInputAmount, setParsedInputAmount] = useState<string>(""); // to check the min balance requirement

  // Updates the selected source token if changed.
  const updateToken = (token: Currency) => {
    dispatch(setSourceToken(token));
  };

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

  // setting initial token
  // changing the tokens on chain change.
  useEffect(() => {
    if (allTokens) {
      const tokens = allTokens?.from;
      const selectedTokenExists = tokens.find(
        (x) =>
          x.address === sourceToken?.address &&
          x.chainId === sourceToken?.chainId
      );

      // If selected token exists in the new token list, retain the selected token. Else, run the following code
      if (!selectedTokenExists) {
        const usdc = tokens?.find(
          (x: Currency) => x.chainAgnosticId === "USDC"
        );
        if (usdc) {
          dispatch(setSourceToken(usdc));
        } else {
          dispatch(setSourceToken(tokens[0]));
        }
      }
    }
  }, [allTokens]);

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
              There is not enough gas. We got you covered, use{" "}
              <a
                href="https://www.bungee.exchange/refuel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-widget-theme text-medium"
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

  return (
    <div className="mt-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-widget-secondary text-sm">From</span>
          <ChainSelect
            networks={filteredNetworks}
            activeNetworkId={sourceChainId}
            onChange={updateNetwork}
          />
        </div>
        <Balance
          token={tokenWithBalance}
          isLoading={isBalanceLoading}
          onClick={() => setMaxBalance(tokenWithBalance?.balance)}
        />
      </div>
      <TokenInput
        source
        amount={inputAmount}
        onChangeInput={onChangeInput}
        updateToken={updateToken}
        activeToken={sourceToken}
      />
    </div>
  );
};
