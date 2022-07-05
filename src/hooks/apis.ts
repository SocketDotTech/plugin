import { useEffect, useState } from "react";
import {
  Balances,
  ChainId,
  Route,
  Socket,
  SocketQuote,
  Supported,
  Token
} from "socket-v2-sdk";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import useSWR from "swr";

import { SOCKET_API_KEY, time } from "../consts";

// redux actions
import { setNetworks } from "../state/networksSlice";
import { setTokens } from "../state/tokensSlice";
import { SortOptions } from "socket-v2-sdk/lib/src/client/models/QuoteRequest";

export const socket = new Socket({
  apiKey: SOCKET_API_KEY,
  defaultQuotePreferences: {
    singleTxOnly: false,
  },
});

export const useChains = () => {
  const dispatch = useDispatch();
  const [allChains, setAllChains] = useState(null);
  useEffect(() => {
    async function fetchSupportedNetworks() {
      const supportedNetworks = await Supported.getAllSupportedChains();
      setAllChains(supportedNetworks);
      dispatch(setNetworks(supportedNetworks?.result));
    }
    fetchSupportedNetworks();
  }, []);

  return allChains;
};

export const useTokenList = () => {
  const dispatch = useDispatch();
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const shouldFetch = !!sourceChainId && !!destChainId && sourceChainId !== destChainId;
  useEffect(() => {
    async function fetchTokens() {
      const tokens = await socket.getTokenList({
        fromChainId: sourceChainId,
        toChainId: destChainId,
      });
      const _tokens = {from: tokens?.from?.tokens, to: tokens?.to?.tokens}
      dispatch(setTokens(_tokens));
    }

    shouldFetch && fetchTokens();
  }, [sourceChainId, destChainId]);
};

export const useRoutes = (
  sourceToken,
  destToken,
  amount,
  sort: SortOptions
) => {
  const { address: userAddress } = useAccount();
  const shouldFetch = !!sourceToken && !!destToken && !!amount && !!userAddress;

  async function fetchQuotes(
    sourceToken: Token,
    destToken: Token,
    amount: string,
    userAddress: string,
    sort: SortOptions
  ) {
    const quotes = await socket.getAllQuotes(
      {
        path: { fromToken: sourceToken, toToken: destToken },
        amount,
        address: userAddress,
      },
      {sort}
    );
    return quotes;
  }

  const { data, error, isValidating } = useSWR(
    shouldFetch ? [sourceToken, destToken, amount, userAddress, sort] : null,
    fetchQuotes,
    {
      refreshInterval: time.QUOTES_REFRESH * 1000, //refresh quotes every 60 seconds
      revalidateOnFocus: false,
    }
  );

  return { data: data, isQuotesLoading: (!data && !error) || isValidating };
};

export const useBalance = (
  tokenAddress: string,
  chainId: string,
  userAddress: string
) => {
  const shouldFetch = tokenAddress && chainId && userAddress;

  async function fetchBalance(
    tokenAddress: string,
    chainId: ChainId,
    userAddress: string
  ) {
    const tokenWithBalance = await Balances.getBalance({
      tokenAddress,
      chainId,
      userAddress,
    });
    return tokenWithBalance;
  }

  const { data, error, isValidating } = useSWR(
    shouldFetch ? [tokenAddress, chainId, userAddress] : null,
    fetchBalance,
    {
      refreshInterval: time.BALANCE_REFRESH * 1000, //revalidate after every 60s.
    }
  );

  return {
    data: data?.result,
    isBalanceLoading: (!error && !data) || isValidating,
  };
};