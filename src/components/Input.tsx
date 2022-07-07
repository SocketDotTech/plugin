import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Currency, Network, TokenWithBalance } from "../utils/types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./ChainSelect";

// actions
import { setSourceToken } from "../state/tokensSlice";
import { setIsEnoughBalance, setSourceAmount } from "../state/amountSlice";
import { setSourceChain } from "../state/networksSlice";
import { formatCurrencyAmount, truncateDecimalValue } from "../utils";

// hooks
import { useBalance } from "../hooks/apis";
import { useAccount } from "wagmi";
import { TokenBalanceReponseDTO } from "socket-v2-sdk";
import { Spinner } from "./common/Spinner";

export function Balance({
  token,
  isLoading,
}: {
  token: TokenBalanceReponseDTO["result"];
  isLoading: boolean;
}) {
  const _formattedBalance = formatCurrencyAmount(
    token?.balance,
    token?.decimals,
    2
  );
  return (
    <span className="text-widget-secondary text-sm text-right flex items-center gap-1 transition-all">
      <span>Bal: {token && _formattedBalance}</span>
      {isLoading && <Spinner size={4} />}
    </span>
  );
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
  const { address: userAddress } = useAccount();
  const sourceToken = useSelector((state: any) => state.tokens.sourceToken);
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    sourceToken?.address,
    sourceChainId,
    userAddress
  );
  const allTokens = useSelector((state: any) => state.tokens.tokens);

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
        filteredNetworks?.find((x: Network) => x?.chainId === 137) ||
          filteredNetworks?.[0]
      );
    } else setFilteredNetworks(allNetworks);
  }, [allNetworks, devProps]);

  // For Input & tokens
  const [inputAmount, updateInputAmount] = useState<string>("");

  const updateToken = (token: Currency) => {
    dispatch(setSourceToken(token));
  };

  const onChangeInput = (amount) => {
    // decimal validation
    if (amount?.indexOf(".") > -1) {
      if (amount.split(".")[1].length <= sourceToken?.decimals) {
        updateInputAmount(amount);
        dispatchAmount(amount);
      }
    } else {
      updateInputAmount(amount);
      dispatchAmount(amount);
    }
  };

  function dispatchAmount(amount) {
    if (amount) {
      const parsedAmount = ethers.utils
        .parseUnits(amount, sourceToken?.decimals)
        .toString();
      dispatch(
        setIsEnoughBalance(
          ethers.BigNumber.from(parsedAmount).lte(
            ethers.BigNumber.from(tokenWithBalance?.balance)
          )
        )
      );
      dispatch(setSourceAmount(parsedAmount));
    }
  }

  // setting initial token
  // changing the tokens on chain change.
  useEffect(() => {
    if (allTokens) {
      const tokens = allTokens?.from;
      const usdc = tokens?.find((x: Currency) => x.chainAgnosticId === "USDC");
      if (usdc) {
        dispatch(setSourceToken(usdc));
      } else {
        dispatch(setSourceToken(tokens[0]));
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
      dispatchAmount(truncatedAmount);
    }
  }, [sourceToken]);

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
        <Balance token={tokenWithBalance} isLoading={isBalanceLoading} />
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
