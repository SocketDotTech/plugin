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
import { formatCurrencyAmount } from "../utils";

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
      {isLoading && <Spinner size={4}/>}
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
  const destToken = useSelector((state: any) => state.tokens.destToken);
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
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
  // 1. Enter input (controlled component)
  // 2. check for decimal validation
  // 3. When token is changed, truncate the input in the react state.
  // 4. Update redux state when the user stops entering input data.
  const [inputAmount, updateInputAmount] = useState<string>("");
  useEffect(() => {
    const _formattedInputAmount = !!sourceAmount
      ? formatCurrencyAmount(
          sourceAmount,
          sourceToken?.decimals,
          sourceToken?.decimals
        ).toString()
      : "";
    updateInputAmount(_formattedInputAmount);
  }, [sourceChainId, sourceToken]);

  //

  const updateToken = (token: Currency) => {
    dispatch(setSourceToken(token));
  };

  const onChangeInput = (amount) => {
    // decimal validation
    if (amount?.indexOf(".") > -1) {
      if (amount.split(".")[1].length <= sourceToken?.decimals) {
        updateInputAmount(amount);
      }
    } else {
      updateInputAmount(amount);
    }
  };

  // dispatch the value to redux state
  // check for decimal validation on token change. - pending
  useEffect(() => {
    if (inputAmount) {
      const parsedAmount = ethers.utils
        .parseUnits(inputAmount, sourceToken?.decimals)
        .toString();
      dispatch(setSourceAmount(parsedAmount));

      !!parsedAmount &&
        tokenWithBalance &&
        dispatch(
          setIsEnoughBalance(
            ethers.BigNumber.from(parsedAmount).lte(
              ethers.BigNumber.from(tokenWithBalance?.balance)
            )
          )
        );
    }
  }, [sourceToken, inputAmount, tokenWithBalance]);

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
  }, [sourceChainId, allTokens]);

  // edit amount on chain/token change
  // useEffect(() => {
  //   updateInputAmount(truncateDecimalValue(inputAmount, sourceToken?.decimals));
  // }, [sourceChainId, sourceToken]);

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
