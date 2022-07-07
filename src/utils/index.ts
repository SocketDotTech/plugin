import { ethers } from "ethers";
import { hexStripZeros } from "ethers/lib/utils";
import { SOCKET_API_KEY } from "../consts";

export const fetcher = async (url: string) =>
  fetch(url, {
    headers: {
      "API-KEY": SOCKET_API_KEY,
    },
  }).then((res) => res.json());

export const formatCurrencyAmount = (
  value: number | string,
  units: number,
  decimals?: number
) => {
  // const formattedAmount = truncateDecimalValue(value.toString(), units);
  const result = !!value
    ? ethers.utils.formatUnits(value?.toString(), units)
    : "";
  if (result == "0.0" || !result) return 0;

  if (!!decimals) return truncateDecimalValue(result, decimals);

  return result;
};

export const truncateDecimalValue = (
  value: number | string,
  decimals: number
) => {
  // truncate upto number of decimals
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (decimals || -1) + "})?", "g");
  return value?.toString().match(re)?.[0];
};

export async function addNetwork(chain): Promise<null | void> {
  const formattedChainId = hexStripZeros(
    ethers.BigNumber.from(chain?.chainId).toHexString()
  );
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: formattedChainId,
          chainName: chain.name,
          rpcUrls: chain.rpcs,
          nativeCurrency: chain.currency,
          blockExplorerUrls: chain.explorers,
        },
      ],
    });
  } catch (error) {
    console.error("error adding eth network: ", chain?.chainId, chain, error);
  }
}

export const handleNetworkChange = async (provider, chain) => {
  console.log("chain", chain);
  const formattedChainId = hexStripZeros(
    ethers.BigNumber.from(chain?.chainId).toHexString()
  );
  try {
    console.log("in handle network", provider, provider?.request);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: formattedChainId }],
    });
  } catch (error) {
    // network not available
    if (error.code === 4902) {
      addNetwork(chain);
    }
  }
};

export enum ExplorerDataType {
  TRANSACTION = "transaction",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

export function getExplorerLink(
  baseUrl: string,
  data: string,
  type: ExplorerDataType
): string {
  switch (type) {
    case ExplorerDataType.TRANSACTION: {
      return `${baseUrl}/tx/${data}`;
    }
    case ExplorerDataType.TOKEN: {
      return `${baseUrl}/token/${data}`;
    }
    case ExplorerDataType.BLOCK: {
      return `${baseUrl}/block/${data}`;
    }
    case ExplorerDataType.ADDRESS:
    default: {
      return `${baseUrl}/address/${data}`;
    }
  }
}
