import { useContext, useEffect, useState } from "react";
import {
  Balances,
  ChainId,
  Routes,
  Socket,
  Supported,
  Token,
} from "socket-v2-sdk";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";

import { time } from "../consts";

// redux actions
import { setNetworks } from "../state/networksSlice";
import { SortOptions } from "socket-v2-sdk/lib/src/client/models/QuoteRequest";

import { Web3Context } from "../providers/Web3Provider";
import { setAllDestTokens, setAllSourceTokens } from "../state/tokensSlice";

export let socket;

// Function that lets you set the api key and preferences. 
export const initSocket = (apiKey) => {
  socket = new Socket({
    apiKey: apiKey,
    defaultQuotePreferences: {
      singleTxOnly: false,
    },
  });
};

// Function to get the chains supported by socket apis.
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

// Function to get all the pending routes.
export const useActiveRoutes = () => {
  const web3Context = useContext(Web3Context);
  // const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const { userAddress } = web3Context.web3Provider;

  async function fetchActiveRoutes(address: string) {
    const result = await Routes.getActiveRoutesForUser({
      userAddress: address,
      routeStatus: "PENDING",
    });
    return result;
  }

  const { data, error, isValidating, mutate } = useSWR(
    userAddress ? [userAddress, "active-routes"] : null,
    fetchActiveRoutes,
    {
      refreshInterval: time.ACTIVE_ROUTES_REFRESH * 1000, //refresh active routes every 30 seconds
    }
  );

  return {
    data: data,
    isQuotesLoading: userAddress && ((!data && !error) || isValidating),
    mutate,
  };
};

// Fetches token lists based on source chain and dest chain. 
export const useTokenList = () => {
  const dispatch = useDispatch();
  const sourceChainId = useSelector(
    (state: any) => state.networks.sourceChainId
  );
  const destChainId = useSelector((state: any) => state.networks.destChainId);
  const shouldFetch =
    !!sourceChainId && !!destChainId && sourceChainId !== destChainId;
  useEffect(() => {
    async function fetchTokens() {
      const tokens = await socket.getTokenList({
        fromChainId: sourceChainId,
        toChainId: destChainId,
      });
      const _tokens = { from: tokens?.from?.tokens, to: tokens?.to?.tokens };
      dispatch(setAllSourceTokens(_tokens?.from));
      dispatch(setAllDestTokens(_tokens?.to));
    }

    shouldFetch && fetchTokens();
  }, [sourceChainId, destChainId]);
};

// Main hook that takes in params and fetches the quotes. 
export const useRoutes = (
  sourceToken,
  destToken,
  amount,
  sort: SortOptions,
  userAddress
) => {
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const shouldFetch =
    !!sourceToken && !!destToken && !!amount && amount !== '0' && !!userAddress && !isTxModalOpen;

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
      { sort }
    );
    return quotes;
  }

  const { data, error, isValidating } = useSWR(
    shouldFetch
      ? [sourceToken, destToken, amount, userAddress, sort, "quotes"]
      : null,
    fetchQuotes,
    {
      refreshInterval: time.QUOTES_REFRESH * 1000, //refresh quotes every 60 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    data: data,
    isQuotesLoading: userAddress && ((!data && !error) || isValidating),
  };
};

// Returns balance of the token address provided
export const useBalance = (
  tokenAddress: string,
  chainId: string,
  userAddress: string
) => {
  const isTxModalOpen = useSelector((state: any) => state.modals.isTxModalOpen);
  const shouldFetch = tokenAddress && chainId && userAddress && !isTxModalOpen;

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
    shouldFetch ? [tokenAddress, chainId, userAddress, "token-balance"] : null,
    fetchBalance,
    {
      refreshInterval: time.BALANCE_REFRESH * 1000, //revalidate after every 60s.
    }
  );

  return {
    data: data?.result,
    isBalanceLoading: userAddress && !error && !data,
  };
};

// Returns all token balances for the user on all chains.
export const useAllTokenBalances = () => {
  const web3Context = useContext(Web3Context);
  const { userAddress } = web3Context.web3Provider;

  async function fetchAllTokenBalances(_userAddress: string) {
    const balances = await Balances.getBalances({
      userAddress: _userAddress,
    });
    return balances;
  }

  const { data, error, isValidating } = useSWR(
    userAddress ? [userAddress, "user-balance"] : null,
    fetchAllTokenBalances,
    {
      refreshInterval: time.USER_BALANCES_REFRESH * 1000,
    }
  );

  return {
    data: data?.result,
    isLoading: userAddress && ((!error && !data) || isValidating),
  };
};
