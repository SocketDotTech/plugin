import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Currency, Network, TokenWithBalance } from "../utils/types";

// component
import { TokenInput } from "./TokenInput";
import { ChainSelect } from "./ChainSelect";

// actions
import { setSourceToken } from "../state/tokensSlice";
import { setSourceAmount } from "../state/amountSlice";
import { setSourceChain } from "../state/networksSlice";
import { formatCurrencyAmount } from "../utils";

// hooks
import { useBalance } from "../hooks/apis";

export function Balance({
  token,
  isLoading,
}: {
  token: TokenWithBalance;
  isLoading: boolean;
}) {
  const _formattedBalance = formatCurrencyAmount(
    token?.balance,
    token?.decimals,
    2
  );
  return <span>Bal: {token && _formattedBalance}{isLoading && '...'}</span>;
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
  const sourceAmount = useSelector((state: any) => state.amount.sourceAmount);
  const { data: tokenWithBalance, isBalanceLoading } = useBalance(
    sourceToken?.address,
    sourceChainId,
    "0xF75aAa99e6877fA62375C37c343c51606488cd08"
  );

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
  useEffect(() => {
    const _formattedInputAmount = !!sourceAmount
      ? formatCurrencyAmount(
          sourceAmount,
          sourceToken?.decimals,
          sourceToken?.decimals
        ).toString()
      : "";
    updateInputAmount(_formattedInputAmount);
  }, []);
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
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span>From</span>
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
        onChangeInput={updateInputAmount}
        updateToken={updateToken}
        activeToken={sourceToken}
      />
    </div>
  );
};
