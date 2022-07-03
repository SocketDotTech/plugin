import React from "react";
import { storiesOf } from "@storybook/react";
import { Bridge } from "../index.tsx";
// import { Bridge } from "widget";
import "./style.css";

import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const stories = storiesOf("Socket Widget", module);
const avalancheChain = {
  id: 43_114,
  name: "Avalanche",
  network: "avalanche",
  iconUrl: "https://example.com/icon.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};
const bnbChain = {
  id: 56,
  name: "BSC",
  network: "bsc",
  iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/BSC.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Chain Native Token",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed1.binance.org",
  },
  blockExplorers: {
    default: { name: "BSC Scan", url: "https://bscscan.com" },
  },
  testnet: false,
};

stories.add("Bridge", () => {
  const { chains, provider } = configureChains(
    [
      chain.mainnet,
      chain.polygon,
      chain.arbitrum,
      chain.optimism,
      avalancheChain,
      bnbChain,
    ],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div style={{ marginBottom: "30px" }}>
          <ConnectButton />
        </div>
        <Bridge provider={provider} customize={{ width: 400 }} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
});
