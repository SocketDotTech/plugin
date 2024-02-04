import { useContext } from "react";
import {
  Balances,
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

/** order in which networks need to be sorted on bungee */
const networkOrder = [
  1, //ethereum
  10, //optimism
  42161, //arbitrum
  137, //polygon
  8453, //base
  324, //zksync era
  1101, //polygon zkevm
  59144, // linea
  56, //bnb chain
  43114, //avalance
  100, //gnosis
  7777777, //zora
  250, //fantom
  1313161554, //aurora
  957, // lyra
];

// Function to get the chains supported by socket apis.
export const useChains = () => {
  const dispatch = useDispatch();

  async function fetchSupportedNetworks() {
    const supportedNetworks = await Supported.getAllSupportedChains();
    // sorting as per order
    const sortedNetworks = networkOrder
      .map((network: number) =>
        supportedNetworks?.result?.find((chain) => chain.chainId === network)
      )
      .filter((network) => network?.chainId);

    // chains missing from the sorting list
    const networkOrderSet = new Set(networkOrder);
    const restChains = supportedNetworks?.result?.filter(
      (chain) => !networkOrderSet.has(chain.chainId)
    );

    const allChains = [...sortedNetworks, ...restChains];
    dispatch(setNetworks(allChains));
    return { result: allChains };
  }

  const { data } = useSWR("fetching chains", fetchSupportedNetworks);
  return data;
};

import { useRoutes } from "./apis/useRoutes";
import { useActiveRoute } from "./apis/useActiveRoute";
import { useNextTx } from "./apis/useNextTx";
import { usePendingRoutes } from "./apis/usePendingRoutes";
import { updateAndRefetch } from "./updateAndRefetch";
import { Network } from "types";
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
    chainId: number,
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
