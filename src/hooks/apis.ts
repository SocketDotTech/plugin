import { useContext } from "react";
import {
  Balances,
  ChainId,
  Server,
  Socket,
  Supported,
} from "@socket.tech/socket-v2-sdk";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";

import { time } from "../consts";

// redux actions
import { setNetworks } from "../state/networksSlice";

import { Web3Context } from "../providers/Web3Provider";

export let socket;

// Function that lets you set the api key and preferences.
export const initSocket = (apiKey: string, _singleTxOnly: boolean) => {
  socket = new Socket({
    apiKey: apiKey,
    defaultQuotePreferences: {
      singleTxOnly: _singleTxOnly,
    },
  });
};

// Function to get the chains supported by socket apis.
export const useChains = () => {
  const dispatch = useDispatch();

  async function fetchSupportedNetworks() {
    const supportedNetworks = await Supported.getAllSupportedChains();
    dispatch(setNetworks(supportedNetworks?.result));
    return supportedNetworks;
  }

  const { data } = useSWR("fetching chains", fetchSupportedNetworks);
  return data;
};

import { useRoutes } from "./apis/useRoutes";
import { useActiveRoute } from "./apis/useActiveRoute";
import { useNextTx } from "./apis/useNextTx";
import { usePendingRoutes } from "./apis/usePendingRoutes";
import { updateAndRefetch } from "./updateAndRefetch";
export {
  useRoutes,
  useActiveRoute,
  useNextTx,
  usePendingRoutes,
  updateAndRefetch,
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

  const { data, error, isValidating, mutate } = useSWR(
    shouldFetch ? [tokenAddress, chainId, userAddress, "token-balance"] : null,
    fetchBalance
  );

  return {
    data: data?.result,
    isBalanceLoading: userAddress && !error && !data,
    mutate,
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

// for gas price
export const useGasPrice = (chainId) => {
  async function checkGasPrice(_chainId: number) {
    const gasPrice = await Server.getGasPrice({ chainId: _chainId });
    return gasPrice;
  }

  const { data, error, isValidating } = useSWR(
    chainId ? [chainId, "gas price"] : null,
    checkGasPrice
  );

  return {
    data: data?.result,
  };
};
