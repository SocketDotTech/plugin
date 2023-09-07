import { ethers } from "ethers";
import { hexStripZeros } from "ethers/lib/utils";
import { Currency } from "../types";
import { UserTxType } from "../consts";

export const formatCurrencyAmount = (
  value: number | string,
  units: number,
  decimals?: number
) => {
  // const formattedAmount = truncateDecimalValue(value.toString(), units);
  const result = !!value
    ? ethers.utils.formatUnits(value?.toString(), units)
    : "";
  if (result == "0.0" || !result) return "0";

  if (!!decimals) return truncateDecimalValue(result, decimals);

  return result;
};

export const parseCurrencyAmount = (value: string, units: number) => {
  const result =
    !!value && !!units ? ethers.utils.parseUnits(value, units).toString() : "";
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

export async function addNetwork(chain, provider): Promise<null | void> {
  const formattedChainId = hexStripZeros(
    ethers.BigNumber.from(chain?.chainId).toHexString()
  );
  try {
    await provider.send("wallet_addEthereumChain", [
      {
        chainId: formattedChainId,
        chainName: chain.name,
        rpcUrls: chain.rpcs,
        nativeCurrency: chain.currency,
        blockExplorerUrls: chain.explorers,
      },
    ]); // EIP-3085
  } catch (error) {
    console.error("error adding eth network: ", chain?.chainId, chain, error);
  }
}

export const handleNetworkChange = async (provider, chain) => {
  const formattedChainId = hexStripZeros(
    ethers.BigNumber.from(chain?.chainId).toHexString()
  );
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: formattedChainId },
    ]);
  } catch (error) {
    // network not available
    if (error.code === 4902) {
      addNetwork(chain, provider);
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

// Function to convert rgb value to number,number,number form
export function formatRGB(color: string) {
  const formattedColor = color
    .split(",")
    .map((x) => x.replace(/[^0-9.]/g, ""))
    .join(",");
  return formattedColor;
}

// Filters the tokens of a particular chain from the standard token list
export function filterTokensByChain(tokens: Currency[], chainId: number) {
  return tokens.filter((x: Currency) => x.chainId === chainId);
}

export const timeInMinutes = (time: number) => {
  return Math.floor(time / 60) + "m";
};

// To get the swap step
export const getSwapTx = (route: any, currentTx: number) => {
  if (currentTx !== undefined || currentTx !== null) {
    const fundMovr = route?.userTxs?.filter(
      (x) => x.userTxType === UserTxType.FUND_MOVR
    )?.[0];

    const dex = route?.userTxs?.filter(
      (x) => x.userTxType === UserTxType.DEX_SWAP
    )?.[0];

    if (fundMovr?.userTxIndex === currentTx) {
      return fundMovr?.steps?.filter((x) => x.type === "middleware")?.[0];
    } else if (dex?.userTxIndex === currentTx) {
      return dex;
    }
    return null;
  }
};
