import React from "react";
import { storiesOf } from "@storybook/react";
import { Bridge } from "../index.tsx";
// import { Bridge } from "widget";
import "./style.css";
import { SOCKET_API_KEY } from "../consts";

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

const gnosisChain = {
  id: 100,
  name: "Gnosis",
  network: "gnosis",
  iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/gnosis.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "xDai",
    symbol: "XDAI",
  },
  rpcUrls: {
    default: "https://rpc.xdaichain.com",
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://blockscout.com/xdai/mainnet" },
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
      gnosisChain
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
        <div style={{height: 'calc(100vh - 40px)', backgroundColor: '#222', padding: '40px'}}>
          <div style={{ marginBottom: "30px" }}>
            <ConnectButton />
          </div>
          <Bridge provider={provider} API_KEY={SOCKET_API_KEY} customize={{borderRadius: 1}}/>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
});
