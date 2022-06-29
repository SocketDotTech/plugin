import { useEffect, useState } from "react";
import {
  Balances,
  Route,
  Socket,
  SocketQuote,
  Supported,
  TokenAsset,
} from "socket-v2-sdk";
import { useDispatch, useSelector } from "react-redux";
import { SOCKET_API_KEY, time } from "../consts";

// redux actions
import { setNetworks } from "../state/networksSlice";
import { setTokens } from "../state/tokensSlice";
import { setQuotes, setBestRoute } from "../state/quotesSlice";
import useSWR from "swr";

const socket = new Socket({
  apiKey: SOCKET_API_KEY,
  defaultQuotePreferences: {
    singleTxOnly: false,
  },
});

export const useChains = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchSupportedNetworks() {
      const supportedNetworks = await Supported.getAllSupportedRoutes();
      dispatch(setNetworks(supportedNetworks?.result));
    }
    fetchSupportedNetworks();
  }, []);
};

export const useTokenList = () => {
  const dispatch = useDispatch();
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  useEffect(() => {
    async function fetchTokens() {
      const tokens = await socket.getTokenList({
        fromChainId: sourceChainId,
        toChainId: destChainId,
      });
      dispatch(setTokens(tokens));
    }

    fetchTokens();
  }, [sourceChainId, destChainId]);
};

export const useRoutes = (
  sourceToken,
  destToken,
  amount,
  sort: "output" | "gas" | "time"
) => {
  const dispatch = useDispatch();
  const shouldFetch = !!sourceToken && !!destToken && !!amount;

  async function fetchQuotes(
    sourceToken: TokenAsset,
    destToken: TokenAsset,
    amount: string,
    userAddress: string,
    sort: "output" | "gas" | "time"
  ) {
    const quotes = await socket.getAllQuotes(
      {
        path: { fromToken: sourceToken, toToken: destToken },
        amount,
        address: userAddress,
      },
      { sort: sort }
    );
    return quotes;
  }

  const { data, error, isValidating } = useSWR(
    shouldFetch
      ? [
          sourceToken,
          destToken,
          amount,
          "0xF75aAa99e6877fA62375C37c343c51606488cd08",
          sort
        ]
      : null,
    fetchQuotes,
    {
      refreshInterval: time.QUOTES_REFRESH * 1000, //refresh quotes every 60 seconds
      revalidateOnFocus: false,
    }
  );

  if (data) {
    dispatch(setQuotes(data));
    dispatch(setBestRoute(data?.[0]));
  data.forEach((x, index) => console.log(index, x?.route?.usedBridgeNames?.[0]));
  } else {
    dispatch(setQuotes(null));
    dispatch(setBestRoute(null));
  }

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
    chainId: string,
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
