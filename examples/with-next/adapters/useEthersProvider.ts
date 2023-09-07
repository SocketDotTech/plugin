/**
 * This adapter converts a viem publicClient to an ethers.js provider
 * Since plugin uses ethers@5, we are using ethers v5 adapter.
 * 
 * The below adapter is a toned down version of wagmi's "public client -> provider" ethers@5 adapter
 * You can check all the adapters here - https://wagmi.sh/react/ethers-adapters
 */

import * as React from "react";
import { type PublicClient, usePublicClient } from "wagmi";
import { providers } from "ethers";

export function publicClientToProvider(publicClient: PublicClient) {
  const { transport } = publicClient;
  return new providers.Web3Provider(transport);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient]
  );
}
