/**
 * This adapter converts a viem's walletClient to an ethers.js signer
 * Since plugin uses ethers@5, we are using ethers v5 adapter.
 * 
 * You can check all the adapters here - https://wagmi.sh/react/ethers-adapters
 */

import * as React from "react";
import { type WalletClient, useWalletClient } from "wagmi";
import { providers } from "ethers";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
